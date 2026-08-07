import { NextResponse } from "next/server";
import type { Where } from "payload";

import { clientIp, isBotRequest, visitorHash } from "@/lib/attribution";
import type { ResolvedTouch } from "@/lib/attribution";
import type { Visit } from "@/payload-types";
import { VISITOR_COOKIE } from "@/lib/consent";
import { getSite } from "@/lib/content";
import { companyNotification } from "@/lib/email/companyNotification";
import { customerConfirmation } from "@/lib/email/customerConfirmation";
import { countryFromHeaders } from "@/lib/geo";
import { createTransport } from "@/lib/mail";
import { getPayloadClient } from "@/lib/payload";
import { verifyTurnstile } from "@/lib/turnstile";
import { contactSchema } from "@/lib/validation";

export const runtime = "nodejs";

const FROM_DOMAIN = process.env.DOMAIN || "doxaplc.com";

// Lightweight in-memory rate limit. The app runs as a single standalone
// replica, so a per-instance map is sufficient for a marketing contact form.
// Note this now also caps how often the form can trigger mail to an arbitrary
// address, since a confirmation goes to whatever email is submitted.
const RATE_LIMIT_MS = 30_000;
const lastSeen = new Map<string, number>();

type TouchRecord = Partial<ResolvedTouch>;

const TOUCH_KEYS = [
  "channel",
  "utmSource",
  "utmMedium",
  "utmCampaign",
  "utmTerm",
  "utmContent",
  "gclid",
  "fbclid",
  "msclkid",
  "ttclid",
  "liFatId",
  "referrer",
  "referrerHost",
  "landingPath",
] as const;

/** Copies only the attribution fields off a visit row. */
function toTouch(visit: Visit | undefined): TouchRecord | null {
  if (!visit) return null;
  const out: Record<string, unknown> = {};
  for (const key of TOUCH_KEYS) {
    const value = visit[key];
    if (value != null) out[key] = value;
  }
  return Object.keys(out).length > 0 ? (out as TouchRecord) : null;
}

function cookieValue(header: string | null, name: string): string | null {
  if (!header) return null;
  const hit = header
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));
  return hit ? hit.slice(name.length + 1) || null : null;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 },
    );
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please check the form and try again." },
      { status: 422 },
    );
  }
  const data = parsed.data;

  /**
   * Bot checks, part one: the two that answer 200 OK and silently do nothing.
   *
   * Silence rather than an error is deliberate HERE, and only here: an error
   * message tells the author of a spam script exactly which check caught them,
   * which is free tuning feedback. A success they can never see the result of
   * gives them nothing to iterate against.
   *
   * Both are safe to fail silently because a false positive is close to
   * impossible. A human never fills a display:none field, and a human's browser
   * never sends a user agent that names a crawler.
   *
   * The Turnstile check below is NOT safe to fail silently, and does not. See
   * the comment there.
   *
   * These catch unsophisticated automation. Anything that runs a real browser
   * and waits will get through, which is what a challenge is for.
   */
  if (data._gotcha) return NextResponse.json({ ok: true });

  if (
    isBotRequest({
      userAgent: req.headers.get("user-agent") ?? "",
      headers: req.headers,
    })
  ) {
    return NextResponse.json({ ok: true });
  }

  const ip = clientIp(req.headers);

  /**
   * Turnstile, verified HERE rather than in a separate endpoint the browser
   * calls first. A check that happens anywhere other than the request that
   * creates the lead can be skipped by posting straight to this route.
   *
   * `verifyTurnstile` fails open when Turnstile is unconfigured, unreachable,
   * or misconfigured on our side, and fails closed only when Cloudflare
   * actively rejects a token. See lib/turnstile.ts.
   *
   * This one answers with a VISIBLE error, unlike the two checks above.
   *
   * The silent-200 treatment was extended to here at first and it was wrong.
   * A missing token is indistinguishable server-side from a bot that posted
   * straight to this route, but on the visitor's side it is overwhelmingly a
   * widget that could not run: an ad blocker that eats challenges.cloudflare
   * .com, no network to Cloudflare, an outage, or the hostname missing from
   * the widget's allowed list. That last one was reproduced here and returns
   * client error 110200 for EVERY visitor on the affected hostname.
   *
   * With a silent 200 the form pushes to /thank-you, so those people are told
   * their enquiry arrived while it is dropped on the floor. Losing every
   * enquiry from a domain typo, invisibly, is far worse than a spam script
   * learning that a challenge exists, which it can already see in the page
   * source. So say so, and name a route to a human that does not depend on
   * the thing that just broke.
   */
  const turnstile = await verifyTurnstile(data._turnstile, ip);
  if (!turnstile.ok) {
    console.warn(`contact: turnstile ${turnstile.reason}`);
    const { email } = await getSite();
    return NextResponse.json(
      {
        ok: false,
        error: `We could not verify your browser, so this message was not sent. Please email us at ${email} and we will pick it up from there.`,
      },
      { status: 403 },
    );
  }

  const now = Date.now();
  if (now - (lastSeen.get(ip) ?? 0) < RATE_LIMIT_MS) {
    return NextResponse.json(
      { ok: false, error: "Please wait a moment before sending again." },
      { status: 429 },
    );
  }

  const geoCountry = countryFromHeaders(req.headers);

  // --- 1. Resolve attribution ----------------------------------------------
  // A persistent id gives real multi-day history. Without one we fall back to
  // today's rotating hash, which still catches the common case of someone
  // clicking an ad and enquiring in the same session.
  const visitorId = cookieValue(req.headers.get("cookie"), VISITOR_COOKIE);
  const hash = visitorHash(ip, req.headers.get("user-agent") ?? "");

  let firstTouch: TouchRecord | null = null;
  let lastTouch: TouchRecord | null = null;

  const payload = await getPayloadClient();

  try {
    const where: Where = visitorId
      ? { visitorId: { equals: visitorId } }
      : { visitorHash: { equals: hash } };

    const [first, last] = await Promise.all([
      payload.find({
        collection: "visits",
        where,
        sort: "createdAt",
        limit: 1,
        depth: 0,
        overrideAccess: true,
      }),
      payload.find({
        collection: "visits",
        where,
        sort: "-createdAt",
        limit: 1,
        depth: 0,
        overrideAccess: true,
      }),
    ]);

    firstTouch = toTouch(first.docs[0]);
    lastTouch = toTouch(last.docs[0]);
  } catch (err) {
    // Attribution is a nice-to-have. Never let it cost us the enquiry.
    console.error("contact: attribution lookup failed", err);
  }

  // --- 2. Persist FIRST -----------------------------------------------------
  // This is the source of truth. The previous implementation sent one email
  // and stored nothing, so an SMTP failure destroyed the enquiry outright.
  let leadId: string | number | null = null;
  try {
    const lead = await payload.create({
      collection: "leads",
      data: {
        name: data.name,
        email: data.email,
        company: data.company || null,
        country: data.country,
        projectType: data.projectType,
        budget: data.budget,
        message: data.message,
        status: "new",
        visitorHash: hash,
        visitorId,
        geoCountry,
        firstTouch: firstTouch ?? undefined,
        lastTouch: lastTouch ?? undefined,
      },
      overrideAccess: true,
    });
    leadId = lead.id;
  } catch (err) {
    console.error("contact: failed to persist lead", err);
  }

  // --- 3 & 4. Deliver, best effort -----------------------------------------
  const site = await getSite();

  const notification = companyNotification({
    ...data,
    company: data.company || null,
    geoCountry,
    firstTouch,
    lastTouch,
    leadId,
  });
  const confirmation = customerConfirmation({
    ...data,
    company: data.company || null,
    // So the "need us sooner" contact routes match what the site shows.
    site,
  });

  let notificationSent = false;
  let confirmationSent = false;
  const errors: string[] = [];

  try {
    const transport = createTransport();
    const from = `Doxa Website <web-contact@${FROM_DOMAIN}>`;

    // Settled, not all: one failing must not skip the other.
    const [notifyResult, confirmResult] = await Promise.allSettled([
      transport.sendMail({
        from,
        /**
         * Both emails now address the same CMS-managed inbox, from opposite
         * ends: the customer is told to reply to it, and this is delivered
         * into it. Changing `email` in /olympus moves both together, which is
         * the point, and there is no env var to forget to update alongside it.
         *
         * This replaced CONTACT_NOTIFY_TO / CONTACT_TO. Those allowed alerts
         * to go somewhere private, separate from the public address; that
         * split was deliberately given up in favour of one place to change.
         * Reintroducing it means adding the env var back here, not editing
         * the CMS.
         */
        to: site.email,
        replyTo: data.email,
        subject: notification.subject,
        html: notification.html,
        text: notification.text,
      }),
      transport.sendMail({
        from: `Doxa Innovations <hello@${FROM_DOMAIN}>`,
        to: data.email,
        /**
         * The address the body of this very email already tells them to write
         * to. Taking it from the same CMS value the body renders means the
         * header and the visible text can never disagree.
         */
        replyTo: site.email,
        subject: confirmation.subject,
        html: confirmation.html,
        text: confirmation.text,
      }),
    ]);

    notificationSent = notifyResult.status === "fulfilled";
    confirmationSent = confirmResult.status === "fulfilled";
    if (notifyResult.status === "rejected")
      errors.push(`notification: ${String(notifyResult.reason)}`);
    if (confirmResult.status === "rejected")
      errors.push(`confirmation: ${String(confirmResult.reason)}`);
  } catch (err) {
    errors.push(`transport: ${String(err)}`);
  }

  if (errors.length > 0) console.error("contact: mail failure", errors);

  // Record delivery outcomes on the lead so a broken SMTP config is visible in
  // /olympus rather than discovered weeks later by an inbox that went quiet.
  if (leadId !== null) {
    try {
      await payload.update({
        collection: "leads",
        id: leadId,
        data: {
          notificationSent,
          confirmationSent,
          deliveryError: errors.length > 0 ? errors.join(" | ").slice(0, 500) : null,
        },
        overrideAccess: true,
      });
    } catch (err) {
      console.error("contact: failed to record delivery status", err);
    }
  }

  // --- 5. Respond -----------------------------------------------------------
  // The enquiry is safe if EITHER it was stored or somebody was told about it.
  // Only a total failure of both is worth showing the visitor an error, since
  // that is the only case where retrying actually helps them.
  if (leadId === null && !notificationSent) {
    return NextResponse.json(
      { ok: false, error: "Something went wrong sending your message." },
      { status: 500 },
    );
  }

  lastSeen.set(ip, now);
  return NextResponse.json({ ok: true });
}

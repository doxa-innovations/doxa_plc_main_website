import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import {
  clientIp,
  deviceClass,
  isBotRequest,
  resolveTouch,
  visitorHash,
} from "@/lib/attribution";
import {
  CONSENT_MAX_AGE,
  VISITOR_COOKIE,
  consentFromCookieHeader,
} from "@/lib/consent";
import { countryFromHeaders } from "@/lib/geo";
import { getPayloadClient } from "@/lib/payload";

export const runtime = "nodejs";

/**
 * Visit beacon.
 *
 * A beacon rather than middleware or a server component: middleware would add
 * latency to every request including assets, and doing this in a server
 * component would force routes dynamic for a reason unrelated to their
 * content. Here the write happens after the page is already interactive and
 * cannot slow anything down.
 *
 * This endpoint NEVER fails the caller. Analytics breaking must not be visible
 * to a visitor, so every path returns 204 and problems are logged server-side.
 */

/** Inactivity window that defines a session. Matches the GA convention. */
const SESSION_WINDOW_MS = 30 * 60 * 1000;

function noContent(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

export async function POST(req: Request) {
  try {
    const userAgent = req.headers.get("user-agent") ?? "";

    const body = (await req.json().catch(() => null)) as {
      url?: unknown;
      referrer?: unknown;
      automation?: unknown;
    } | null;

    /**
     * Drop bots before anything is stored.
     *
     * Not a block: the crawler already has the page, and blocking search
     * engines would be self-harm. It is simply not counted, because a
     * crawler in the visit table inflates Visits and therefore deflates the
     * lead rate, which is the number ad spend gets judged by.
     */
    if (
      isBotRequest({
        userAgent,
        headers: req.headers,
        clientReportedAutomation: body?.automation === true,
      })
    ) {
      return noContent();
    }

    const device = deviceClass(userAgent);

    const landingUrl = typeof body?.url === "string" ? body.url : null;
    if (!landingUrl) return noContent();

    const referrer =
      typeof body?.referrer === "string" && body.referrer.length > 0
        ? body.referrer
        : null;

    const hash = visitorHash(clientIp(req.headers), userAgent);
    const consent = consentFromCookieHeader(req.headers.get("cookie"));
    const analyticsGranted = consent?.analytics === true;

    // Only read the persistent id when analytics consent is present. Reading a
    // stale cookie from a visitor who has since withdrawn would keep linking
    // their sessions against their wishes.
    const existingVid = analyticsGranted
      ? req.headers
          .get("cookie")
          ?.split(";")
          .map((c) => c.trim())
          .find((c) => c.startsWith(`${VISITOR_COOKIE}=`))
          ?.slice(VISITOR_COOKIE.length + 1) || null
      : null;

    const visitorId = analyticsGranted ? existingVid || randomUUID() : null;

    const payload = await getPayloadClient();

    // Session de-duplication happens server-side, on purpose. Doing it with
    // sessionStorage would mean writing to the visitor's device to decide
    // whether we are allowed to measure them, which is the thing this design
    // exists to avoid.
    //
    // Matching on the hash OR the id matters. The banner re-fires this beacon
    // the moment analytics consent is granted, so the visitor arrives here a
    // second time within the same session now carrying a freshly minted id.
    // Matching on the id alone would find nothing and log the same session
    // twice, inflating every visit count and halving the lead rate.
    const since = new Date(Date.now() - SESSION_WINDOW_MS).toISOString();
    const recent = await payload.find({
      collection: "visits",
      where: {
        and: [
          {
            or: [
              { visitorHash: { equals: hash } },
              ...(visitorId ? [{ visitorId: { equals: visitorId } }] : []),
            ],
          },
          { createdAt: { greater_than: since } },
        ],
      },
      limit: 1,
      depth: 0,
      sort: "-createdAt",
      overrideAccess: true,
    });

    const existing = recent.docs[0];

    if (existing) {
      // Upgrade the session already in flight rather than starting a new one:
      // consent was granted mid-visit, and the visit is still the same visit.
      if (visitorId && !existing.visitorId) {
        await payload.update({
          collection: "visits",
          id: existing.id,
          data: { visitorId, consented: true },
          overrideAccess: true,
        });
      }
    } else {
      const selfHost = (() => {
        try {
          return new URL(landingUrl).hostname;
        } catch {
          return null;
        }
      })();

      const touch = resolveTouch({ landingUrl, referrer, selfHost });

      await payload.create({
        collection: "visits",
        data: {
          visitorHash: hash,
          visitorId,
          ...touch,
          country: countryFromHeaders(req.headers),
          deviceClass: device,
          consented: analyticsGranted,
        },
        overrideAccess: true,
      });
    }

    const res = noContent();

    if (visitorId) {
      res.cookies.set(VISITOR_COOKIE, visitorId, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: CONSENT_MAX_AGE,
      });
    }

    return res;
  } catch (err) {
    console.error("beacon: failed to record visit", err);
    return noContent();
  }
}

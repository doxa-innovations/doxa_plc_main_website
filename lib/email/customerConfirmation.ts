import { SITE as STATIC_SITE } from "@/content/site";
import type { SiteConfig } from "@/content/types";
import { escapeHtml } from "@/lib/mail";

import { EMAIL, button, emailShell, factRow, sectionTitle } from "./shell";

export interface ConfirmationInput {
  name: string;
  email: string;
  company?: string | null;
  country: string;
  projectType: string;
  budget: string;
  message: string;
  /**
   * CMS-backed contact details. Falls back to the static config so a database
   * problem never stops the confirmation going out with a working phone
   * number, just possibly a stale one.
   */
  site?: SiteConfig;
}

/**
 * The confirmation the person who filled in the form receives.
 *
 * Its job is to close the loop: prove the message arrived, show exactly what
 * was sent so they can spot a mistake, say when they will hear back, and give
 * them a faster route if they need one. The site's whole argument is that an
 * overseas team can be trusted, and going quiet after someone reaches out is
 * the fastest way to undermine that.
 *
 * Voice matches the site: plain and specific, no marketing throat-clearing.
 */
export function customerConfirmation(input: ConfirmationInput): {
  subject: string;
  html: string;
  text: string;
} {
  const SITE = input.site ?? STATIC_SITE;
  const firstName = input.name.trim().split(/\s+/)[0] || input.name;
  const whatsappUrl = `https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}`;
  const telegramUrl = `https://t.me/${SITE.telegram}`;

  const subject = `We have your enquiry, ${firstName}`;

  const rows = [
    factRow("Name", escapeHtml(input.name)),
    input.company
      ? factRow("Company", escapeHtml(input.company))
      : "",
    factRow("Email", escapeHtml(input.email)),
    factRow("Country", escapeHtml(input.country)),
    factRow("Project type", escapeHtml(input.projectType)),
    factRow("Budget", escapeHtml(input.budget)),
  ].join("");

  const steps = [
    "A person reads your message. Not a sales sequence.",
    "We reply within one business day with questions or a time to talk.",
    "The first call is free, and there is no upfront payment.",
  ]
    .map(
      (step, i) => `
<tr>
  <td style="padding:0 12px 0 0;vertical-align:top;font-family:${EMAIL.font};font-size:13px;font-weight:700;color:${EMAIL.brand};line-height:1.6;">${i + 1}.</td>
  <td style="padding:0 0 10px;vertical-align:top;font-family:${EMAIL.font};font-size:14px;color:${EMAIL.ink};line-height:1.6;">${escapeHtml(step)}</td>
</tr>`,
    )
    .join("");

  const bodyHtml = `
<h1 style="margin:0 0 12px;font-family:${EMAIL.font};font-size:26px;line-height:1.2;font-weight:700;letter-spacing:-0.02em;color:${EMAIL.ink};">Thanks ${escapeHtml(firstName)}, we have it.</h1>

<p style="margin:0 0 28px;font-family:${EMAIL.font};font-size:15px;line-height:1.65;color:${EMAIL.inkMuted};">
  Your message reached us and someone on the team will read it properly. Here is a copy of what you sent, so you can check we got it right.
</p>

${sectionTitle("What you sent us")}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 12px;">
${rows}
</table>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px;">
  <tr>
    <td style="padding:14px 0 0;font-family:${EMAIL.font};line-height:1.6;">
      <span style="font-size:13px;color:${EMAIL.inkMuted};">Your message</span><br>
      <span style="font-size:14px;color:${EMAIL.ink};white-space:pre-wrap;">${escapeHtml(input.message)}</span>
    </td>
  </tr>
</table>

${sectionTitle("What happens next")}
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px;">
${steps}
</table>

${button(`${SITE.url}/works`, "See what we have built")}

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 0;">
  <tr>
    <td bgcolor="${EMAIL.surfaceMuted}" style="background-color:${EMAIL.surfaceMuted};border-radius:14px;padding:18px 20px;font-family:${EMAIL.font};font-size:14px;line-height:1.7;color:${EMAIL.inkMuted};">
      <span style="color:${EMAIL.ink};font-weight:600;">Need us sooner?</span><br>
      Email <a href="mailto:${SITE.email}" style="color:${EMAIL.brand};">${SITE.email}</a><br>
      WhatsApp <a href="${whatsappUrl}" style="color:${EMAIL.brand};">${escapeHtml(SITE.phone)}</a><br>
      Telegram <a href="${telegramUrl}" style="color:${EMAIL.brand};">@${escapeHtml(SITE.telegram)}</a>
    </td>
  </tr>
</table>`;

  const footerHtml = `
<p style="margin:0 0 6px;">${escapeHtml(SITE.legalName)}</p>
<p style="margin:0 0 6px;">${escapeHtml(
    [SITE.address.street, SITE.address.city, SITE.address.region, SITE.address.country].join(", "),
  )}</p>
<p style="margin:0;">You are receiving this because you submitted the contact form on <a href="${SITE.url}" style="color:${EMAIL.brand};">${SITE.url.replace(/^https?:\/\//, "")}</a>. This is a one-off confirmation, not a mailing list.</p>`;

  const text = `Thanks ${firstName}, we have it.

Your message reached us and someone on the team will read it properly.
Here is a copy of what you sent, so you can check we got it right.

WHAT YOU SENT US
Name: ${input.name}
${input.company ? `Company: ${input.company}\n` : ""}Email: ${input.email}
Country: ${input.country}
Project type: ${input.projectType}
Budget: ${input.budget}

Your message:
${input.message}

WHAT HAPPENS NEXT
1. A person reads your message. Not a sales sequence.
2. We reply within one business day with questions or a time to talk.
3. The first call is free, and there is no upfront payment.

See what we have built: ${SITE.url}/works

NEED US SOONER?
Email: ${SITE.email}
WhatsApp: ${SITE.phone} (${whatsappUrl})
Telegram: @${SITE.telegram} (${telegramUrl})

${SITE.legalName}
${[SITE.address.street, SITE.address.city, SITE.address.region, SITE.address.country].join(", ")}

You are receiving this because you submitted the contact form on ${SITE.url}.
This is a one-off confirmation, not a mailing list.`;

  return {
    subject,
    html: emailShell({
      title: subject,
      preheader: "Here is a copy of what you sent, and what happens next.",
      bodyHtml,
      footerHtml,
    }),
    text,
  };
}

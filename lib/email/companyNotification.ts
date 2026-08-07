import { SITE } from "@/content/site";
import type { ResolvedTouch } from "@/lib/attribution";
import { escapeHtml } from "@/lib/mail";

import { EMAIL, emailShell, factRow, sectionTitle } from "./shell";

export interface NotificationInput {
  name: string;
  email: string;
  company?: string | null;
  country: string;
  projectType: string;
  budget: string;
  message: string;
  geoCountry?: string | null;
  firstTouch?: Partial<ResolvedTouch> | null;
  lastTouch?: Partial<ResolvedTouch> | null;
  /** Link straight to the record in the admin panel. */
  leadId?: string | number | null;
}

/**
 * The internal "new enquiry" notification.
 *
 * Same visual system as the customer email but denser, and it carries the
 * attribution inline. That last part is the point: knowing an enquiry came
 * from a paid Google click on a specific campaign is what turns the analytics
 * from a dashboard nobody opens into something visible at the moment a
 * decision gets made.
 *
 * Reply-To is set to the customer, so hitting reply just works.
 */
export function companyNotification(input: NotificationInput): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `New enquiry, ${input.name} (${input.projectType})`;

  const submitted = [
    factRow("Name", escapeHtml(input.name)),
    factRow(
      "Email",
      `<a href="mailto:${escapeHtml(input.email)}" style="color:${EMAIL.brand};">${escapeHtml(input.email)}</a>`,
    ),
    input.company ? factRow("Company", escapeHtml(input.company)) : "",
    factRow("Country (stated)", escapeHtml(input.country)),
    input.geoCountry
      ? factRow("Country (detected)", escapeHtml(input.geoCountry))
      : "",
    factRow("Project type", escapeHtml(input.projectType)),
    factRow("Budget", escapeHtml(input.budget)),
  ].join("");

  const touchRows = (touch: Partial<ResolvedTouch> | null | undefined) => {
    if (!touch) return "";
    const pairs: [string, string | null | undefined][] = [
      ["Channel", touch.channel],
      ["Source", touch.utmSource],
      ["Medium", touch.utmMedium],
      ["Campaign", touch.utmCampaign],
      ["Term", touch.utmTerm],
      ["Google click id", touch.gclid],
      ["Meta click id", touch.fbclid],
      ["Referrer", touch.referrerHost],
      ["Landing page", touch.landingPath],
    ];
    const rendered = pairs
      .filter(([, v]) => Boolean(v))
      .map(([k, v]) => factRow(k, escapeHtml(String(v))))
      .join("");
    return rendered || factRow("Channel", "Direct");
  };

  const sameTouch =
    JSON.stringify(input.firstTouch ?? null) ===
    JSON.stringify(input.lastTouch ?? null);

  const attribution = `
${sectionTitle(sameTouch ? "Where they came from" : "First touch")}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 ${sameTouch ? "0" : "24"}px;">
${touchRows(input.firstTouch)}
</table>
${
  sameTouch
    ? ""
    : `${sectionTitle("Last touch, the visit that converted")}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
${touchRows(input.lastTouch)}
</table>`
}`;

  const bodyHtml = `
<h1 style="margin:0 0 6px;font-family:${EMAIL.font};font-size:24px;line-height:1.2;font-weight:700;letter-spacing:-0.02em;color:${EMAIL.ink};">New enquiry</h1>
<p style="margin:0 0 28px;font-family:${EMAIL.font};font-size:14px;color:${EMAIL.inkMuted};">
  Reply to this email to answer ${escapeHtml(input.name)} directly.
</p>

${sectionTitle("Submission")}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
${submitted}
</table>

${sectionTitle("Message")}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px;">
  <tr>
    <td bgcolor="${EMAIL.surfaceMuted}" style="background-color:${EMAIL.surfaceMuted};border-radius:14px;padding:16px 18px;font-family:${EMAIL.font};font-size:14px;line-height:1.7;color:${EMAIL.ink};white-space:pre-wrap;">${escapeHtml(input.message)}</td>
  </tr>
</table>

${attribution}`;

  const footerHtml = `<p style="margin:0;">Sent by the contact form on ${escapeHtml(SITE.url.replace(/^https?:\/\//, ""))}${input.leadId ? `. Lead #${escapeHtml(String(input.leadId))}` : ""}.</p>`;

  const textTouch = (
    label: string,
    touch: Partial<ResolvedTouch> | null | undefined,
  ) => {
    if (!touch) return "";
    const lines = [
      ["Channel", touch.channel],
      ["Source", touch.utmSource],
      ["Medium", touch.utmMedium],
      ["Campaign", touch.utmCampaign],
      ["Google click id", touch.gclid],
      ["Meta click id", touch.fbclid],
      ["Referrer", touch.referrerHost],
      ["Landing page", touch.landingPath],
    ]
      .filter(([, v]) => Boolean(v))
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");
    return `\n${label}\n${lines || "Channel: Direct"}\n`;
  };

  const text = `NEW ENQUIRY
Reply to this email to answer ${input.name} directly.

SUBMISSION
Name: ${input.name}
Email: ${input.email}
${input.company ? `Company: ${input.company}\n` : ""}Country (stated): ${input.country}
${input.geoCountry ? `Country (detected): ${input.geoCountry}\n` : ""}Project type: ${input.projectType}
Budget: ${input.budget}

MESSAGE
${input.message}
${textTouch(sameTouch ? "WHERE THEY CAME FROM" : "FIRST TOUCH", input.firstTouch)}${
    sameTouch ? "" : textTouch("LAST TOUCH, THE VISIT THAT CONVERTED", input.lastTouch)
  }
Sent by the contact form on ${SITE.url}${input.leadId ? `. Lead #${input.leadId}` : ""}.`;

  return {
    subject,
    html: emailShell({
      title: subject,
      preheader: `${input.projectType}, ${input.budget}, from ${input.lastTouch?.channel ?? "Direct"}`,
      bodyHtml,
      footerHtml,
    }),
    text,
  };
}

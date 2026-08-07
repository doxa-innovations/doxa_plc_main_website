import { escapeHtml } from "@/lib/mail";

/**
 * The shared email shell.
 *
 * Hand-written HTML rather than a component library, because email is not the
 * web. Every rule below exists because a specific client breaks without it:
 *
 *  - Table layout, never flex or grid. Outlook on Windows renders through
 *    Word's engine, which supports neither.
 *  - Inline styles on every element, PLUS `bgcolor` attributes, because some
 *    clients strip CSS background declarations but honour the attribute.
 *  - A `<style>` block is used only for media queries, which cannot be inlined.
 *  - No web fonts. Georama is a local .ttf loaded through next/font, and
 *    @font-face is stripped by Gmail, Outlook desktop and Yahoo. The stack
 *    below renders Georama in Apple Mail and iOS Mail and degrades cleanly
 *    everywhere else. The brand is carried by the logo, the palette and the
 *    layout instead.
 *  - `color-scheme: dark` is declared so Gmail and Apple Mail do not
 *    auto-invert an already-dark design into something muddy.
 *  - The design must survive every image being blocked, which many clients do
 *    by default, so no image is load-bearing.
 */

const CDN = "https://cdn.doxaplc.com/doxa-public";

export const EMAIL = {
  logo: `${CDN}/logo.png`,
  font: "Georama, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  // Solid hex only. rgba() is unreliable across clients, so the translucent
  // surface tokens from the site are flattened to their composited values.
  deep: "#0d0020",
  surface: "#14002e",
  surfaceMuted: "#1e0a45",
  surfaceNested: "#2a1458",
  line: "#2e1a52",
  ink: "#f3effb",
  inkMuted: "#b8a8d8",
  brand: "#b277d3",
  primary: "#8a5fc0",
} as const;

export function button(href: string, label: string): string {
  // A table-wrapped anchor, not a <button>. Border-radius rounds in modern
  // clients and squares off in Outlook, which is an acceptable degradation.
  return `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
  <tr>
    <td align="center" bgcolor="${EMAIL.primary}" style="border-radius:999px;background-color:${EMAIL.primary};">
      <a href="${escapeHtml(href)}" style="display:inline-block;padding:14px 28px;font-family:${EMAIL.font};font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:999px;">${escapeHtml(label)}</a>
    </td>
  </tr>
</table>`;
}

/** A label/value row for the summary tables. `value` is escaped by the caller. */
export function factRow(label: string, valueHtml: string): string {
  return `
<tr>
  <td style="padding:10px 0;border-bottom:1px solid ${EMAIL.line};font-family:${EMAIL.font};font-size:13px;color:${EMAIL.inkMuted};white-space:nowrap;vertical-align:top;width:38%;">${escapeHtml(label)}</td>
  <td style="padding:10px 0 10px 16px;border-bottom:1px solid ${EMAIL.line};font-family:${EMAIL.font};font-size:14px;color:${EMAIL.ink};vertical-align:top;">${valueHtml}</td>
</tr>`;
}

export function sectionTitle(text: string): string {
  return `<p style="margin:0 0 12px;font-family:${EMAIL.font};font-size:11px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:${EMAIL.brand};">${escapeHtml(text)}</p>`;
}

export interface ShellArgs {
  title: string;
  /** Inbox preview line. Shown next to the subject before the mail is opened. */
  preheader: string;
  bodyHtml: string;
  /** Small print under the card. */
  footerHtml: string;
}

export function emailShell({
  title,
  preheader,
  bodyHtml,
  footerHtml,
}: ShellArgs): string {
  return `<!DOCTYPE html>
<html lang="en" style="color-scheme:dark;">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>${escapeHtml(title)}</title>
<style>
  :root { color-scheme: dark; supported-color-schemes: dark; }
  body { margin:0 !important; padding:0 !important; width:100% !important; }
  table { border-collapse:collapse !important; }
  img { border:0; outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; }
  a { color:${EMAIL.brand}; }
  @media only screen and (max-width:620px) {
    .wrap { width:100% !important; }
    .pad { padding-left:20px !important; padding-right:20px !important; }
    .stack { display:block !important; width:100% !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:${EMAIL.deep};">
<!-- Preheader: shown in the inbox list, hidden in the body. -->
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;font-size:1px;line-height:1px;color:${EMAIL.deep};">${escapeHtml(preheader)}</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${EMAIL.deep}" style="background-color:${EMAIL.deep};">
  <tr>
    <td align="center" style="padding:32px 12px;">

      <table role="presentation" class="wrap" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">

        <!-- Header -->
        <tr>
          <td class="pad" style="padding:0 8px 20px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="left" style="vertical-align:middle;">
                  <img src="${EMAIL.logo}" width="34" height="34" alt="Doxa Innovations" style="display:inline-block;vertical-align:middle;width:34px;height:34px;">
                  <span style="display:inline-block;vertical-align:middle;padding-left:10px;font-family:${EMAIL.font};font-size:17px;font-weight:700;color:${EMAIL.ink};letter-spacing:-0.02em;">Doxa Innovations</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Card -->
        <tr>
          <td bgcolor="${EMAIL.surface}" style="background-color:${EMAIL.surface};border:1px solid ${EMAIL.line};border-radius:18px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td class="pad" style="padding:32px;">
${bodyHtml}
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td class="pad" style="padding:24px 8px 0;font-family:${EMAIL.font};font-size:12px;line-height:1.6;color:${EMAIL.inkMuted};">
${footerHtml}
          </td>
        </tr>

      </table>

    </td>
  </tr>
</table>
</body>
</html>`;
}

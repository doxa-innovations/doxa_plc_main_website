/**
 * Pushing events to Google Tag Manager.
 *
 * Browser-only, and deliberately free of any `process.env` read: this module is
 * imported by client components, and a non-`NEXT_PUBLIC_` variable referenced
 * there compiles to `undefined` rather than failing loudly. The container id
 * lives in `components/analytics/GoogleTagManager.tsx`, which is a server
 * component and can read it safely.
 *
 * Everything here is a no-op when no container is installed. The push lands in
 * a plain array nobody reads, which is exactly what should happen — the call
 * sites stay identical whether or not GTM is switched on, so turning it on is
 * an environment variable and not a code change.
 */

/** Fired when either contact form successfully creates a lead. */
export const LEAD_EVENT = "generate_lead";

/** Which form produced the lead. Sent as a parameter, not two event names. */
export type LeadSource = "contact-page" | "home-wizard";

/**
 * Pushes a custom event for a GTM trigger to match on.
 *
 * Never throws and never awaits. A tag manager failing is not a reason for a
 * visitor's form submission to visibly break, and the caller is on the path to
 * /thank-you when this runs.
 */
export function pushEvent(
  event: string,
  params: Record<string, string | number | boolean> = {},
): void {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...params });
  } catch {
    // Measurement must never surface an error to a visitor.
  }
}

/**
 * The one conversion that matters: an enquiry reached the database.
 *
 * Called from the forms rather than from /thank-you, because that page is a
 * plain URL anyone can open, share or reload. A pageview-triggered conversion
 * there would count refreshes and direct visits as leads, and the number it
 * reported would be the number ad bidding optimises against.
 *
 * Deliberately carries no name, email, company or message. Whether an enquiry
 * happened is measurement; who sent it is not Google's business, and consent
 * for analytics is not consent to hand over a customer's contact details.
 */
export function trackLead(source: LeadSource): void {
  pushEvent(LEAD_EVENT, { form: source });
}

"use client";

/**
 * Reopens the consent banner from the footer.
 *
 * Withdrawing consent has to be as easy as giving it, so this link is
 * permanent and sits with the other legal links rather than being buried in
 * the privacy policy.
 *
 * A window event rather than shared state: the banner is mounted in the root
 * layout and the footer is a server component, so a context provider would
 * mean converting the footer to a client component to reach a single boolean.
 */
export function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("doxa:open-consent"))}
      className={className}
    >
      Cookie settings
    </button>
  );
}

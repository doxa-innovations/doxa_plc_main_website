import type { ConsentState } from "@/lib/consent";

/**
 * Google Consent Mode v2.
 *
 * Google requires these signals for EEA traffic before any of its tags may
 * measure a user. Wiring the plumbing now, while no tag is installed, means
 * turning on Google Ads later is an environment variable rather than a
 * re-architecture, and means the default-denied state is already correct on
 * the very first pageview an ad ever sends here.
 *
 * Nothing third-party loads until NEXT_PUBLIC_GOOGLE_ADS_ID (or _GA_ID) is
 * set. Until then this only pushes into a local dataLayer array, which costs
 * a few bytes and no network requests.
 */

type ConsentValue = "granted" | "denied";

interface ConsentSignals {
  ad_storage: ConsentValue;
  ad_user_data: ConsentValue;
  ad_personalization: ConsentValue;
  analytics_storage: ConsentValue;
  functionality_storage: ConsentValue;
  security_storage: ConsentValue;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Google's own snippet is `function gtag(){dataLayer.push(arguments)}`. It
 * pushes the arguments OBJECT, not an array, and gtag.js replays the queue
 * expecting exactly that shape. The parameters below are declared purely to
 * type the call sites; the body intentionally reads `arguments` instead.
 */
/* eslint-disable prefer-rest-params, @typescript-eslint/no-unused-vars */
function gtag(_command: string, _action: string, _params: object): void {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(arguments);
}
/* eslint-enable prefer-rest-params, @typescript-eslint/no-unused-vars */

function signals(state: ConsentState | null): ConsentSignals {
  const marketing = state?.marketing === true ? "granted" : "denied";
  const analytics = state?.analytics === true ? "granted" : "denied";
  return {
    ad_storage: marketing,
    ad_user_data: marketing,
    ad_personalization: marketing,
    analytics_storage: analytics,
    // Strictly necessary storage. Always available, never gated by the banner.
    functionality_storage: "granted",
    security_storage: "granted",
  };
}

let defaultsSet = false;

/**
 * Call on every page load before anything else, and again on every change.
 *
 * The `default` command MUST be pushed before any Google tag loads, otherwise
 * the tag runs briefly in an unconsented state. `wait_for_update` tells the
 * tag to hold for 500ms in case a stored choice is still being read.
 */
export function applyConsentMode(state: ConsentState | null): void {
  if (typeof window === "undefined") return;

  if (!defaultsSet) {
    defaultsSet = true;
    gtag("consent", "default", {
      ...signals(null),
      wait_for_update: 500,
    });
  }

  if (state) {
    gtag("consent", "update", signals(state));
  }
}

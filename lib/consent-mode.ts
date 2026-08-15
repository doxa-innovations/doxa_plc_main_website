import {
  CONSENT_COOKIE,
  CONSENT_POLICY_VERSION,
  type ConsentState,
} from "@/lib/consent";

/**
 * Google Consent Mode v2.
 *
 * Google requires these signals for EEA traffic before any of its tags may
 * measure a user. The default state is everything denied, and it has to be in
 * the dataLayer BEFORE the Google Tag Manager container loads — a tag that
 * starts before the default runs briefly in an unconsented state, which is the
 * exact failure the mode exists to prevent.
 *
 * That ordering is why this file exports a script SOURCE as well as a runtime
 * function. `consentBootstrapScript()` is rendered inline in the document head
 * (`app/layout.tsx`), so it executes during HTML parsing, ahead of every other
 * script on the page. `applyConsentMode()` handles what comes after: the
 * visitor changing their mind, long after hydration.
 *
 * Nothing third-party loads until GTM_CONTAINER_ID is set. Until then this
 * only pushes into a local dataLayer array, which costs a few bytes and no
 * network requests.
 */

type ConsentValue = "granted" | "denied";

/**
 * Which banner toggle each Google signal answers to. Single source of truth:
 * both the runtime object and the generated inline script are derived from it,
 * so a signal cannot be granted in one path and denied in the other.
 *
 * "always" is strictly necessary storage, never gated by the banner.
 */
const SIGNAL_SOURCE = {
  ad_storage: "marketing",
  ad_user_data: "marketing",
  ad_personalization: "marketing",
  analytics_storage: "analytics",
  functionality_storage: "always",
  security_storage: "always",
} as const;

type SignalName = keyof typeof SIGNAL_SOURCE;
type ConsentSignals = Record<SignalName, ConsentValue>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    /** Set by the inline bootstrap once `consent default` has been pushed. */
    __doxaConsentDefaults?: boolean;
    /**
     * The last signal set pushed as an update, serialized. Lets the bootstrap
     * and the React tree agree on what has already been sent, since they run
     * in different modules and cannot share a variable.
     */
    __doxaConsentLast?: string;
  }
}

/**
 * Google's own snippet is `function gtag(){dataLayer.push(arguments)}`. It
 * pushes the arguments OBJECT, not an array, and the container replays the
 * queue expecting exactly that shape. The parameters below are declared purely
 * to type the call sites; the body intentionally reads `arguments` instead.
 */
/* eslint-disable prefer-rest-params, @typescript-eslint/no-unused-vars */
function gtag(_command: string, _action: string, _params: object): void {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(arguments);
}
/* eslint-enable prefer-rest-params, @typescript-eslint/no-unused-vars */

function signals(state: ConsentState | null): ConsentSignals {
  const out = {} as ConsentSignals;
  for (const name of Object.keys(SIGNAL_SOURCE) as SignalName[]) {
    const source = SIGNAL_SOURCE[name];
    out[name] =
      source === "always" || state?.[source] === true ? "granted" : "denied";
  }
  return out;
}

/**
 * The inline head script, as source.
 *
 * It does three things, in order: define the dataLayer and the gtag shim, push
 * the all-denied default, then read any stored choice straight off
 * `document.cookie` and push the update immediately.
 *
 * That last step is the point. Waiting for React to hydrate and run
 * `applyConsentMode` would leave a returning visitor who accepted everything
 * sitting in the denied default for the first few hundred milliseconds of
 * every page load, losing the measurement they agreed to. Reading the cookie
 * synchronously here closes that window entirely.
 *
 * `wait_for_update: 500` covers the remaining case — a container that somehow
 * loads before this — by telling it to hold briefly rather than fire denied.
 *
 * Kept deliberately small and dependency-free: it is inlined into the HTML of
 * every page, and it must not throw, because it runs before any error handling
 * exists. Hence the bare try/catch around the cookie parse.
 */
export function consentBootstrapScript(): string {
  const defaults = JSON.stringify({ ...signals(null), wait_for_update: 500 });

  const prefix = `${CONSENT_COOKIE}=`;
  const update = (Object.keys(SIGNAL_SOURCE) as SignalName[])
    .map((name) => {
      const source = SIGNAL_SOURCE[name];
      return source === "always"
        ? `${name}:'granted'`
        : `${name}:s.${source}===true?'granted':'denied'`;
    })
    .join(",");

  return (
    `window.dataLayer=window.dataLayer||[];` +
    `function gtag(){dataLayer.push(arguments)}` +
    `gtag('consent','default',${defaults});` +
    `window.__doxaConsentDefaults=true;` +
    `try{` +
    `var c=document.cookie.split('; ').filter(function(p){return p.indexOf('${prefix}')===0})[0];` +
    `if(c){` +
    `var s=JSON.parse(decodeURIComponent(c.slice(${prefix.length})));` +
    `if(s&&s.v===${CONSENT_POLICY_VERSION}){` +
    `var u={${update}};gtag('consent','update',u);` +
    `window.__doxaConsentLast=JSON.stringify(u);` +
    `}` +
    `}` +
    `}catch(e){}`
  );
}

/**
 * Call on every change of consent, and on mount as a fallback.
 *
 * The default push is normally the bootstrap script's job. The guard here is
 * for the case where it did not run — a page rendered outside the root layout,
 * or the script blocked — so the denied default still lands before any update.
 */
export function applyConsentMode(state: ConsentState | null): void {
  if (typeof window === "undefined") return;

  if (!window.__doxaConsentDefaults) {
    window.__doxaConsentDefaults = true;
    gtag("consent", "default", {
      ...signals(null),
      wait_for_update: 500,
    });
  }

  if (!state) return;

  // Skip an update identical to the last one. On a return visit the bootstrap
  // has already pushed the stored choice synchronously, and ConsentManager
  // then calls this on mount as its fallback; without the check every such
  // pageview sends the same signals twice.
  //
  // Comparing serialized objects is safe because both this and the inline
  // script build their key order from SIGNAL_SOURCE.
  const next = JSON.stringify(signals(state));
  if (window.__doxaConsentLast === next) return;

  window.__doxaConsentLast = next;
  gtag("consent", "update", JSON.parse(next) as ConsentSignals);
}

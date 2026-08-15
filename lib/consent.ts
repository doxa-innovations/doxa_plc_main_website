/**
 * Consent state, shared by the banner (client) and the beacon (server).
 *
 * Deliberately dependency-free and isomorphic: the banner has to read this
 * before React hydrates to avoid flashing, and the beacon has to read the same
 * value from a request header.
 */

/**
 * Bump ONLY when what we collect materially changes. Doing so invalidates
 * every stored choice and re-prompts every visitor, which is the correct and
 * legally required behaviour: consent is given against a specific description
 * of processing, so changing the processing voids the old answer.
 */
/*
 * 1 → 2: Google Analytics and Microsoft Clarity were added behind the
 * Analytics toggle. Clarity records sessions — pointer movement, clicks,
 * scrolling — and replays them. Nobody who ticked "Analytics" in version 1 was
 * agreeing to be recorded, so their answer does not carry over.
 */
export const CONSENT_POLICY_VERSION = 2;

export const CONSENT_COOKIE = "doxa_consent";

/** Set only after analytics consent. httpOnly, so only the server reads it. */
export const VISITOR_COOKIE = "doxa_vid";

/** Twelve months. Also the point at which we re-ask. */
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 365;

export interface ConsentState {
  /** Policy version this choice was made against. */
  v: number;
  /** Analytics: the persistent visitor cookie and cross-session attribution. */
  analytics: boolean;
  /** Marketing: advertising tags and conversion measurement. */
  marketing: boolean;
  /** ISO timestamp of the decision. */
  at: string;
}

export type ConsentAction =
  | "accept-all"
  | "reject-all"
  | "custom"
  | "withdrawn";

export const DENY_ALL: Omit<ConsentState, "at" | "v"> = {
  analytics: false,
  marketing: false,
};

/**
 * Parses a stored choice, returning null when there isn't a usable one.
 *
 * A stale policy version is treated as no consent rather than as the old
 * answer. Failing closed is the only defensible direction here.
 */
export function parseConsent(raw: string | null | undefined): ConsentState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<ConsentState>;
    if (parsed.v !== CONSENT_POLICY_VERSION) return null;
    if (typeof parsed.analytics !== "boolean") return null;
    if (typeof parsed.marketing !== "boolean") return null;
    return {
      v: CONSENT_POLICY_VERSION,
      analytics: parsed.analytics,
      marketing: parsed.marketing,
      at: typeof parsed.at === "string" ? parsed.at : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function serializeConsent(state: ConsentState): string {
  return encodeURIComponent(JSON.stringify(state));
}

/** Reads the choice from a raw Cookie header. Used by route handlers. */
export function consentFromCookieHeader(header: string | null): ConsentState | null {
  if (!header) return null;
  for (const part of header.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === CONSENT_COOKIE) return parseConsent(rest.join("="));
  }
  return null;
}

// --- Browser-only helpers ---------------------------------------------------

export function readConsentCookie(): ConsentState | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${CONSENT_COOKIE}=`));
  return parseConsent(match?.slice(CONSENT_COOKIE.length + 1));
}

export function writeConsentCookie(state: ConsentState): void {
  if (typeof document === "undefined") return;
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie =
    `${CONSENT_COOKIE}=${serializeConsent(state)}` +
    `; Path=/; Max-Age=${CONSENT_MAX_AGE}; SameSite=Lax${secure}`;
  notifyConsentChanged();
}

// --- External store ---------------------------------------------------------
//
// The cookie is browser-only state that React has to read WITHOUT causing a
// hydration mismatch. `useSyncExternalStore` is the primitive built for
// exactly this: it serves `getServerSnapshot` during SSR and the first
// hydration pass, then swaps to the real value. Reading it in an effect
// instead would work, but only by triggering the cascading re-render that
// react-hooks/set-state-in-effect exists to catch.

const listeners = new Set<() => void>();

/** Cached so getSnapshot returns a referentially stable value between changes. */
let snapshot: ConsentState | null = null;
let snapshotRaw: string | null = null;

export function subscribeToConsent(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function notifyConsentChanged(): void {
  snapshotRaw = null; // force a re-parse on the next read
  for (const listener of listeners) listener();
}

/**
 * `undefined` means "not yet known" (server render and the hydration pass),
 * `null` means "no valid stored choice", an object means a stored choice.
 *
 * The three-way result matters: without it, "still hydrating" and "never
 * decided" are indistinguishable, and the banner races itself open for
 * visitors who already answered.
 *
 * getSnapshot must be referentially stable or React re-renders forever, so the
 * parsed object is cached against the raw cookie string.
 */
export function getConsentSnapshot(): ConsentState | null | undefined {
  if (typeof document === "undefined") return undefined;
  const raw = document.cookie;
  if (raw !== snapshotRaw) {
    snapshotRaw = raw;
    snapshot = readConsentCookie();
  }
  return snapshot;
}

export function getConsentServerSnapshot(): ConsentState | null | undefined {
  return undefined;
}

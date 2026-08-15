import "server-only";

/**
 * Cloudflare Turnstile verification.
 *
 * Runs on the SERVER, inside the same request that creates the lead. That
 * placement is the whole security property: a check performed anywhere else,
 * such as a separate endpoint the browser calls first, can simply be skipped
 * by posting straight to the contact route. The token has to be proven in the
 * request that does the work.
 *
 * Turnstile was chosen over reCAPTCHA deliberately. It gives the same
 * invisible, no-click experience, but does not set tracking cookies or profile
 * visitors, so it can run for everyone without consent and without
 * contradicting the cookie banner. Cloudflare already serves this site, so it
 * introduces no new sub-processor to name in the privacy policy.
 */

const VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Cloudflare's own guidance is a short timeout with a graceful fallback. */
const TIMEOUT_MS = 5000;

export type TurnstileResult =
  | { ok: true; reason: "verified" | "not-configured" | "unavailable" }
  | { ok: false; reason: "missing-token" | "rejected" };

/**
 * The site key is deliberately NOT named NEXT_PUBLIC_*.
 *
 * That prefix means "inline this into the client bundle at build time", and
 * the Docker build has no environment variables. The key would compile to an
 * empty string, the widget would never render, and yet the server, reading its
 * own runtime environment, would see the secret set and start demanding a
 * token nobody could produce. Every real enquiry would be silently rejected.
 *
 * It is read here on the server at request time and handed to the form as a
 * prop instead, so the two halves cannot disagree. The value is still public,
 * it just does not need baking into the bundle to get there.
 */
export function turnstileSiteKey(): string {
  return process.env.TURNSTILE_SITE_KEY ?? "";
}

export function isTurnstileConfigured(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY && turnstileSiteKey());
}

/**
 * Verifies a Turnstile token.
 *
 * Three deliberate escape hatches, all of which return ok:
 *
 *  - Not configured. Local development and the period before the keys land
 *    must not have a dead contact form.
 *  - Cloudflare unreachable or slow. Losing a real enquiry because someone
 *    else's API had a blip is a worse outcome than letting one spam message
 *    through, so a transport failure fails OPEN and is logged loudly.
 *  - A malformed response. Same reasoning.
 *
 * A token that is present and genuinely rejected fails CLOSED. That is the
 * only case where a submission is refused, and it is the case the widget
 * exists for.
 */
export async function verifyTurnstile(
  token: string | undefined | null,
  remoteIp?: string,
): Promise<TurnstileResult> {
  if (!isTurnstileConfigured()) return { ok: true, reason: "not-configured" };

  if (!token) return { ok: false, reason: "missing-token" };

  const body = new URLSearchParams({
    secret: process.env.TURNSTILE_SECRET_KEY!,
    response: token,
  });
  // Cloudflare uses this to sharpen its own scoring. Skipped when unknown so
  // we never send the literal string "unknown" as an address.
  if (remoteIp && remoteIp !== "unknown") body.set("remoteip", remoteIp);

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`turnstile: siteverify returned HTTP ${res.status}`);
      return { ok: true, reason: "unavailable" };
    }

    const data = (await res.json()) as {
      success?: boolean;
      "error-codes"?: string[];
    };

    if (data.success === true) return { ok: true, reason: "verified" };

    const codes = data["error-codes"] ?? [];

    /**
     * These mean OUR configuration is broken, not that the visitor is a bot.
     * Refusing real people because a key was mistyped is the worst possible
     * failure here, so it fails open and shouts in the logs instead.
     */
    const ourFault = codes.some((c) =>
      [
        "missing-input-secret",
        "invalid-input-secret",
        "bad-request",
        "internal-error",
      ].includes(c),
    );

    if (ourFault) {
      console.error(
        `turnstile: MISCONFIGURED, allowing submission through. Codes: ${codes.join(", ")}`,
      );
      return { ok: true, reason: "unavailable" };
    }

    return { ok: false, reason: "rejected" };
  } catch (err) {
    // Timeout or network failure. Fail open.
    console.error("turnstile: verification unreachable", err);
    return { ok: true, reason: "unavailable" };
  }
}

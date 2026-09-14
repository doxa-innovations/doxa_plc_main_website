import "server-only";

import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { createLocalReq, getFieldsToSign, jwtSign, type Payload } from "payload";
import { addSessionToUser, generatePayloadCookie } from "payload/shared";

import type { User } from "@/payload-types";
import { getPayloadClient } from "@/lib/payload";

/**
 * "Continue with Google" for /olympus.
 *
 * A plain OpenID Connect authorization-code flow with PKCE, in two route
 * handlers under /olympus/login/google. It deliberately ends by issuing a
 * normal Payload session and `payload-token` cookie, exactly as
 * `payload.login()` does, so nothing downstream knows or cares how the user
 * signed in: `proxy.ts`, `requireUser()` and `logoutAction` are unchanged.
 *
 * The password form stays as a fallback. The Google account below is the only
 * one this path lets in.
 */

/**
 * Who may sign in with Google. Hard-coded on purpose: widening access should go
 * through code review, and a constant cannot be misconfigured into "anyone",
 * which an empty or mistyped environment variable could.
 */
export const ALLOWED_GOOGLE_EMAILS: readonly string[] = [
  "doxainnovationsplc@gmail.com",
];

// Same normalisation as payload.config.ts. The redirect URI is built from
// this, never from the request, so it must match an "Authorized redirect URI"
// in Google Cloud Console character for character.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://doxaplc.com"
).replace(/\/$/, "");

const START_PATH = "/olympus/login/google";
const CALLBACK_PATH = `${START_PATH}/callback`;

/**
 * Absolute on purpose. Starting on SITE_URL guarantees the state cookie is set
 * on the same host Google sends the callback to; a visitor who arrived on
 * www would otherwise lose the cookie between the two legs.
 */
export const GOOGLE_START_URL = `${SITE_URL}${START_PATH}`;
const REDIRECT_URI = `${SITE_URL}${CALLBACK_PATH}`;

const STATE_COOKIE = "olympus-google-oauth";
const STATE_MAX_AGE = 10 * 60; // seconds

const GOOGLE_ISSUERS = ["https://accounts.google.com", "accounts.google.com"];

// Module-level so the signing keys are fetched once and cached by jose, not
// once per sign-in.
const GOOGLE_JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/oauth2/v3/certs"),
);

export interface GoogleConfig {
  clientId: string;
  clientSecret: string;
}

/**
 * Read at request time, with no NEXT_PUBLIC_ prefix, for the same reason as
 * TURNSTILE_SITE_KEY: the Docker build has no environment. `null` hides the
 * button and turns both routes into a redirect back to the login page.
 */
export function getGoogleConfig(): GoogleConfig | null {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret };
}

function randomToken(): string {
  return randomBytes(32).toString("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

interface PendingSignIn {
  state: string;
  nonce: string;
  verifier: string;
}

function parsePending(raw: string | undefined): PendingSignIn | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (
      value &&
      typeof value === "object" &&
      "state" in value &&
      "nonce" in value &&
      "verifier" in value &&
      typeof value.state === "string" &&
      typeof value.nonce === "string" &&
      typeof value.verifier === "string"
    ) {
      return { state: value.state, nonce: value.nonce, verifier: value.verifier };
    }
  } catch {
    // Fall through: a malformed cookie is the same as no cookie.
  }
  return null;
}

/**
 * First leg. Remembers state, nonce and the PKCE verifier in a short-lived
 * cookie scoped to /olympus/login/google, and returns the Google URL to send
 * the browser to.
 */
export async function beginGoogleSignIn(google: GoogleConfig): Promise<string> {
  const pending: PendingSignIn = {
    state: randomToken(),
    nonce: randomToken(),
    verifier: randomToken(),
  };

  (await cookies()).set(STATE_COOKIE, JSON.stringify(pending), {
    httpOnly: true,
    // Lax, not Strict: the callback is a cross-site top-level navigation from
    // accounts.google.com, and Strict would withhold the cookie from it.
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: START_PATH,
    maxAge: STATE_MAX_AGE,
  });

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.search = new URLSearchParams({
    client_id: google.clientId,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
    state: pending.state,
    nonce: pending.nonce,
    code_challenge: createHash("sha256")
      .update(pending.verifier)
      .digest("base64url"),
    code_challenge_method: "S256",
    // A hint, not a restriction: it preselects the account in the chooser.
    // The allowlist check in the callback is what actually enforces it.
    login_hint: ALLOWED_GOOGLE_EMAILS[0],
    prompt: "select_account",
  }).toString();

  return url.toString();
}

export type GoogleSignInResult =
  | { ok: true }
  | { ok: false; code: "google" | "google-account"; reason: string };

function fail(reason: string): GoogleSignInResult {
  return { ok: false, code: "google", reason };
}

/**
 * Second leg. Validates everything Google sent back and, only if all of it
 * holds, starts a Payload session. Never throws: every failure comes back as a
 * result, so the route handler can redirect OUTSIDE any try/catch (redirect()
 * signals by throwing).
 */
export async function finishGoogleSignIn(
  google: GoogleConfig,
  params: URLSearchParams,
): Promise<GoogleSignInResult> {
  const store = await cookies();
  const pending = parsePending(store.get(STATE_COOKIE)?.value);
  // Single use, whatever happens next. Deleting needs the same path it was
  // set with, or the browser keeps it.
  store.delete({ name: STATE_COOKIE, path: START_PATH });

  // The person cancelled on Google's screen, or Google refused.
  const googleError = params.get("error");
  if (googleError) return fail(`google returned ${googleError}`);

  if (!pending) return fail("missing or expired state cookie");

  const state = params.get("state");
  if (!state || !safeEqual(state, pending.state)) return fail("state mismatch");

  const code = params.get("code");
  if (!code) return fail("no authorization code");

  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: google.clientId,
        client_secret: google.clientSecret,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
        code_verifier: pending.verifier,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) return fail(`token exchange HTTP ${response.status}`);

    const tokens = (await response.json()) as { id_token?: unknown };
    if (typeof tokens.id_token !== "string") return fail("no id_token");

    // The token came straight from Google over TLS, which the OIDC spec
    // accepts on its own. Verifying the signature anyway costs one cached key
    // lookup and means nothing here trusts a network path.
    const { payload: claims } = await jwtVerify(tokens.id_token, GOOGLE_JWKS, {
      issuer: GOOGLE_ISSUERS,
      audience: google.clientId,
    });

    if (typeof claims.nonce !== "string" || !safeEqual(claims.nonce, pending.nonce)) {
      return fail("nonce mismatch");
    }
    if (claims.email_verified !== true || typeof claims.email !== "string") {
      return fail("email missing or unverified");
    }

    const email = claims.email.trim().toLowerCase();
    if (!ALLOWED_GOOGLE_EMAILS.includes(email)) {
      return { ok: false, code: "google-account", reason: "account not allowed" };
    }

    const name =
      typeof claims.name === "string" && claims.name.trim()
        ? claims.name.trim()
        : email.split("@")[0];

    await startPayloadSession(email, name);
    return { ok: true };
  } catch (err) {
    console.error("olympus: google sign-in failed", err);
    return fail("unexpected error");
  }
}

async function findUser(payload: Payload, email: string): Promise<User | null> {
  // Through the database adapter, as Payload's own login operation does, so
  // the result includes `sessions` and the write below does not wipe the
  // user's other sessions.
  return payload.db.findOne<User>({
    collection: "users",
    where: { email: { equals: email } },
  });
}

/**
 * Mirrors the tail of Payload's login operation
 * (node_modules/payload/dist/auth/operations/login.js): add a session, sign a
 * JWT carrying its id, and set the same cookie `@payloadcms/next/auth` sets.
 * `JWTAuthentication` rejects a token whose `sid` is not on the user, so the
 * session step is not optional.
 */
async function startPayloadSession(email: string, name: string): Promise<void> {
  const payload = await getPayloadClient();
  const collectionConfig = payload.collections.users.config;
  const authConfig = collectionConfig.auth;

  let user = await findUser(payload, email);
  if (!user) {
    // First Google sign-in for this address. The password is random and
    // never shown to anyone, so this account cannot use the password form.
    await payload.create({
      collection: "users",
      data: { email, name, password: randomToken() },
      overrideAccess: true,
    });
    user = await findUser(payload, email);
    if (!user) throw new Error("user was not found after creation");
  }

  const req = await createLocalReq({}, payload);

  // A verified Google sign-in clears a lockout left by failed password
  // attempts. There is no other unlock path; see collections/Users.ts.
  if (user.loginAttempts || user.lockUntil) {
    user.loginAttempts = 0;
    user.lockUntil = null;
    await payload.db.updateOne({
      id: user.id,
      collection: "users",
      data: { loginAttempts: 0, lockUntil: null },
      req,
      returning: false,
    });
  }

  const { sid } = await addSessionToUser({ collectionConfig, payload, req, user });

  const { token } = await jwtSign({
    fieldsToSign: getFieldsToSign({ collectionConfig, email, sid, user }),
    secret: payload.secret,
    tokenExpiration: authConfig.tokenExpiration,
  });

  const cookie = generatePayloadCookie({
    collectionAuthConfig: authConfig,
    cookiePrefix: payload.config.cookiePrefix,
    returnCookieAsObject: true,
    token,
  });

  (await cookies()).set(cookie.name, token, {
    domain: cookie.domain,
    expires: cookie.expires ? new Date(cookie.expires) : undefined,
    httpOnly: true,
    path: "/",
    sameSite:
      typeof authConfig.cookies.sameSite === "string"
        ? (authConfig.cookies.sameSite.toLowerCase() as "lax" | "strict" | "none")
        : "lax",
    secure: authConfig.cookies.secure || false,
  });
}

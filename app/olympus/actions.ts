"use server";

import { login, logout } from "@payloadcms/next/auth";
import { headers as nextHeaders } from "next/headers";
import { redirect } from "next/navigation";
import config from "@payload-config";

import { clientIp } from "@/lib/attribution";

/**
 * Auth actions for /olympus.
 *
 * `login` and `logout` come from @payloadcms/next/auth rather than being
 * hand-rolled: they call the Local API and set or clear the httpOnly
 * `payload-token` cookie with the right flags in one step. Payload also gives
 * us account lockout for free (5 attempts, 10 minutes), which is the part of
 * brute-force protection that actually matters.
 */

// Per-IP throttle on top of Payload's per-account lockout. Lockout alone does
// not stop someone spraying one password across many addresses, and it would
// let an attacker lock a known admin out on purpose.
const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 8;
const attempts = new Map<string, { count: number; resetAt: number }>();

function throttled(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

export interface LoginState {
  error?: string;
}

/**
 * Every failure returns the SAME message. Distinguishing "no such account"
 * from "wrong password" hands an attacker a free account enumerator, and
 * distinguishing "locked" tells them the lockout landed.
 */
const GENERIC_ERROR = "Those details did not work. Try again.";

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { error: GENERIC_ERROR };

  if (throttled(clientIp(await nextHeaders()))) {
    return { error: "Too many attempts. Wait a minute and try again." };
  }

  try {
    await login({ collection: "users", config, email, password });
  } catch {
    return { error: GENERIC_ERROR };
  }

  // Outside the try: redirect() signals by throwing, so catching it here would
  // swallow the navigation and show a login error on a successful sign-in.
  redirect("/olympus");
}

export async function logoutAction(): Promise<void> {
  try {
    await logout({ allSessions: true, config });
  } catch {
    // Already signed out, or the token was stale. Either way, send them on.
  }
  redirect("/olympus/login");
}

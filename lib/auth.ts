import "server-only";

import { cache } from "react";
import { headers as nextHeaders } from "next/headers";
import { redirect } from "next/navigation";
import type { TypedUser } from "payload";

import { getPayloadClient } from "@/lib/payload";

/**
 * Resolves the signed-in admin from the `payload-token` cookie.
 *
 * Sessions are enabled, so every call costs a database round-trip: Payload
 * verifies the JWT and then loads the user plus its session array. Call this
 * ONCE per request, in the /olympus layout, and pass the user down. Calling it
 * per component multiplies queries for no benefit.
 *
 * Uses `headers()`, so any route that calls it renders dynamically. That is
 * correct for an authenticated panel and must never be cached.
 */
/**
 * Wrapped in React `cache()` so the layout and the page it renders share one
 * lookup. Without it, guarding both (which we must, see requireUser) would
 * cost two database round trips per request.
 */
export const getCurrentUser = cache(async (): Promise<TypedUser | null> => {
  // headers() FIRST, deliberately. It is the request-time API that tells Next
  // this route cannot be prerendered. Opening the Payload connection before
  // this line means `next build` tries to reach Postgres while generating the
  // page, which fails the Docker build where no database exists.
  const requestHeaders = await nextHeaders();
  const payload = await getPayloadClient();
  const { user } = await payload.auth({ headers: requestHeaders });
  return user;
});

/**
 * Sends anonymous visitors to the login page.
 *
 * EVERY authenticated page must call this ITSELF, before it queries anything.
 * Relying on the layout alone is not enough and is not a style preference:
 * React Server Components render a layout and its child page CONCURRENTLY, so
 * an unguarded page runs its queries and renders real data while the layout is
 * still awaiting this check. Next then ships that rendered output as the body
 * of the 307 redirect. A browser follows the redirect and shows none of it, but
 * `curl` reads the body directly, which leaked customer names and email
 * addresses to anonymous requests until this was fixed.
 */
export async function requireUser(): Promise<TypedUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/olympus/login");
  return user;
}

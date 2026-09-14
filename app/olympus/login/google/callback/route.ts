import type { NextRequest } from "next/server";
import { redirect } from "next/navigation";

import { finishGoogleSignIn, getGoogleConfig } from "@/lib/google-auth";

/**
 * Where Google sends the browser back to. Everything that can fail is inside
 * `finishGoogleSignIn`, which returns a result instead of throwing, so the
 * redirects here stay outside any try/catch (redirect() signals by throwing).
 */
export async function GET(request: NextRequest) {
  const google = getGoogleConfig();
  if (!google) redirect("/olympus/login");

  const result = await finishGoogleSignIn(google, request.nextUrl.searchParams);

  if (!result.ok) {
    // The reason is for the server log only. The page shows one of two
    // messages and never says which check failed.
    console.warn(`olympus: google sign-in refused (${result.reason})`);
    redirect(`/olympus/login?error=${result.code}`);
  }

  /**
   * NOT redirect("/olympus"), and this is load-bearing.
   *
   * A 307 here continues the redirect chain that started on
   * accounts.google.com, so the browser requests /olympus with
   * `Sec-Fetch-Site: cross-site`. Payload's cookie extraction (see
   * node_modules/payload/dist/auth/extractJWT.js) ignores the auth cookie on
   * any request with no Origin header unless Sec-Fetch-Site is same-origin,
   * same-site or none. The session would be valid and still unreadable, and
   * the person would land back on the login page looking signed out.
   *
   * Ending the chain with a page that navigates itself makes the next request
   * a fresh, same-origin navigation. The cookie set by finishGoogleSignIn
   * rides on this response.
   */
  return new Response(HANDOFF_HTML, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      // The address bar still holds the spent ?code=&state=. Keep it out of
      // the Referer of the next request.
      "referrer-policy": "no-referrer",
    },
  });
}

const HANDOFF_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex, nofollow">
<meta http-equiv="refresh" content="0;url=/olympus">
<title>Signing in…</title>
<style>html{background:#14002e;color:#b8a8d8;font:14px system-ui,sans-serif}body{display:grid;min-height:100vh;margin:0;place-items:center}a{color:inherit}</style>
</head>
<body><p>Signing you in… <a href="/olympus">Continue</a></p></body>
</html>`;

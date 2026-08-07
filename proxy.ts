import { NextResponse, type NextRequest } from "next/server";

/**
 * First line of defence for /olympus.
 *
 * (Next 16 renamed the `middleware` file convention to `proxy`; the old name
 * still works but logs a deprecation warning.)
 *
 * This only checks that an auth cookie is PRESENT. It does not verify the
 * token, which needs the secret and a database lookup, and doing that here
 * would put a query in front of every request to the panel. Real verification
 * happens in `requireUser()`, which every panel page calls before it fetches.
 *
 * The value of stopping here is that an anonymous request never reaches the
 * React tree. That matters because a layout and its page render CONCURRENTLY:
 * without a page-level guard, an unauthenticated request still executes the
 * page's queries, and Next ships that rendered output as the body of the
 * redirect. Browsers follow the redirect and show none of it, but any client
 * that reads the body sees the data. This leaked customer names and email
 * addresses until it was fixed.
 *
 * Both layers are kept deliberately. This one is cheap and catches the
 * anonymous case; the per-page `requireUser()` does the real authentication
 * and also covers forged or expired tokens that get past a cookie check.
 */

const AUTH_COOKIE = "payload-token";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // The login page must stay reachable, or this redirects to itself forever.
  if (pathname.startsWith("/olympus/login")) return NextResponse.next();

  if (!req.cookies.has(AUTH_COOKIE)) {
    const url = req.nextUrl.clone();
    url.pathname = "/olympus/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/olympus/:path*"],
};

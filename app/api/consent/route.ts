import { NextResponse } from "next/server";

import { clientIp, deviceClass, visitorHash } from "@/lib/attribution";
import {
  CONSENT_POLICY_VERSION,
  VISITOR_COOKIE,
  type ConsentAction,
} from "@/lib/consent";
import { countryFromHeaders } from "@/lib/geo";
import { getPayloadClient } from "@/lib/payload";

export const runtime = "nodejs";

const ACTIONS: ConsentAction[] = [
  "accept-all",
  "reject-all",
  "custom",
  "withdrawn",
];

/**
 * Records a consent decision and clears the persistent visitor cookie when
 * analytics is declined or withdrawn.
 *
 * The cookie the banner writes for its own state is set client-side, because
 * the banner must be able to read it before hydration. This endpoint exists
 * for the parts that must be server-side: the audit trail, and deleting the
 * httpOnly `doxa_vid` cookie that JavaScript cannot touch.
 *
 * Withdrawal genuinely has to delete the identifier. A consent banner whose
 * "reject" leaves the tracking cookie in place is worse than having no banner,
 * because it documents an intention it then ignores.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as {
      analytics?: unknown;
      marketing?: unknown;
      action?: unknown;
    } | null;

    const analytics = body?.analytics === true;
    const marketing = body?.marketing === true;
    const action = ACTIONS.includes(body?.action as ConsentAction)
      ? (body!.action as ConsentAction)
      : "custom";

    const res = new NextResponse(null, { status: 204 });

    if (!analytics) {
      res.cookies.set(VISITOR_COOKIE, "", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 0,
      });
    }

    const userAgent = req.headers.get("user-agent") ?? "";
    if (deviceClass(userAgent) === "bot") return res;

    const payload = await getPayloadClient();
    await payload.create({
      collection: "consent-events",
      data: {
        visitorHash: visitorHash(clientIp(req.headers), userAgent),
        visitorId:
          req.headers
            .get("cookie")
            ?.split(";")
            .map((c) => c.trim())
            .find((c) => c.startsWith(`${VISITOR_COOKIE}=`))
            ?.slice(VISITOR_COOKIE.length + 1) || null,
        analytics,
        marketing,
        action,
        policyVersion: String(CONSENT_POLICY_VERSION),
        country: countryFromHeaders(req.headers),
      },
      overrideAccess: true,
    });

    return res;
  } catch (err) {
    console.error("consent: failed to record decision", err);
    // Still succeed: the visitor's choice is already stored in their own
    // cookie, and failing here would make the banner look broken.
    return new NextResponse(null, { status: 204 });
  }
}

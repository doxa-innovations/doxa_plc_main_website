import { headers, cookies } from "next/headers";

/**
 * Visitor country detection for location-based content (Ethiopia vs. the rest
 * of the world). Server-only — calling this in a component opts that route into
 * dynamic rendering, which is intended: pricing and registration details differ
 * per visitor.
 *
 * Resolution order:
 *  1. `FORCE_COUNTRY` env var — forces a country for local testing/preview.
 *  2. `country` cookie — per-browser override (set `country=ET` in devtools to
 *     preview the Ethiopian view; clear it for the international view).
 *  3. Edge/CDN geo headers — Cloudflare (`cf-ipcountry`), Vercel, etc. The site
 *     sits behind Cloudflare in production, so `cf-ipcountry` is the live source.
 *
 * When nothing is available the country is unknown → treated as NON-Ethiopian,
 * i.e. the full international view (prices + verifiable registration). That is
 * the safe default: we never accidentally hide trust info from the world.
 */
const GEO_HEADERS = [
  "cf-ipcountry", // Cloudflare
  "x-vercel-ip-country", // Vercel
  "x-country-code",
  "x-geo-country",
  "x-appengine-country", // Google App Engine
] as const;

export async function getCountryCode(): Promise<string | null> {
  const forced = process.env.FORCE_COUNTRY?.trim().toUpperCase();
  if (forced) return forced;

  const cookieStore = await cookies();
  const fromCookie = cookieStore.get("country")?.value?.trim().toUpperCase();
  if (fromCookie) return fromCookie;

  const h = await headers();
  for (const key of GEO_HEADERS) {
    const value = h.get(key)?.trim().toUpperCase();
    if (value && value !== "XX" && value !== "T1") return value;
  }
  return null;
}

/** True only when we positively know the visitor is in Ethiopia. */
export async function isEthiopianVisitor(): Promise<boolean> {
  return (await getCountryCode()) === "ET";
}

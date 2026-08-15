/**
 * Marketing-channel classification.
 *
 * Pure and dependency-free on purpose: this is the one piece of the analytics
 * pipeline whose output is a business number people will make spend decisions
 * from, so it must be readable and testable without a database or a request.
 *
 * Precedence is deliberate and runs paid -> owned -> earned -> unknown. A click
 * identifier always wins over UTM tags, because ad platforms append the click
 * ID themselves and it cannot be faked by a mistyped campaign template. UTM
 * tags win over the referrer, because the referrer is whatever the browser
 * felt like sending.
 */

export const CHANNELS = [
  "Paid Search",
  "Paid Social",
  "Organic Search",
  "Organic Social",
  "Email",
  "Referral",
  "Direct",
] as const;

export type Channel = (typeof CHANNELS)[number];

/** Click identifiers appended by ad platforms. Presence means the click was paid. */
export const CLICK_ID_PARAMS = [
  "gclid", // Google Ads
  "gbraid", // Google Ads, iOS app-to-web
  "wbraid", // Google Ads, iOS web-to-app
  "msclkid", // Microsoft Ads
  "fbclid", // Meta
  "ttclid", // TikTok
  "li_fat_id", // LinkedIn
  "twclid", // X/Twitter
] as const;

const PAID_SEARCH_CLICK_IDS = new Set([
  "gclid",
  "gbraid",
  "wbraid",
  "msclkid",
]);

const PAID_MEDIUMS = new Set([
  "cpc",
  "ppc",
  "paid",
  "paidsearch",
  "paid-search",
  "paid_search",
  "cpm",
  "cpv",
  "display",
  "banner",
  "retargeting",
]);

const PAID_SOCIAL_MEDIUMS = new Set([
  "paid-social",
  "paidsocial",
  "paid_social",
  "social-paid",
  "social_paid",
]);

const EMAIL_MEDIUMS = new Set(["email", "e-mail", "newsletter", "mail"]);

const ORGANIC_SOCIAL_MEDIUMS = new Set([
  "social",
  "social-organic",
  "organic-social",
]);

/**
 * Hosts are matched on registrable-domain-ish suffixes so regional variants
 * (google.co.uk, google.de) and subdomains (m.facebook.com) resolve correctly.
 */
const SEARCH_HOSTS = [
  "google.",
  "bing.com",
  "duckduckgo.com",
  "yahoo.",
  "yandex.",
  "baidu.com",
  "ecosia.org",
  "brave.com",
  "search.marginalia.nu",
  "startpage.com",
  "qwant.com",
];

const SOCIAL_HOSTS = [
  "facebook.com",
  "instagram.com",
  "linkedin.com",
  "lnkd.in",
  "t.co",
  "twitter.com",
  "x.com",
  "tiktok.com",
  "youtube.com",
  "reddit.com",
  "pinterest.",
  "telegram.",
  "t.me",
  "whatsapp.com",
  "threads.net",
];

/** AI assistants and answer engines. Grouped under Referral, but named so the
 *  dashboard can show them separately once the volume justifies it. */
const AI_HOSTS = [
  "chatgpt.com",
  "chat.openai.com",
  "perplexity.ai",
  "claude.ai",
  "gemini.google.com",
  "copilot.microsoft.com",
];

function hostMatches(host: string, needles: string[]): boolean {
  return needles.some((n) => host === n || host.includes(n));
}

export function hostFromUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

export interface ChannelInput {
  utmSource?: string | null;
  utmMedium?: string | null;
  referrer?: string | null;
  /** Present click identifiers, e.g. ["gclid"]. */
  clickIds?: string[];
  /** The site's own host, so self-referrals are not counted as Referral. */
  selfHost?: string | null;
}

export function classifyChannel(input: ChannelInput): Channel {
  const medium = input.utmMedium?.trim().toLowerCase() ?? "";
  const source = input.utmSource?.trim().toLowerCase() ?? "";
  const clickIds = input.clickIds ?? [];
  const referrerHost = hostFromUrl(input.referrer);
  const selfHost = input.selfHost?.toLowerCase().replace(/^www\./, "") ?? null;

  // 1. Click identifiers. The platform put these there; trust them first.
  if (clickIds.some((id) => PAID_SEARCH_CLICK_IDS.has(id))) return "Paid Search";
  if (clickIds.length > 0) return "Paid Social";

  // 2. Explicit paid UTM tagging.
  if (PAID_SOCIAL_MEDIUMS.has(medium)) return "Paid Social";
  if (PAID_MEDIUMS.has(medium)) {
    return hostMatches(source, SOCIAL_HOSTS) ? "Paid Social" : "Paid Search";
  }

  // 3. Owned channels.
  if (EMAIL_MEDIUMS.has(medium)) return "Email";
  if (ORGANIC_SOCIAL_MEDIUMS.has(medium)) return "Organic Social";
  if (medium === "organic") return "Organic Search";

  // 4. Any other UTM tagging is a campaign we ran somewhere. Fall back to the
  //    referrer to name it, but never call it Direct: it was tagged for a reason.
  // 5. Earned, inferred from the referrer.
  if (referrerHost && (!selfHost || referrerHost !== selfHost)) {
    if (hostMatches(referrerHost, SEARCH_HOSTS)) return "Organic Search";
    if (hostMatches(referrerHost, SOCIAL_HOSTS)) return "Organic Social";
    return "Referral";
  }

  // 6. Tagged but no usable referrer (e.g. a QR code or print campaign).
  if (source || medium) return "Referral";

  return "Direct";
}

/** True when the referrer is an AI assistant. Reported inside Referral for now. */
export function isAiReferrer(referrer: string | null | undefined): boolean {
  const host = hostFromUrl(referrer);
  return host ? hostMatches(host, AI_HOSTS) : false;
}

import "server-only";

import { createHash } from "node:crypto";

import { CLICK_ID_PARAMS, classifyChannel, hostFromUrl } from "@/lib/channel";
import type { Channel } from "@/lib/channel";

/**
 * Attribution capture.
 *
 * The default path stores NOTHING on the visitor's device. A visitor is
 * identified by a hash of their IP and user agent salted with a secret and the
 * current UTC date, which means the identifier changes every midnight and
 * cannot be reversed into an IP without the secret. Nobody is asked for
 * permission because nothing is read from or written to their device, so this
 * runs for every visitor including the ones who reject the banner.
 *
 * The cost of that design is honest and worth stating: the hash cannot follow
 * anyone across days. Multi-day attribution requires the `doxa_vid` cookie,
 * which is only set once a visitor grants analytics consent.
 */

/** Rotates at 00:00 UTC. Changing this changes every hash from then on. */
function dailySalt(now: Date): string {
  const day = now.toISOString().slice(0, 10); // YYYY-MM-DD
  return `${process.env.PAYLOAD_SECRET ?? "insecure-dev-salt"}:${day}`;
}

/**
 * Pseudonymous, non-reversible, and rotating daily.
 *
 * Truncated to 32 hex chars: still far beyond collision risk at this traffic
 * volume, and shorter rows keep the visits table cheap to scan.
 */
export function visitorHash(
  ip: string,
  userAgent: string,
  now: Date = new Date(),
): string {
  return createHash("sha256")
    .update(`${dailySalt(now)}:${ip}:${userAgent}`)
    .digest("hex")
    .slice(0, 32);
}

export function clientIp(headers: Headers): string {
  return (
    headers.get("cf-connecting-ip") ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}

export type DeviceClass = "desktop" | "mobile" | "tablet" | "bot";

/**
 * Self-declared automation.
 *
 * The first line of defence is not this list, it is the beacon itself: it runs
 * in JavaScript, and the great majority of crawlers never execute any, so they
 * cannot report a visit however hard they try. This catches the ones that DO
 * run a browser engine and are honest about what they are.
 *
 * Grouped by what they are so the list stays maintainable rather than becoming
 * an unreadable alternation nobody dares touch.
 */
const BOT_PATTERN = new RegExp(
  [
    // Generic self-identification. Covers most search and social crawlers.
    "bot\\b|bots\\b|crawler|crawling|spider|slurp|archiver|indexer",
    // Named crawlers that do not contain "bot".
    "facebookexternalhit|facebookcatalog|whatsapp|telegrambot|slackbot|discordbot",
    "embedly|quora link preview|showyoubot|outbrain|vkshare|w3c_validator",
    "skypeuripreview|nuzzel|bitlybot|redditbot|applebot|ia_archiver",
    // SEO and marketing crawlers.
    "semrush|ahrefs|mj12|dotbot|blexbot|petalbot|seznam|serpstat|dataprovider",
    "screaming frog|sitebulb|barkrowler|linkdex|megaindex",
    // Uptime, performance and security scanners.
    "pingdom|uptimerobot|statuscake|gtmetrix|lighthouse|pagespeed|chrome-lighthouse",
    "monitoring|monitor\\b|newrelic|datadog|nagios|zabbix|site24x7",
    "nmap|masscan|nuclei|zgrab|censys|shodan|expanse",
    // HTTP clients and scripting runtimes. Never a human browsing.
    "curl|wget|libwww|httpunit|python-requests|python-urllib|aiohttp|httpx",
    "axios|node-fetch|got\\b|superagent|okhttp|apache-httpclient|java/",
    "go-http-client|ruby|perl|php\\b|guzzle|restsharp|postman|insomnia",
    // Headless and automation stacks.
    "headless|phantomjs|electron|puppeteer|playwright|selenium|webdriver",
    "cypress|jsdom|scrapy|splash",
    // Generic scraping and preview fetchers.
    "scrape|fetcher|preview|snippet|thumbnail|feedfetcher|rss",
    // AI crawlers and answer engines.
    "gptbot|oai-searchbot|chatgpt-user|claudebot|claude-web|anthropic-ai",
    "perplexitybot|ccbot|google-extended|bytespider|amazonbot|meta-externalagent",
  ].join("|"),
  "i",
);

const TABLET_PATTERN = /ipad|tablet|playbook|silk|(android(?!.*mobile))/i;
const MOBILE_PATTERN =
  /mobile|iphone|ipod|android|blackberry|opera mini|iemobile|windows phone/i;

/**
 * A user agent that is missing, absurdly short, or has no browser token at all
 * is not a browser. Real ones are long and always mention Mozilla, Opera or a
 * known engine, because of decades of compatibility cargo cult.
 */
function looksLikeBrowser(userAgent: string): boolean {
  if (userAgent.length < 20) return false;
  return /mozilla|applewebkit|gecko|opera|trident|edge/i.test(userAgent);
}

export function deviceClass(userAgent: string): DeviceClass {
  if (!userAgent) return "bot";
  if (BOT_PATTERN.test(userAgent)) return "bot";
  if (!looksLikeBrowser(userAgent)) return "bot";
  if (TABLET_PATTERN.test(userAgent)) return "tablet";
  if (MOBILE_PATTERN.test(userAgent)) return "mobile";
  return "desktop";
}

/**
 * Bot verdict for a whole request, not just its user agent.
 *
 * `clientReportedAutomation` comes from the beacon reporting
 * `navigator.webdriver`, which is true in every browser under automation and
 * is the one honest signal a headless session still emits by default. It
 * catches the automation that spoofs its user agent, which is precisely the
 * set a server-side string match cannot see.
 *
 * This deliberately does NOT test for `Sec-Fetch-*` headers, even though their
 * absence looks like a strong tell. Safari did not send them until 16.4, so
 * treating a missing header as robotic would silently discard real visitors,
 * and on the contact route it would discard their enquiry with no error and no
 * trace. Every check here has to fail OPEN for that reason.
 *
 * Not a blocklist either. Bots are served the site exactly as before; they are
 * only left out of the traffic figures, because counting a crawler as a
 * visitor makes every number downstream, including the lead rate, a lie.
 */
export function isBotRequest(args: {
  userAgent: string;
  headers?: Headers;
  clientReportedAutomation?: boolean;
}): boolean {
  if (args.clientReportedAutomation) return true;
  return deviceClass(args.userAgent) === "bot";
}

export interface TouchParams {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
  gclid: string | null;
  fbclid: string | null;
  msclkid: string | null;
  ttclid: string | null;
  liFatId: string | null;
}

/** Trims and caps a query value. Anything longer is a mistake or an attack. */
function param(sp: URLSearchParams, key: string): string | null {
  const raw = sp.get(key);
  if (!raw) return null;
  const value = raw.trim().slice(0, 255);
  return value.length > 0 ? value : null;
}

export function parseTouchParams(sp: URLSearchParams): TouchParams {
  return {
    utmSource: param(sp, "utm_source"),
    utmMedium: param(sp, "utm_medium"),
    utmCampaign: param(sp, "utm_campaign"),
    utmTerm: param(sp, "utm_term"),
    utmContent: param(sp, "utm_content"),
    gclid: param(sp, "gclid") ?? param(sp, "gbraid") ?? param(sp, "wbraid"),
    fbclid: param(sp, "fbclid"),
    msclkid: param(sp, "msclkid"),
    ttclid: param(sp, "ttclid"),
    liFatId: param(sp, "li_fat_id"),
  };
}

/** Which click identifiers were present, for the channel classifier. */
export function presentClickIds(sp: URLSearchParams): string[] {
  return CLICK_ID_PARAMS.filter((k) => {
    const v = sp.get(k);
    return typeof v === "string" && v.trim().length > 0;
  });
}

export interface ResolvedTouch extends TouchParams {
  channel: Channel;
  referrer: string | null;
  referrerHost: string | null;
  landingPath: string | null;
}

/**
 * Turns a landing URL and referrer into the full attribution record written to
 * a visit, and reused verbatim as a lead's first/last touch snapshot.
 */
export function resolveTouch(args: {
  landingUrl: string;
  referrer: string | null;
  selfHost: string | null;
}): ResolvedTouch {
  let sp = new URLSearchParams();
  let landingPath: string | null = null;

  try {
    const url = new URL(args.landingUrl);
    sp = url.searchParams;
    landingPath = `${url.pathname}${url.search}`.slice(0, 512);
  } catch {
    // Malformed landing URL: keep the touch, lose the params.
  }

  const touch = parseTouchParams(sp);

  return {
    ...touch,
    referrer: args.referrer?.slice(0, 512) ?? null,
    referrerHost: hostFromUrl(args.referrer),
    landingPath,
    channel: classifyChannel({
      utmSource: touch.utmSource,
      utmMedium: touch.utmMedium,
      referrer: args.referrer,
      clickIds: presentClickIds(sp),
      selfHost: args.selfHost,
    }),
  };
}

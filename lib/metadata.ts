import type { Metadata } from "next";
import { SITE } from "@/content/site";

interface BuildMetadataArgs {
  title?: string;
  description?: string;
  /** Route path beginning with "/", e.g. "/about". Defaults to home. */
  path?: string;
  /** Absolute or root-relative OG image URL. */
  ogImage?: string;
  noIndex?: boolean;
}

/**
 * The generated share card at `app/opengraph-image.tsx`, described so it can be
 * attached by hand.
 *
 * By hand, because Next merges metadata across segments SHALLOWLY: a page that
 * exports its own `openGraph` object REPLACES the parent's rather than
 * extending it, and the file convention puts its image on the parent. Since
 * every page here calls buildMetadata(), and buildMetadata() sets `openGraph`,
 * every page was silently discarding the card — it rendered fine at
 * /opengraph-image and no page ever referenced it. Every link shared to
 * WhatsApp, Slack or LinkedIn was a bare text stub.
 *
 * That is why `images` below is unconditional. Do not make it conditional
 * again; nothing warns you when the tag disappears.
 *
 * `app/opengraph-image.tsx` reads its `alt` and `size` from here so the
 * declared dimensions and the rendered ones cannot drift.
 */
export const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Doxa Innovations, Affordable Software Outsourcing from Ethiopia",
};

/**
 * Produces a Next.js Metadata object with a canonical URL plus OpenGraph and
 * Twitter cards. Pages call this so every route gets unique, correct metadata.
 * `metadataBase` is set once in the root layout, so relative OG paths resolve.
 */
export function buildMetadata({
  title,
  description,
  path = "/",
  ogImage,
  noIndex,
}: BuildMetadataArgs = {}): Metadata {
  const canonical = path === "/" ? SITE.url : `${SITE.url}${path}`;
  const desc = description ?? SITE.description;
  // A caller-supplied image carries no dimensions: a project cover is whatever
  // shape it was uploaded at, and claiming 1200x630 for it would be a lie the
  // scrapers act on.
  const images = ogImage ? [{ url: ogImage }] : [OG_IMAGE];

  return {
    // Omit when not provided so the root layout's default title applies
    // (an explicit `title: undefined` would suppress that fallback).
    ...(title ? { title } : {}),
    description: desc,
    alternates: { canonical },
    openGraph: {
      title: title ?? SITE.name,
      description: desc,
      url: canonical,
      siteName: SITE.legalName,
      locale: "en_US",
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: title ?? SITE.name,
      description: desc,
      images,
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

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
  const images = ogImage ? [{ url: ogImage }] : undefined;

  return {
    title,
    description: desc,
    alternates: { canonical },
    openGraph: {
      title: title ?? SITE.name,
      description: desc,
      url: canonical,
      siteName: SITE.legalName,
      locale: "en_US",
      type: "website",
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: title ?? SITE.name,
      description: desc,
      ...(images ? { images } : {}),
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

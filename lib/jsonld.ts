import { SITE } from "@/content/site";
import type {
  AddOn,
  FaqItem,
  PricingTier,
  Project,
  Service,
  SiteConfig,
  TeamMember,
} from "@/content/types";

/**
 * Pure JSON-LD builders. Each returns a schema.org object derived from the
 * typed content in `content/`. Stable @id values let schemas cross-reference
 * the single Organization/WebSite node (a @graph) instead of duplicating it.
 *
 * The builders that carry contact details accept a `site` argument so callers
 * can pass the CMS-backed config. It defaults to the static one, which keeps
 * every existing call site working and means structured data still renders
 * correctly if the database is unreachable.
 *
 * These MUST keep reading the same objects the pages render. Copy and schema
 * drifting apart is the exact failure this arrangement exists to prevent.
 */

export const ORG_ID = `${SITE.url}/#organization`;
export const WEBSITE_ID = `${SITE.url}/#website`;

/**
 * `showTaxIds` mirrors the visible gating. The registration numbers are hidden
 * from Ethiopian visitors in the UI, but they were still emitted here on every
 * page — the schema is rendered by app/(site)/layout.tsx, so the TIN and VAT sat
 * in the source of the homepage, the pricing page, everywhere, regardless of
 * country. Structured data has to follow the same rule as the markup it
 * describes, or the gating is decorative.
 */
export function organizationSchema(
  site: SiteConfig = SITE,
  showTaxIds = true,
) {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: `${site.url}/logo.svg`,
    description: site.description,
    foundingDate: site.registration.foundingDate,
    ...(showTaxIds
      ? { taxID: site.registration.tin, vatID: site.registration.vat }
      : {}),
    areaServed: "Worldwide",
    knowsLanguage: ["en"],
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      addressCountry: site.address.countryCode,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: site.email,
      telephone: site.phone,
      areaServed: "Worldwide",
      availableLanguage: ["English"],
    },
    ...(site.social.length ? { sameAs: site.social.map((s) => s.href) } : {}),
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE.url,
    name: SITE.legalName,
    description: SITE.description,
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
  };
}

export function localBusinessSchema(site: SiteConfig = SITE) {
  return {
    "@type": "ProfessionalService",
    "@id": `${site.url}/#localbusiness`,
    name: site.legalName,
    url: site.url,
    image: `${site.url}/logo.svg`,
    email: site.email,
    telephone: site.phone,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      addressCountry: site.address.countryCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.address.geo.latitude,
      longitude: site.address.geo.longitude,
    },
    areaServed: "Worldwide",
    parentOrganization: { "@id": ORG_ID },
  };
}

export function serviceSchema(service: Service) {
  return {
    "@type": "Service",
    name: service.name,
    description: service.summary,
    serviceType: service.name,
    provider: { "@id": ORG_ID },
    areaServed: "Worldwide",
    url: `${SITE.url}/services#${service.slug}`,
    offers: {
      "@type": "Offer",
      price: service.startingFrom.amount,
      priceCurrency: service.startingFrom.currency,
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: service.startingFrom.amount,
        priceCurrency: service.startingFrom.currency,
      },
    },
  };
}

export function creativeWorkSchema(project: Project) {
  return {
    "@type": "CreativeWork",
    name: `${project.client} — ${project.title}`,
    description: project.summary,
    url: `${SITE.url}/works/${project.slug}`,
    author: { "@id": ORG_ID },
    creator: { "@id": ORG_ID },
    keywords: project.techStack.join(", "),
    ...(project.liveUrl ? { sameAs: project.liveUrl } : {}),
    ...(project.testimonial
      ? {
          review: {
            "@type": "Review",
            reviewBody: project.testimonial.quote,
            author: {
              "@type": "Person",
              name: project.testimonial.name,
              jobTitle: project.testimonial.role,
            },
            itemReviewed: { "@id": ORG_ID },
          },
        }
      : {}),
  };
}

export function faqPageSchema(faqs: FaqItem[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function personSchema(member: TeamMember) {
  return {
    "@type": "Person",
    name: member.name,
    jobTitle: member.role,
    worksFor: { "@id": ORG_ID },
    image: member.photo,
    knowsAbout: member.expertise,
    ...(member.social.length
      ? { sameAs: member.social.map((s) => s.href) }
      : {}),
  };
}

/**
 * The pricing tiers as an OfferCatalog.
 *
 * Only tiers with a real USD figure carry a price. A "quote" tier is still
 * listed — it is a genuine option — but as an Offer with no price rather than
 * one priced at zero, which is what emitting `price: null` would imply.
 *
 * The ETB figures are deliberately absent: an Offer carries ONE currency, the
 * page shows USD or ETB depending on the visitor's country, and publishing
 * both would put a price in the schema that no visitor was ever shown.
 */
export function pricingSchema(tiers: PricingTier[], addOns: AddOn[] = []) {
  const offer = (
    name: string,
    description: string,
    amountUsd: number | null,
  ) => ({
    "@type": "Offer",
    name,
    description,
    ...(amountUsd !== null
      ? {
          price: amountUsd,
          priceCurrency: "USD",
          priceSpecification: {
            "@type": "PriceSpecification",
            minPrice: amountUsd,
            priceCurrency: "USD",
            valueAddedTaxIncluded: false,
          },
        }
      : {}),
    availability: "https://schema.org/InStock",
    seller: { "@id": ORG_ID },
    url: `${SITE.url}/pricing`,
  });

  return {
    "@type": "OfferCatalog",
    "@id": `${SITE.url}/pricing#catalog`,
    name: "Software development packages",
    url: `${SITE.url}/pricing`,
    provider: { "@id": ORG_ID },
    itemListElement: [
      ...tiers.map((t) => offer(t.name, t.bestFor, t.amountUsd)),
      ...addOns.map((a) =>
        offer(
          a.name,
          a.interval === "month" ? `${a.detail} Billed monthly.` : a.detail,
          a.amountUsd,
        ),
      ),
    ],
  };
}

/**
 * A hosted video. `uploadDate` and `duration` are required by Google for a
 * video rich result, which is why they are arguments rather than optional —
 * a VideoObject missing them is invalid, not merely thinner.
 */
export function videoSchema(video: {
  name: string;
  description: string;
  youtubeId: string;
  thumbnailUrl: string;
  /** ISO 8601 date. */
  uploadDate: string;
  /** ISO 8601 duration, e.g. "PT1M3S". */
  duration: string;
}) {
  return {
    "@type": "VideoObject",
    name: video.name,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl,
    uploadDate: video.uploadDate,
    duration: video.duration,
    embedUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
    contentUrl: `https://www.youtube.com/watch?v=${video.youtubeId}`,
    publisher: { "@id": ORG_ID },
  };
}

/**
 * A named list of links to pages that describe the items properly elsewhere.
 *
 * Used on the home page for the services band and the work showcase. An
 * ItemList rather than a second set of full Service nodes on purpose: the
 * canonical descriptions live on /services and /works/<slug>, and repeating
 * them on the home page would leave two pages competing to describe the same
 * thing rather than one pointing at the other.
 */
export function itemListSchema(
  name: string,
  items: { name: string; url: string }[],
) {
  return {
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.path === "/" ? SITE.url : `${SITE.url}${item.path}`,
    })),
  };
}

/** Wraps one or more schema nodes into a single @graph document. */
export function graph(...nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}

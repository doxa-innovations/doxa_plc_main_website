import { SITE } from "@/content/site";
import type {
  FaqItem,
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

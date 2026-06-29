import { SITE } from "@/content/site";
import type { FaqItem, Project, Service, TeamMember } from "@/content/types";

/**
 * Pure JSON-LD builders. Each returns a schema.org object derived from the
 * typed content in `content/`. Stable @id values let schemas cross-reference
 * the single Organization/WebSite node (a @graph) instead of duplicating it.
 */

export const ORG_ID = `${SITE.url}/#organization`;
export const WEBSITE_ID = `${SITE.url}/#website`;

export function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    logo: `${SITE.url}/logo.svg`,
    description: SITE.description,
    foundingDate: SITE.registration.foundingDate,
    taxID: SITE.registration.tin,
    vatID: SITE.registration.vat,
    areaServed: "Worldwide",
    knowsLanguage: ["en"],
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      addressCountry: SITE.address.countryCode,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: SITE.email,
      telephone: SITE.phone,
      areaServed: "Worldwide",
      availableLanguage: ["English"],
    },
    ...(SITE.social.length ? { sameAs: SITE.social.map((s) => s.href) } : {}),
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

export function localBusinessSchema() {
  return {
    "@type": "ProfessionalService",
    "@id": `${SITE.url}/#localbusiness`,
    name: SITE.legalName,
    url: SITE.url,
    image: `${SITE.url}/logo.svg`,
    email: SITE.email,
    telephone: SITE.phone,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      addressCountry: SITE.address.countryCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.address.geo.latitude,
      longitude: SITE.address.geo.longitude,
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

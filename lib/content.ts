import "server-only";

import { unstable_cache } from "next/cache";

import { readStringList } from "@/collections/fields/stringList";
import { SITE } from "@/content/site";
import type {
  AddOn,
  Address,
  PricingTier,
  Project,
  SiteConfig,
  TeamMember,
} from "@/content/types";
import { getPayloadClient, IS_BUILD } from "@/lib/payload";
import type {
  AddOn as AddOnDoc,
  PricingTier as PricingTierDoc,
  Project as ProjectDoc,
  SiteSetting,
  TeamMember as TeamMemberDoc,
} from "@/payload-types";

/**
 * The bridge between the database and the site.
 *
 * Every function here returns the SAME interfaces declared in
 * content/types.ts. That is the whole point of this file: pages and, more
 * importantly, lib/jsonld.ts keep consuming identical objects, which preserves
 * the property the codebase already documents and depends on, that rendered
 * copy and structured data are built from one source and cannot drift apart.
 *
 * Reads are cached and tag-revalidated. Every page is dynamic anyway, because
 * the footer calls isEthiopianVisitor(), so caching here is what keeps the
 * database off the hot path rather than an optimisation for static pages.
 *
 * `unstable_cache` is deprecated in favour of `use cache`, but that requires
 * the cacheComponents flag and a wider migration; this is the documented path
 * for a project without it.
 */

export const TAGS = {
  team: "content:team",
  projects: "content:projects",
  pricing: "content:pricing",
  site: "content:site",
} as const;

/** One hour. Tag revalidation makes edits appear immediately regardless. */
const REVALIDATE = 3600;

// --- Mappers ----------------------------------------------------------------

function toTeamMember(doc: TeamMemberDoc): TeamMember {
  return {
    slug: doc.slug,
    name: doc.name,
    role: doc.role,
    founder: Boolean(doc.founder),
    expertise: readStringList(doc.expertise),
    bio: doc.bio,
    photo: doc.photo,
    social: (doc.social ?? []).map((s) => ({ label: s.label, href: s.href })),
  };
}

function toProject(doc: ProjectDoc): Project {
  return {
    slug: doc.slug,
    title: doc.title,
    client: doc.client,
    country: doc.country,
    countryCode: doc.countryCode,
    industry: doc.industry,
    summary: doc.summary,
    problem: doc.problem,
    approach: (doc.approach ?? []).map((a) => ({
      title: a.title,
      description: a.description,
    })),
    whatWeBuilt: doc.whatWeBuilt,
    // Only surface a testimonial when it actually has a quote. An empty group
    // would otherwise make jsonld emit a Review node with no content.
    testimonial: doc.testimonial?.quote
      ? {
          quote: doc.testimonial.quote,
          name: doc.testimonial.name ?? "",
          role: doc.testimonial.role ?? "",
        }
      : undefined,
    techStack: readStringList(doc.techStack),
    liveUrl: doc.liveUrl || null,
    logo: doc.logo,
    coverImage: doc.coverImage,
    featured: Boolean(doc.featured),
    status: doc.status,
    order: doc.order,
    recommendationUrl: doc.recommendationUrl || undefined,
  };
}

function toPricingTier(doc: PricingTierDoc): PricingTier {
  return {
    name: doc.name,
    bestFor: doc.bestFor,
    includes: readStringList(doc.includes),
    mode: doc.mode,
    amountUsd: doc.amountUsd ?? null,
    amountEtb: doc.amountEtb ?? null,
    timeline: doc.timeline,
    payment: doc.payment,
    highlighted: Boolean(doc.highlighted),
  };
}

function toAddOn(doc: AddOnDoc): AddOn {
  return {
    name: doc.name,
    detail: doc.detail,
    amountUsd: doc.amountUsd,
    interval: doc.interval,
  };
}

// --- Readers ----------------------------------------------------------------

async function fetchAll<T>(
  collection: "team-members" | "projects" | "pricing-tiers" | "add-ons",
  map: (doc: never) => T,
): Promise<T[]> {
  // The Docker build has no database. Returning empty rather than throwing
  // keeps `next build` working; every consuming route is dynamic, so nothing
  // empty is ever served to a visitor.
  if (IS_BUILD) return [];

  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection,
    where: { published: { equals: true } },
    sort: "order",
    limit: 0,
    pagination: false,
    depth: 0,
    overrideAccess: true,
  });
  return (docs as never[]).map(map);
}

export const getTeam = unstable_cache(
  () => fetchAll("team-members", toTeamMember as (d: never) => TeamMember),
  ["content:team"],
  { tags: [TAGS.team], revalidate: REVALIDATE },
);

export const getProjects = unstable_cache(
  () => fetchAll("projects", toProject as (d: never) => Project),
  ["content:projects"],
  { tags: [TAGS.projects], revalidate: REVALIDATE },
);

export const getPricingTiers = unstable_cache(
  () => fetchAll("pricing-tiers", toPricingTier as (d: never) => PricingTier),
  ["content:pricing-tiers"],
  { tags: [TAGS.pricing], revalidate: REVALIDATE },
);

export const getAddOns = unstable_cache(
  () => fetchAll("add-ons", toAddOn as (d: never) => AddOn),
  ["content:add-ons"],
  { tags: [TAGS.pricing], revalidate: REVALIDATE },
);

/** Convenience wrappers mirroring the helpers content/projects.ts exported. */
export async function getProjectBySlug(
  slug: string,
): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter((p) => p.featured);
}

// --- Site settings ----------------------------------------------------------

const getSiteSettingsDoc = unstable_cache(
  async (): Promise<SiteSetting | null> => {
    if (IS_BUILD) return null;
    const payload = await getPayloadClient();
    return payload.findGlobal({
      slug: "site-settings",
      depth: 0,
      overrideAccess: true,
    });
  },
  ["content:site-settings"],
  { tags: [TAGS.site], revalidate: REVALIDATE },
);

/**
 * The `SITE` object with contact details and the office address overlaid from
 * the database.
 *
 * Everything not editable falls through to content/site.ts unchanged: the
 * canonical URL, the registration numbers, the map embed, and the navigation
 * trees. See globals/SiteSettings.ts for why each of those stayed in code.
 *
 * Falling back to the static values on a miss is deliberate. If the database
 * is unreachable the site still renders with correct, if possibly stale,
 * contact details rather than showing blanks where a phone number should be.
 */
export async function getSite(): Promise<SiteConfig> {
  const doc = await getSiteSettingsDoc();
  if (!doc) return SITE;

  const address: Address = {
    street: doc.street ?? SITE.address.street,
    city: doc.city ?? SITE.address.city,
    region: doc.region ?? SITE.address.region,
    country: doc.country ?? SITE.address.country,
    countryCode: doc.countryCode ?? SITE.address.countryCode,
    geo: {
      latitude: doc.latitude ?? SITE.address.geo.latitude,
      longitude: doc.longitude ?? SITE.address.geo.longitude,
    },
  };

  return {
    ...SITE,
    email: doc.email ?? SITE.email,
    phone: doc.phone ?? SITE.phone,
    phone2: doc.phone2 ?? SITE.phone2,
    whatsapp: doc.whatsapp ?? SITE.whatsapp,
    telegram: doc.telegram ?? SITE.telegram,
    address,
    mapUrl: doc.mapUrl ?? SITE.mapUrl,
  };
}

// --- Address formatting -----------------------------------------------------
//
// These two strings were assembled inline in JSX at five different call sites,
// which is why the footer and the contact page could drift apart. One helper
// each, used everywhere.

/** "Bishoftu, Oromia, Ethiopia" — the footer form. */
export function shortLocation(address: Address): string {
  return [address.city, address.region, address.country].join(", ");
}

/** Adds the street line. Used on the contact, about and legal pages. */
export function longLocation(address: Address): string {
  return [address.street, address.city, address.region, address.country].join(
    ", ",
  );
}

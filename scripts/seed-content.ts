/**
 * Imports the existing static content into Payload.
 *
 *   npm run seed:content
 *
 * The goal is that the live site is IDENTICAL after switching the pages over
 * to database reads. Everything is copied verbatim from the /content modules,
 * with two deliberate transformations:
 *
 *  - Pricing strings become structured amounts, so "From $1,700" is stored as
 *    1700 and formatted at render.
 *  - Team members and pricing tiers gain an explicit `order`, taken from their
 *    position in the original arrays, because array position is not something
 *    an editor can express.
 *
 * Idempotent by slug (or by name where there is no slug), so re-running
 * updates rather than duplicating. Safe against production.
 *
 * Uses TOP-LEVEL await: Payload's `run` command does `await import(script)`
 * then immediately `process.exit(0)`, so a floating promise is killed before
 * it resolves and the script silently does nothing.
 */
import { getPayload } from "payload";
import config from "@payload-config";

import { SITE } from "../content/site";
import { TEAM } from "../content/team";
import { PROJECTS } from "../content/projects";
import { PRICING_TIERS, ADD_ONS } from "../content/pricing";

const payload = await getPayload({ config });

const list = (values: string[]) => values.map((value) => ({ value }));

type SeedCollection =
  | "team-members"
  | "projects"
  | "pricing-tiers"
  | "add-ons";

/**
 * Creates or updates a single doc, matched on one unique field.
 *
 * The casts exist because `collection` is a union here, so Payload cannot
 * narrow `data` to one collection's shape. Each call site passes a literal
 * slug and a matching object, so the runtime shape is correct; only the
 * generic inference is defeated by writing this once instead of four times.
 */
async function upsert(
  collection: SeedCollection,
  matchField: string,
  matchValue: string,
  data: Record<string, unknown>,
): Promise<"created" | "updated"> {
  const existing = await payload.find({
    collection,
    where: { [matchField]: { equals: matchValue } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });

  if (existing.docs[0]) {
    await payload.update({
      collection,
      id: existing.docs[0].id,
      data,
      overrideAccess: true,
    } as never);
    return "updated";
  }

  await payload.create({ collection, data, overrideAccess: true } as never);
  return "created";
}

// --- Team -------------------------------------------------------------------
let created = 0;
let updated = 0;

for (const [i, member] of TEAM.entries()) {
  const result = await upsert("team-members", "slug", member.slug, {
    name: member.name,
    slug: member.slug,
    role: member.role,
    founder: member.founder,
    expertise: list(member.expertise),
    bio: member.bio,
    photo: member.photo,
    social: member.social.map((s) => ({ label: s.label, href: s.href })),
    order: (i + 1) * 10,
    published: true,
  });
  if (result === "created") created++;
  else updated++;
}
console.log(`Team: ${TEAM.length} members (${created} new, ${updated} updated)`);

// --- Projects ---------------------------------------------------------------
created = 0;
updated = 0;

for (const project of PROJECTS) {
  const result = await upsert("projects", "slug", project.slug, {
    title: project.title,
    slug: project.slug,
    client: project.client,
    country: project.country,
    countryCode: project.countryCode,
    industry: project.industry,
    summary: project.summary,
    problem: project.problem,
    approach: project.approach.map((a) => ({
      title: a.title,
      description: a.description,
    })),
    whatWeBuilt: project.whatWeBuilt,
    // Only set when present. Writing an empty group would make jsonld emit an
    // empty Review node.
    testimonial: project.testimonial
      ? {
          quote: project.testimonial.quote,
          name: project.testimonial.name,
          role: project.testimonial.role,
        }
      : undefined,
    techStack: list(project.techStack),
    liveUrl: project.liveUrl ?? undefined,
    logo: project.logo,
    coverImage: project.coverImage,
    recommendationUrl: project.recommendationUrl ?? undefined,
    featured: project.featured,
    status: project.status,
    order: project.order,
    published: true,
  });
  if (result === "created") created++;
  else updated++;
}
console.log(
  `Projects: ${PROJECTS.length} projects (${created} new, ${updated} updated)`,
);

// --- Pricing ----------------------------------------------------------------
created = 0;
updated = 0;

for (const [i, tier] of PRICING_TIERS.entries()) {
  const result = await upsert("pricing-tiers", "name", tier.name, {
    name: tier.name,
    bestFor: tier.bestFor,
    includes: list(tier.includes),
    mode: tier.mode,
    amountUsd: tier.amountUsd ?? undefined,
    amountEtb: tier.amountEtb ?? undefined,
    timeline: tier.timeline,
    payment: tier.payment,
    highlighted: tier.highlighted,
    order: (i + 1) * 10,
    published: true,
  });
  if (result === "created") created++;
  else updated++;
}
console.log(
  `Pricing: ${PRICING_TIERS.length} tiers (${created} new, ${updated} updated)`,
);

created = 0;
updated = 0;

for (const [i, addOn] of ADD_ONS.entries()) {
  const result = await upsert("add-ons", "name", addOn.name, {
    name: addOn.name,
    detail: addOn.detail,
    amountUsd: addOn.amountUsd,
    interval: addOn.interval,
    order: (i + 1) * 10,
    published: true,
  });
  if (result === "created") created++;
  else updated++;
}
console.log(`Add-ons: ${ADD_ONS.length} (${created} new, ${updated} updated)`);

// --- Site settings ----------------------------------------------------------
await payload.updateGlobal({
  slug: "site-settings",
  data: {
    email: SITE.email,
    phone: SITE.phone,
    phone2: SITE.phone2,
    whatsapp: SITE.whatsapp,
    telegram: SITE.telegram,
    street: SITE.address.street,
    city: SITE.address.city,
    region: SITE.address.region,
    country: SITE.address.country,
    countryCode: SITE.address.countryCode,
    latitude: SITE.address.geo.latitude,
    longitude: SITE.address.geo.longitude,
    mapUrl: SITE.mapUrl,
  },
  overrideAccess: true,
});
console.log("Site settings: written");

console.log("\nDone. The database now mirrors the static content.");

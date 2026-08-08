import type { Payload } from "payload";

import { SITE } from "../content/site";
import { TEAM } from "../content/team";
import { PROJECTS } from "../content/projects";
import { PRICING_TIERS, ADD_ONS } from "../content/pricing";

/**
 * The content in /content expressed as database records, plus the two ways of
 * writing them: create-what-is-missing (boot) and overwrite (the CLI script).
 *
 * Imports here are RELATIVE on purpose. This module is loaded both by Next,
 * which resolves the `@/*` alias, and by `payload run` under tsx for
 * scripts/seed-content.ts. Relative paths work identically in both.
 *
 * There is no `import "server-only"` for the same reason: the CLI script is a
 * plain Node process, not a React render.
 */

const list = (values: string[]) => values.map((value) => ({ value }));

export type SeedCollection =
  | "team-members"
  | "projects"
  | "pricing-tiers"
  | "add-ons";

export interface SeedRecord {
  collection: SeedCollection;
  /** The field that identifies this record as "already there". */
  matchField: "slug" | "name";
  matchValue: string;
  data: Record<string, unknown>;
}

/**
 * Every seedable document, in one flat list.
 *
 * Flat rather than grouped so both callers can walk it with one loop and
 * neither has to know which collections exist.
 */
export function seedRecords(): SeedRecord[] {
  const records: SeedRecord[] = [];

  for (const [i, member] of TEAM.entries()) {
    records.push({
      collection: "team-members",
      matchField: "slug",
      matchValue: member.slug,
      data: {
        name: member.name,
        slug: member.slug,
        role: member.role,
        founder: member.founder,
        expertise: list(member.expertise),
        bio: member.bio,
        photo: member.photo,
        social: member.social.map((s) => ({ label: s.label, href: s.href })),
        // Array position is not something an editor can express, so it becomes
        // an explicit field. Tens leave room to insert without renumbering.
        order: (i + 1) * 10,
        published: true,
      },
    });
  }

  for (const project of PROJECTS) {
    records.push({
      collection: "projects",
      matchField: "slug",
      matchValue: project.slug,
      data: {
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
        // Only set when present. Writing an empty group would make jsonld emit
        // an empty Review node.
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
      },
    });
  }

  for (const [i, tier] of PRICING_TIERS.entries()) {
    records.push({
      collection: "pricing-tiers",
      matchField: "name",
      matchValue: tier.name,
      data: {
        name: tier.name,
        bestFor: tier.bestFor,
        includes: list(tier.includes),
        mode: tier.mode,
        // Pricing strings become structured amounts, so "From $1,700" is
        // stored as 1700 and formatted at render.
        amountUsd: tier.amountUsd ?? undefined,
        amountEtb: tier.amountEtb ?? undefined,
        timeline: tier.timeline,
        payment: tier.payment,
        highlighted: tier.highlighted,
        order: (i + 1) * 10,
        published: true,
      },
    });
  }

  for (const [i, addOn] of ADD_ONS.entries()) {
    records.push({
      collection: "add-ons",
      matchField: "name",
      matchValue: addOn.name,
      data: {
        name: addOn.name,
        detail: addOn.detail,
        amountUsd: addOn.amountUsd,
        interval: addOn.interval,
        order: (i + 1) * 10,
        published: true,
      },
    });
  }

  return records;
}

export function siteSettingsData(): Record<string, unknown> {
  return {
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
  };
}

async function exists(payload: Payload, record: SeedRecord): Promise<boolean> {
  const found = await payload.find({
    collection: record.collection,
    where: { [record.matchField]: { equals: record.matchValue } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  return found.docs.length > 0;
}

export interface SeedSummary {
  created: number;
  skipped: number;
  failed: number;
  siteSettings: "written" | "already-set";
}

/**
 * Creates only what is not already there, and never touches what is.
 *
 * This is the boot path, so "already there" has to mean "leave it alone
 * entirely", not "update it". An upsert here would silently revert every edit
 * made in /olympus on the next container restart, which is the worst possible
 * failure mode for a CMS: the editor's work disappears with no error and no
 * obvious cause.
 *
 * The flip side, and it is a real one: a document DELETED in /olympus is
 * recreated on the next boot, because "missing" is indistinguishable from
 * "never seeded". To retire a project or a team member for good, unpublish it
 * rather than deleting it, or drop it from /content.
 */
export async function seedMissingContent(payload: Payload): Promise<SeedSummary> {
  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const record of seedRecords()) {
    if (await exists(payload, record)) {
      skipped++;
      continue;
    }

    try {
      await payload.create({
        collection: record.collection,
        data: record.data,
        overrideAccess: true,
      } as never);
      created++;
    } catch (error) {
      // One bad record must not stop the rest, and must never stop the server.
      failed++;
      payload.logger.error(
        { err: error },
        `Seed: could not create ${record.collection}/${record.matchValue}`,
      );
    }
  }

  // The global always "exists" as a row of nulls, so presence is not the test.
  // `email` is required and has no default, so an unset global cannot have one.
  const settings = await payload.findGlobal({
    slug: "site-settings",
    depth: 0,
    overrideAccess: true,
  });

  let siteSettings: SeedSummary["siteSettings"] = "already-set";
  if (!settings?.email) {
    await payload.updateGlobal({
      slug: "site-settings",
      data: siteSettingsData(),
      overrideAccess: true,
    });
    siteSettings = "written";
  }

  return { created, skipped, failed, siteSettings };
}

export type AdminSeedResult =
  | "created"
  | "exists"
  | "not-configured"
  | "password-too-short";

/**
 * Creates the /olympus login from ADMIN_EMAIL, ADMIN_PASSWORD and ADMIN_NAME.
 *
 * Payload's admin panel is not installed, so there is no "create first user"
 * screen to fall back on. Without this, a fresh deployment has a working site
 * and no way to sign in to it.
 *
 * Matched on email, so setting a different ADMIN_EMAIL later adds a second
 * account rather than replacing the first. Changing ADMIN_PASSWORD does NOT
 * rotate an existing account's password: that would mean the environment
 * silently overriding a password the owner had changed in the panel.
 */
export async function seedAdminUser(payload: Payload): Promise<AdminSeedResult> {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || "Admin";

  if (!email || !password) return "not-configured";
  if (password.length < 12) return "password-too-short";

  const found = await payload.find({
    collection: "users",
    where: { email: { equals: email } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  if (found.totalDocs > 0) return "exists";

  await payload.create({
    collection: "users",
    data: { email, password, name },
    overrideAccess: true,
  });
  return "created";
}

/**
 * The boot entry point: content, then the admin account.
 *
 * Nothing in here may throw. Migrations kill the process on failure on purpose,
 * because serving against a schema the code does not match is worse than not
 * serving. Seeding is the opposite: it is a convenience for an empty database,
 * and a site that renders with missing content is far better than a container
 * that refuses to start.
 */
export async function seedOnBoot(payload: Payload): Promise<void> {
  try {
    const summary = await seedMissingContent(payload);
    if (summary.created || summary.failed) {
      payload.logger.info(
        `Seed: ${summary.created} created, ${summary.skipped} already present` +
          (summary.failed ? `, ${summary.failed} failed` : "") +
          `, site settings ${summary.siteSettings}`,
      );
    }

    const admin = await seedAdminUser(payload);
    if (admin === "created") {
      payload.logger.info(
        `Seed: created admin ${process.env.ADMIN_EMAIL}. Sign in at /olympus/login.`,
      );
    } else if (admin === "password-too-short") {
      payload.logger.warn(
        "Seed: ADMIN_PASSWORD is shorter than 12 characters; no account created.",
      );
    }
  } catch (error) {
    payload.logger.error({ err: error }, "Seed: failed, continuing to serve");
  }
}

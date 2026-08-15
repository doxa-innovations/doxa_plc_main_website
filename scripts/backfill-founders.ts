/**
 * One-off backfill: sets the new `founder` flag on existing team members.
 *
 *   npm run payload -- run ./scripts/backfill-founders.ts
 *
 * Deliberately NOT `seed:content`. That upserts every field of every team
 * member, project and pricing tier from the /content modules, which would
 * discard anything edited in Olympus since the last seed. This touches one
 * field on the people named below and nothing else.
 *
 * Idempotent — safe to re-run. Delete once it has been applied everywhere.
 *
 * Uses TOP-LEVEL await: Payload's `run` does `await import(script)` then
 * `process.exit(0)`, so a floating promise is killed before it resolves.
 */
import { getPayload } from "payload";
import config from "@payload-config";

import { TEAM } from "../content/team";

const payload = await getPayload({ config });

const FOUNDER_SLUGS = TEAM.filter((m) => m.founder).map((m) => m.slug);

let updated = 0;
for (const slug of FOUNDER_SLUGS) {
  const found = await payload.find({
    collection: "team-members",
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: true,
  });

  const doc = found.docs[0];
  if (!doc) {
    console.warn(`  skip: no team member with slug "${slug}"`);
    continue;
  }
  if (doc.founder) {
    console.log(`  ok:   ${slug} already flagged`);
    continue;
  }

  await payload.update({
    collection: "team-members",
    id: doc.id,
    data: { founder: true },
    overrideAccess: true,
  });
  console.log(`  set:  ${slug} -> founder`);
  updated++;
}

console.log(`Founders backfill: ${updated} updated of ${FOUNDER_SLUGS.length}.`);

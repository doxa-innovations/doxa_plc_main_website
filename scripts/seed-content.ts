/**
 * Force-writes the /content modules into Payload, overwriting what is there.
 *
 *   npm run seed:content
 *
 * This is the OVERWRITE path, and the only reason it still exists now that
 * instrumentation.ts seeds on boot. Boot seeding creates only what is missing
 * and never touches an existing document, so it cannot push a copy change from
 * /content out to a site that has already been seeded. This can.
 *
 * That also makes it destructive in a way boot seeding is not: it discards
 * anything edited in /olympus for the documents it covers. Run it when
 * /content is the source of truth for a change, not as a routine refresh.
 *
 * Uses TOP-LEVEL await: Payload's `run` command does `await import(script)`
 * then immediately `process.exit(0)`, so a floating promise is killed before
 * it resolves and the script silently does nothing.
 */
import { getPayload } from "payload";
import config from "@payload-config";

import { seedRecords, siteSettingsData } from "../lib/seed";

const payload = await getPayload({ config });

const counts = new Map<string, { created: number; updated: number }>();

for (const record of seedRecords()) {
  const existing = await payload.find({
    collection: record.collection,
    where: { [record.matchField]: { equals: record.matchValue } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });

  // The casts exist because `collection` is a union here, so Payload cannot
  // narrow `data` to one collection's shape. seedRecords() pairs each literal
  // slug with a matching object, so the runtime shape is correct; only the
  // generic inference is defeated.
  if (existing.docs[0]) {
    await payload.update({
      collection: record.collection,
      id: existing.docs[0].id,
      data: record.data,
      overrideAccess: true,
    } as never);
  } else {
    await payload.create({
      collection: record.collection,
      data: record.data,
      overrideAccess: true,
    } as never);
  }

  const tally = counts.get(record.collection) ?? { created: 0, updated: 0 };
  if (existing.docs[0]) tally.updated++;
  else tally.created++;
  counts.set(record.collection, tally);
}

for (const [collection, { created, updated }] of counts) {
  console.log(`${collection}: ${created} created, ${updated} updated`);
}

await payload.updateGlobal({
  slug: "site-settings",
  data: siteSettingsData(),
  overrideAccess: true,
});
console.log("site-settings: written");

console.log("\nDone. The database now mirrors the static content.");

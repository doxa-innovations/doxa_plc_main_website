/**
 * Deletes visit records past the retention window stated in the privacy policy.
 *
 *   npm run prune:visits            # delete
 *   DRY_RUN=1 npm run prune:visits  # report only
 *
 * Run this on a schedule (a monthly cron on the deploy host is plenty).
 *
 * Why it exists: GDPR requires data minimisation and storage limitation, so
 * publishing a retention period and then keeping rows forever is worse than
 * having no policy, because the policy becomes a documented false statement.
 *
 * Leads are NOT pruned. They are a business record of a person who contacted
 * the company, kept under legitimate interest, and each one carries its own
 * denormalised copy of the attribution, so deleting old visits never costs a
 * lead its origin. Consent events are not pruned either: they are the evidence
 * that consent was given, which has to outlive the data it authorised.
 */
import { getPayload } from "payload";
import config from "@payload-config";

/** Matches the figure published in /privacy. Change both together. */
const RETENTION_DAYS = 425; // 14 months

const dryRun = process.env.DRY_RUN === "1";

const cutoff = new Date();
cutoff.setUTCDate(cutoff.getUTCDate() - RETENTION_DAYS);

const payload = await getPayload({ config });

const stale = await payload.count({
  collection: "visits",
  where: { createdAt: { less_than: cutoff.toISOString() } },
  overrideAccess: true,
});

console.log(
  `Retention: ${RETENTION_DAYS} days (before ${cutoff.toISOString().slice(0, 10)})`,
);
console.log(`Visits past retention: ${stale.totalDocs}`);

if (stale.totalDocs === 0) {
  console.log("Nothing to prune.");
} else if (dryRun) {
  console.log("DRY_RUN set, nothing deleted.");
} else {
  const result = await payload.delete({
    collection: "visits",
    where: { createdAt: { less_than: cutoff.toISOString() } },
    overrideAccess: true,
  });
  console.log(`Deleted ${result.docs.length} visits.`);
  if (result.errors.length > 0) {
    console.error(`${result.errors.length} rows could not be deleted.`);
  }
}

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects" ADD COLUMN "own_product" boolean DEFAULT false;`)

  // Backfill the two in-house products already in the database. Boot-time
  // seeding only creates missing documents and never edits existing ones, so
  // without this they would land under client projects on /works until
  // someone flipped the switch by hand.
  await db.execute(sql`
   UPDATE "projects" SET "own_product" = true
   WHERE "slug" IN ('doxa-ledger', 'doxa-socials');`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects" DROP COLUMN "own_product";`)
}

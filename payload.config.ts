import path from "node:path";
import { fileURLToPath } from "node:url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { s3Storage } from "@payloadcms/storage-s3";
import { buildConfig } from "payload";

import { ConsentEvents } from "./collections/ConsentEvents";
import { Leads } from "./collections/Leads";
import { Media } from "./collections/Media";
import { AddOns, PricingTiers } from "./collections/PricingTiers";
import { Projects } from "./collections/Projects";
import { TeamMembers } from "./collections/TeamMembers";
import { Users } from "./collections/Users";
import { Visits } from "./collections/Visits";
import { SiteSettings } from "./globals/SiteSettings";
import { migrations } from "./migrations";

/**
 * Payload runs HEADLESS here. There is no `app/(payload)` directory, which is
 * what actually disables the admin panel, the REST API and the GraphQL API in
 * Payload 3 (the `admin.disable` flag is deprecated and removed in v4). All
 * reads and writes go through the Local API from server components and server
 * actions, and the editing surface is our own panel at /olympus.
 *
 * Consequences of that choice, deliberately taken:
 *  - No `payload generate:importmap` step (the import map only feeds the admin).
 *  - No `sharp` dependency, because no collection declares `imageSizes` or
 *    `formatOptions`. Resizing happens at the CDN edge instead.
 *  - No rich-text editor: `editor` is optional in the config type.
 */

const dirname = path.dirname(fileURLToPath(import.meta.url));

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://doxaplc.com"
).replace(/\/$/, "");

const isProduction = process.env.NODE_ENV === "production";

export default buildConfig({
  // Needed by the Local API for password-reset links and absolute URLs, which
  // cannot be inferred from a request when called outside a route handler.
  serverURL: SITE_URL,

  // `admin.user` is still required by config sanitization even with no panel.
  admin: { user: Users.slug },

  collections: [
    Users,
    Media,
    Leads,
    Visits,
    ConsentEvents,
    TeamMembers,
    Projects,
    PricingTiers,
    AddOns,
  ],

  globals: [SiteSettings],

  plugins: [
    /**
     * Cloudflare R2, through its S3-compatible API.
     *
     * `enabled` is gated on the bucket name so local development works with no
     * credentials at all; uploads simply are not available there.
     *
     * Two settings are load-bearing rather than preferences:
     *
     *  - `generateFileURL` is what makes `doc.url` a public
     *    https://cdn.doxaplc.com/... address. Without it Payload would return
     *    the private r2.cloudflarestorage.com endpoint, which the browser
     *    cannot read.
     *  - `disablePayloadAccessControl: true` is MANDATORY here. Left off,
     *    Payload routes file reads through its own static handler at
     *    /api/[...slug], which lives in the `app/(payload)` directory we
     *    deliberately never create, so every image would 404.
     */
    s3Storage({
      enabled: Boolean(process.env.R2_BUCKET),
      collections: {
        media: {
          disablePayloadAccessControl: true,
          generateFileURL: ({
            filename,
            prefix,
          }: {
            filename: string;
            prefix?: string;
          }) => {
            const base = (process.env.R2_PUBLIC_URL ?? "").replace(/\/$/, "");
            const key = prefix ? `${prefix}/${filename}` : filename;
            return `${base}/${key}`;
          },
        },
      },
      bucket: process.env.R2_BUCKET ?? "",
      config: {
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
        },
        // R2 rejects real AWS region names; "auto" is required.
        region: "auto",
        // Account endpoint, used for UPLOADS only. Public reads go via
        // R2_PUBLIC_URL above.
        endpoint: process.env.R2_ENDPOINT ?? "",
        forcePathStyle: true,
      },
    }),
  ],

  // No collections are exposed over GraphQL, so skip building the schema and
  // registering the route entirely.
  graphQL: { disable: true },

  /**
   * Origins allowed to present an auth cookie.
   *
   * This list must contain EVERY origin the panel is served from, or server
   * actions silently fail. A normal page load sends no `Origin` header, so
   * Payload falls back to `Sec-Fetch-Site` and the request passes; a server
   * action POSTs with `Origin` set, and an origin missing from this list gets
   * its cookie discarded, which surfaces as "not signed in" only on save.
   *
   * Development origins are added explicitly for the same reason. In
   * production, make sure NEXT_PUBLIC_SITE_URL matches the origin the browser
   * actually uses, including www or its absence.
   */
  csrf: [
    SITE_URL,
    ...(isProduction
      ? []
      : ["http://localhost:3000", "http://127.0.0.1:3000"]),
  ],

  secret: process.env.PAYLOAD_SECRET || "",

  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },

  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || "" },
    // Production must never try to CREATE DATABASE; the Dokploy instance is
    // provisioned ahead of time.
    disableCreateDatabase: isProduction,
    /**
     * Run migrations automatically in production.
     *
     * Payload pushes the schema directly in development and runs migrations in
     * production; both are gated on NODE_ENV internally, and the standalone
     * `server.js` hard-codes NODE_ENV=production, so the container always
     * migrates and never pushes.
     *
     * Passing the array here rather than letting Payload read the directory is
     * what makes this work at all in the Docker image: a STATIC import gets
     * bundled and traced into `.next/standalone`, whereas reading migration
     * files from disk would need them COPYed in, and the standalone output
     * ships neither the source tree nor the Payload CLI.
     */
    prodMigrations: migrations,
  }),
});

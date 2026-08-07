import "server-only";

import { getPayload, type Payload } from "payload";
import config from "@payload-config";

/**
 * True while `next build` is compiling. The Docker build has no database
 * reachable, so anything that would query Postgres during the build must check
 * this and bail out with an empty result.
 *
 * The trap this exists for: `export const dynamic = "force-dynamic"` does NOT
 * stop `generateStaticParams` from running. Next calls it unconditionally for
 * any route with dynamic segments (see next/dist/build/utils.js, the
 * `route.dynamicSegments.length > 0` branch), and only skips *prerendering*
 * the resulting paths. A `generateStaticParams` that reads Payload will still
 * open a connection at build time and fail the Docker build.
 */
export const IS_BUILD = process.env.NEXT_PHASE === "phase-production-build";

/**
 * Payload only connects to Postgres on the first `getPayload()` call, never on
 * import of the config, so importing this module is always safe.
 */
export function getPayloadClient(): Promise<Payload> {
  return getPayload({ config });
}

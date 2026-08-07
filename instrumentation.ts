/**
 * Runs once when a server instance starts, before it accepts requests.
 *
 * Its only job is to initialise Payload, which opens the database connection
 * and, in production, applies any pending migrations via `prodMigrations`.
 *
 * Without this, migrations would still run, but lazily: on the first request
 * that happens to touch Payload. That means an unlucky visitor waits for the
 * schema to change while their page renders, and a failed migration surfaces
 * as a broken page rather than a container that refuses to start.
 *
 * A failed migration kills the process on purpose. Payload's migration runner
 * calls process.exit(1) on error, so a bad schema change stops the deploy
 * instead of serving traffic against a database it does not match.
 */
export async function register() {
  // Only the Node.js runtime. Edge has no database driver, and running this
  // there would throw on every cold start.
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  // `next build` must never reach the database: the Docker build has none.
  if (process.env.NEXT_PHASE === "phase-production-build") return;

  const { getPayload } = await import("payload");
  const config = (await import("@payload-config")).default;

  await getPayload({ config });
}

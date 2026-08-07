/**
 * Creates the first /olympus account.
 *
 * Payload's admin panel is not installed, so there is no "create first user"
 * screen to fall back on. This script is the only bootstrap path, and it is
 * also how you add a teammate until the panel grows a user-management screen.
 *
 *   ADMIN_EMAIL=you@doxaplc.com ADMIN_PASSWORD='...' ADMIN_NAME='Your Name' \
 *     npm run seed:admin
 *
 * Idempotent: re-running with an existing email reports and exits without
 * touching the account, so it is safe to run against production.
 *
 * NOTE: this file must do its work with TOP-LEVEL await, not inside a
 * `main()` that is called but not awaited. Payload's `run` command does
 * `await import(script)` and then immediately `process.exit(0)`, so a floating
 * promise is killed before it resolves and the script silently does nothing.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME?.trim() || "Admin";

if (!email || !password) {
  console.error(
    "Missing credentials. Usage:\n" +
      "  ADMIN_EMAIL=you@doxaplc.com ADMIN_PASSWORD='...' ADMIN_NAME='Your Name' npm run seed:admin",
  );
  process.exit(1);
}

if (password.length < 12) {
  console.error("Password must be at least 12 characters.");
  process.exit(1);
}

const payload = await getPayload({ config });

const existing = await payload.find({
  collection: "users",
  where: { email: { equals: email } },
  limit: 1,
  overrideAccess: true,
});

if (existing.totalDocs > 0) {
  console.log(`User ${email} already exists. Nothing to do.`);
} else {
  await payload.create({
    collection: "users",
    data: { email, password, name },
    overrideAccess: true,
  });
  console.log(`Created admin ${email}. Sign in at /olympus/login.`);
}

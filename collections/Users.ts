import type { CollectionConfig } from "payload";

/**
 * The only account type. Everyone who can sign in to /olympus can read the
 * lead data and edit every content collection, which matches how the team
 * actually works today. Adding roles later is a field plus access functions,
 * not a data migration, so nothing here forecloses that.
 *
 * Authentication is Payload's own: it issues the httpOnly `payload-token`
 * cookie, tracks sessions, and handles lockout. We never expose Payload's
 * login route, so /olympus/login drives this through the Local API instead.
 */
export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    // Lock an account for 10 minutes after 5 consecutive failures. Payload
    // wires this into the local strategy automatically. There is no admin UI
    // to unlock from, so /olympus needs its own unlock action if this fires.
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    tokenExpiration: 2 * 60 * 60, // seconds
    cookies: {
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    },
  },
  // Nothing here is readable without a session. There is no public surface.
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
  ],
};

import type { CollectionConfig } from "payload";

import { touchFields } from "./fields/touch";

/**
 * One row per session, written by the /api/t beacon.
 *
 * No personal data is stored: `visitorHash` is a daily-rotating salted digest
 * of IP and user agent, and the raw IP is never persisted. That is what lets
 * this run for every visitor rather than only the ones who accept cookies.
 *
 * `visitorId` is populated ONLY after a visitor grants analytics consent, and
 * is the one field that can link sessions across days.
 *
 * Retention: prune on a schedule (see the privacy policy). Leads keep their own
 * denormalized copy of the attribution, so pruning here never loses a lead's
 * origin.
 */
export const Visits: CollectionConfig = {
  slug: "visits",
  // Written by the beacon with overrideAccess, read only by a signed-in admin.
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => false,
    update: () => false,
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "visitorHash",
      type: "text",
      required: true,
      index: true,
    },
    {
      name: "visitorId",
      type: "text",
      index: true,
      admin: { description: "Set only with analytics consent." },
    },
    ...touchFields(),
    { name: "country", type: "text", index: true },
    {
      name: "deviceClass",
      type: "select",
      options: ["desktop", "mobile", "tablet", "bot"].map((v) => ({
        label: v,
        value: v,
      })),
      index: true,
    },
    {
      name: "consented",
      type: "checkbox",
      defaultValue: false,
      admin: { description: "Analytics consent was granted at capture time." },
    },
  ],
};

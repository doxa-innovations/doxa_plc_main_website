import type { CollectionConfig } from "payload";

import { stringList } from "./fields/stringList";

/**
 * The six services, editable as WORDS AND NUMBERS ONLY.
 *
 * Unlike every other content collection, the lineup here is fixed. Editors
 * change copy, prices and timelines; they do not add, remove or reorder
 * services. That is not squeamishness, it is what the rest of the site assumes:
 *
 *  - `slug` is the key `components/marketing/ServiceArt.tsx` looks up to pick a
 *    hand-drawn illustration. There are exactly six, one per slug. A seventh
 *    service would silently inherit the website drawing.
 *  - `slug` is also the `/services#…` anchor every footer and card link points
 *    at, so changing one breaks live links.
 *  - `icon` is a lucide name resolved by `components/Icon.tsx`, which maps six
 *    of them. Anything else falls back to `Globe` with no warning.
 *
 * So `slug`, `icon` and `order` are seeded and then left alone, and `create`
 * and `delete` are refused outright. Note that the /olympus actions all pass
 * `overrideAccess: true`, so these flags are a statement of intent rather than
 * the enforcement — `saveService` refusing to run without an id is what
 * actually holds the line.
 */
export const Services: CollectionConfig = {
  slug: "services",
  defaultSort: "order",
  access: {
    read: () => true,
    create: () => false,
    update: ({ req }) => Boolean(req.user),
    delete: () => false,
  },
  fields: [
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description:
          "Fixed. It selects the illustration and is the /services#… anchor, so changing it breaks both.",
      },
    },
    { name: "name", type: "text", required: true },
    {
      name: "icon",
      type: "text",
      required: true,
      admin: {
        description:
          "lucide-react icon name. Only the names mapped in components/Icon.tsx render; anything else falls back to Globe.",
      },
    },
    { name: "summary", type: "textarea", required: true },
    { name: "description", type: "textarea", required: true },
    {
      name: "forWhom",
      type: "textarea",
      required: true,
      label: "Best for",
    },
    stringList("deliverables", { label: "What you get" }),
    stringList("techStack", { label: "Tech stack" }),
    {
      name: "timeline",
      type: "text",
      required: true,
      admin: { description: 'e.g. "3 to 6 weeks"' },
    },
    {
      name: "amountUsd",
      type: "number",
      required: true,
      min: 0,
      admin: {
        description:
          "Starting price. Number only, no symbol or commas. Also the price in the Service/Offer structured data.",
      },
    },
    {
      /**
       * Explicit, rather than treating an empty `amountEtb` as "custom".
       *
       * Null would conflate "priced in ETB, nobody has filled it in yet" with
       * "deliberately quoted on request", and the site would print "Pricing:
       * Custom" for both. Exactly the conflation `mode` exists to prevent on
       * the pricing tiers.
       */
      name: "etbMode",
      type: "select",
      required: true,
      defaultValue: "amount",
      label: "Ethiopian price",
      options: [
        { label: "Starting amount", value: "amount" },
        { label: "Custom, quoted per client", value: "custom" },
      ],
    },
    {
      name: "amountEtb",
      type: "number",
      min: 0,
      admin: {
        description: "Shown to visitors in Ethiopia. Ignored when custom.",
        condition: (data) => data?.etbMode !== "custom",
      },
    },
    {
      name: "billing",
      type: "select",
      required: true,
      defaultValue: "project",
      options: [
        { label: "Per project", value: "project" },
        { label: "Monthly retainer", value: "monthly" },
      ],
      admin: {
        description: 'A retainer prints the starting price as "/mo".',
      },
    },
    {
      name: "showInFooter",
      type: "checkbox",
      defaultValue: true,
      label: "Show in footer",
      admin: {
        description: "Lists this service in the footer's Services column.",
      },
    },
    {
      name: "order",
      type: "number",
      required: true,
      defaultValue: 100,
      admin: { description: "Fixed. Lower numbers appear first." },
    },
    {
      /**
       * Seeded true and never exposed in /olympus, because unpublishing a
       * service is a way of removing one. It exists so this collection can use
       * the same `fetchAll` reader as every other, and as a lever a developer
       * can still pull.
       */
      name: "published",
      type: "checkbox",
      defaultValue: true,
    },
  ],
};

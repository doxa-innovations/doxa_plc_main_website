import type { CollectionConfig } from "payload";

import { stringList } from "./fields/stringList";

/**
 * Pricing cards, stored as STRUCTURED values rather than the pre-formatted
 * strings the static file used ("From $1,700" / "On request").
 *
 * That change fixes a live fragility, not just a tidiness complaint. The
 * pricing page decided which call to action to show by string-comparing the
 * price against the literals "On request" and "On order", so an editor
 * retyping that text, or writing "On Request", would silently swap the button
 * to the wrong one. `mode` makes the intent explicit and unbreakable.
 *
 * Currency selection stays exactly as it is: lib/geo.ts decides, Ethiopian
 * visitors see ETB, everyone else sees USD.
 */
export const PricingTiers: CollectionConfig = {
  slug: "pricing-tiers",
  defaultSort: "order",
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "bestFor",
      type: "textarea",
      required: true,
      label: "Best for",
    },
    stringList("includes", { label: "What it includes" }),
    {
      name: "mode",
      type: "select",
      required: true,
      defaultValue: "from",
      options: [
        { label: "Starting price", value: "from" },
        { label: "Quote only", value: "quote" },
      ],
      admin: {
        description:
          'Quote only shows "On request" and switches the button to booking a scoping call.',
      },
    },
    {
      name: "amountUsd",
      type: "number",
      min: 0,
      admin: {
        description: "Number only, no symbol or commas. Ignored when quote only.",
        condition: (data) => data?.mode !== "quote",
      },
    },
    {
      name: "amountEtb",
      type: "number",
      min: 0,
      admin: {
        description: "Shown to Ethiopian visitors. Ignored when quote only.",
        condition: (data) => data?.mode !== "quote",
      },
    },
    { name: "timeline", type: "text", required: true },
    {
      name: "payment",
      type: "text",
      required: true,
      admin: { description: 'e.g. "30 / 40 / 30 milestones"' },
    },
    {
      name: "highlighted",
      type: "checkbox",
      defaultValue: false,
      admin: { description: 'Draws the "Most Popular" treatment. Use on one tier.' },
    },
    {
      name: "order",
      type: "number",
      required: true,
      defaultValue: 100,
      admin: { description: "Lower numbers appear first." },
    },
    { name: "published", type: "checkbox", defaultValue: true },
  ],
};

/**
 * Optional extras listed under the tiers. USD only, and hidden entirely from
 * Ethiopian visitors, which is the behaviour the static version had.
 */
export const AddOns: CollectionConfig = {
  slug: "add-ons",
  defaultSort: "order",
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "detail", type: "textarea", required: true },
    { name: "amountUsd", type: "number", required: true, min: 0 },
    {
      name: "interval",
      type: "select",
      required: true,
      defaultValue: "month",
      options: [
        { label: "Per month", value: "month" },
        { label: "One off", value: "once" },
      ],
    },
    { name: "order", type: "number", required: true, defaultValue: 100 },
    { name: "published", type: "checkbox", defaultValue: true },
  ],
};

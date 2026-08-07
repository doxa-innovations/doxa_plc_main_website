import type { CollectionConfig } from "payload";

import { PROJECT_TYPES, BUDGET_RANGES } from "@/lib/validation";

import { touchFields } from "./fields/touch";

/**
 * Every contact-form submission, stored before either email is attempted.
 *
 * Persisting first is the whole point. The previous implementation sent one
 * email and kept nothing, so an SMTP failure destroyed the inquiry with no
 * trace. Now the row is the source of truth and mail delivery is a best-effort
 * step recorded against it.
 *
 * `status` ships unused: the panel is read-only for now, but having the column
 * from day one means turning /olympus into a pipeline later is a UI change
 * rather than a schema migration on live data.
 */
export const Leads: CollectionConfig = {
  slug: "leads",
  access: {
    read: ({ req }) => Boolean(req.user),
    // Created by the contact route with overrideAccess, never by a browser.
    create: () => false,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    // --- What they submitted -------------------------------------------------
    { name: "name", type: "text", required: true },
    { name: "email", type: "email", required: true, index: true },
    { name: "company", type: "text" },
    { name: "country", type: "text" },
    {
      name: "projectType",
      type: "select",
      options: PROJECT_TYPES.map((t) => ({ label: t, value: t })),
      index: true,
    },
    {
      name: "budget",
      type: "select",
      options: BUDGET_RANGES.map((b) => ({ label: b, value: b })),
      index: true,
    },
    { name: "message", type: "textarea", required: true },

    // --- Pipeline ------------------------------------------------------------
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      index: true,
      options: [
        { label: "New", value: "new" },
        { label: "Contacted", value: "contacted" },
        { label: "Quoted", value: "quoted" },
        { label: "Won", value: "won" },
        { label: "Lost", value: "lost" },
      ],
    },
    { name: "notes", type: "textarea" },

    // --- Attribution ---------------------------------------------------------
    { name: "visitorHash", type: "text", index: true },
    { name: "visitorId", type: "text", index: true },
    {
      name: "firstTouch",
      type: "group",
      admin: { description: "How they first found the site." },
      fields: touchFields(),
    },
    {
      name: "lastTouch",
      type: "group",
      admin: { description: "The session that produced the inquiry." },
      fields: touchFields(),
    },
    {
      name: "geoCountry",
      type: "text",
      index: true,
      admin: { description: "From CDN headers, not the country they typed." },
    },

    // --- Delivery ------------------------------------------------------------
    // Surfaced in /olympus so a broken SMTP config is visible immediately
    // rather than discovered weeks later by an inbox that went quiet.
    {
      name: "notificationSent",
      type: "checkbox",
      defaultValue: false,
      admin: { description: "Internal 'new inquiry' email delivered." },
    },
    {
      name: "confirmationSent",
      type: "checkbox",
      defaultValue: false,
      admin: { description: "Customer confirmation email delivered." },
    },
    { name: "deliveryError", type: "text" },
  ],
};

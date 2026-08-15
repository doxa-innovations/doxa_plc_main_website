import type { CollectionConfig } from "payload";

import { stringList } from "./fields/stringList";

/**
 * Portfolio case studies, the collection that actually grows over time.
 *
 * The field set mirrors the `Project` interface in content/types.ts exactly.
 * That matters beyond tidiness: lib/jsonld.ts builds CreativeWork and Review
 * structured data from the same object the page renders, and the codebase
 * documents that as a deliberate guarantee against copy and schema drifting
 * apart. Reshaping here would quietly break it.
 */
export const Projects: CollectionConfig = {
  slug: "projects",
  defaultSort: "order",
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: { description: "URL segment: /works/<slug>. Changing it breaks existing links." },
    },
    { name: "client", type: "text", required: true },
    { name: "country", type: "text", required: true },
    {
      name: "countryCode",
      type: "text",
      required: true,
      maxLength: 2,
      admin: { description: "ISO 3166-1 alpha-2, drives the flag. e.g. NL" },
    },
    { name: "industry", type: "text", required: true },
    { name: "summary", type: "textarea", required: true },

    // The case-study spine: need -> approach -> solution -> proof.
    {
      name: "problem",
      type: "textarea",
      required: true,
      label: "The need",
    },
    {
      name: "approach",
      type: "array",
      label: "How we approached it",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea", required: true },
      ],
    },
    {
      name: "whatWeBuilt",
      type: "textarea",
      required: true,
      label: "The solution",
    },
    {
      name: "testimonial",
      type: "group",
      admin: {
        description:
          "Optional. Filling this in also emits a Review into the page's structured data.",
      },
      fields: [
        { name: "quote", type: "textarea" },
        { name: "name", type: "text" },
        { name: "role", type: "text" },
      ],
    },

    stringList("techStack"),
    {
      name: "liveUrl",
      type: "text",
      admin: { description: "Leave empty for in-house or unreleased work." },
    },
    { name: "logo", type: "text", required: true },
    { name: "coverImage", type: "text", required: true },
    {
      name: "recommendationUrl",
      type: "text",
      admin: { description: "Optional. Falls back to the shared recommendations folder." },
    },

    { name: "featured", type: "checkbox", defaultValue: false, index: true },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "live",
      options: [
        { label: "Live", value: "live" },
        { label: "In development", value: "in-development" },
      ],
    },
    {
      name: "order",
      type: "number",
      required: true,
      defaultValue: 100,
      admin: { description: "Lower numbers appear first." },
    },
    {
      name: "published",
      type: "checkbox",
      defaultValue: true,
      admin: { description: "Uncheck to hide without deleting." },
    },
  ],
};

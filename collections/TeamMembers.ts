import type { CollectionConfig } from "payload";

import { stringList } from "./fields/stringList";

/**
 * The team page and the About page grid.
 *
 * `order` is new. Ordering used to be implicit in the array literal's position
 * in content/team.ts, which is not something an editor can express, so it
 * becomes an explicit field.
 *
 * `photo` is a URL string for now, matching how every image on the site works
 * today. Real uploads land when R2 is wired.
 */
export const TeamMembers: CollectionConfig = {
  slug: "team-members",
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
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: { description: "Used as the React key and for future profile URLs." },
    },
    { name: "role", type: "text", required: true },
    stringList("expertise"),
    { name: "bio", type: "textarea", required: true },
    {
      name: "photo",
      type: "text",
      required: true,
      admin: { description: "Absolute image URL, e.g. https://cdn.doxaplc.com/..." },
    },
    {
      name: "social",
      type: "array",
      fields: [
        { name: "label", type: "text", required: true },
        { name: "href", type: "text", required: true },
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
      name: "founder",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description:
          "Shows this person in the Founders block rather than the team grid. An explicit flag, not a search for \"Founder\" in the role text, so retyping a job title cannot silently move someone between sections.",
      },
    },
    {
      name: "published",
      type: "checkbox",
      defaultValue: true,
      admin: { description: "Uncheck to hide without deleting." },
    },
  ],
};

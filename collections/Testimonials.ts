import type { CollectionConfig } from "payload";

/**
 * Client testimonials, shown as an auto-scrolling row on the home page.
 *
 * Unlike the services, this collection is meant to GROW: add, delete and
 * reorder are all available in /olympus, because collecting more quotes over
 * time is the entire point.
 *
 * `date` is a real date rather than the "May 2026" string the design shows.
 * Typed months drift in format the moment two people enter them, and a date
 * can be sorted and formatted per locale; the string cannot.
 *
 * `photo` is optional. A testimonial with no headshot falls back to the
 * person's initials rather than a broken image or a grey silhouette, so a
 * missing photo never blocks publishing a real quote.
 *
 * `role` is not optional, deliberately: an anonymous-sounding quote from a
 * name with no standing behind it is weaker than no quote at all.
 */
export const Testimonials: CollectionConfig = {
  slug: "testimonials",
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
      name: "quote",
      type: "textarea",
      required: true,
      admin: {
        description:
          "Their words, without surrounding quote marks. The card draws those.",
      },
    },
    {
      name: "rating",
      type: "number",
      required: true,
      defaultValue: 5,
      min: 1,
      max: 5,
      admin: { description: "Whole stars, 1 to 5." },
    },
    {
      name: "photo",
      type: "text",
      admin: {
        description: "Optional. Without one the card shows their initials.",
      },
    },
    {
      /**
       * The line under the name, and the whole reason a stranger believes the
       * quote. This replaced a `location` field: "Sheboygan, United States"
       * tells a reader nothing about whether this person's opinion is worth
       * anything, whereas "CEO at Three Roots International" does.
       */
      name: "role",
      type: "text",
      required: true,
      label: "Role & company",
      admin: {
        description:
          'What makes them worth listening to. Include the organisation, e.g. "CEO at Three Roots International" or "Programme Director, ZOA Ethiopia".',
      },
    },
    {
      name: "date",
      type: "date",
      admin: {
        description: "When they said it. Shown as the month and year.",
        date: { pickerAppearance: "monthOnly" },
      },
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

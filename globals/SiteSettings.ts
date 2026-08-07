import type { GlobalConfig } from "payload";

/**
 * Contact details and the office address, the things that change when the
 * company moves or swaps a number.
 *
 * Scoped deliberately. These stay in content/site.ts and are NOT editable:
 *
 *  - `url`, because it feeds every JSON-LD @id and every canonical URL, and is
 *    already environment-driven.
 *  - `registration` (commercial reg, TIN, VAT, licence), because those are
 *    legal identifiers verified against a government registry, not copy.
 *  - `mapEmbedUrl`, because it carries a baked-in Google place id and camera
 *    heading and cannot be reconstructed from a latitude and longitude. One
 *    bad paste replaces the office map with the middle of an ocean.
 *  - `mainNav` / `footerNav`, because the hrefs contain anchor fragments tied
 *    to service slugs in code.
 */
export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: "collapsible",
      label: "Contact",
      fields: [
        { name: "email", type: "email", required: true },
        {
          name: "phone",
          type: "text",
          required: true,
          admin: { description: "Primary number, shown with the WhatsApp link." },
        },
        {
          name: "phone2",
          type: "text",
          admin: { description: "Secondary number. Footer only." },
        },
        {
          name: "whatsapp",
          type: "text",
          required: true,
          admin: {
            description:
              "Digits only in international format, e.g. 251961412909. Used to build the wa.me link.",
          },
        },
        {
          name: "telegram",
          type: "text",
          required: true,
          admin: { description: "Username without the @." },
        },
      ],
    },
    {
      type: "collapsible",
      label: "Office",
      fields: [
        {
          name: "street",
          type: "text",
          required: true,
          admin: {
            description:
              "Street line. The long address (contact and about pages) is street, city, region, country; the short one (footer) drops the street.",
          },
        },
        { name: "city", type: "text", required: true },
        { name: "region", type: "text", required: true },
        { name: "country", type: "text", required: true },
        {
          name: "countryCode",
          type: "text",
          required: true,
          maxLength: 2,
          admin: { description: "ISO 3166-1 alpha-2, e.g. ET" },
        },
        {
          name: "latitude",
          type: "number",
          required: true,
          admin: { description: "Used only by LocalBusiness structured data." },
        },
        { name: "longitude", type: "number", required: true },
        {
          name: "mapUrl",
          type: "text",
          required: true,
          admin: {
            description:
              "Short Google Maps link. This is what every address on the site links to.",
          },
        },
      ],
    },
  ],
};

import type { CollectionConfig } from "payload";

/**
 * Uploaded images, stored in Cloudflare R2 and served from cdn.doxaplc.com.
 *
 * Deliberately NO `imageSizes` and no `formatOptions`. Those are the only two
 * things that make Payload require `sharp`, which is a large native dependency
 * we would be shipping in the container for no benefit: Cloudflare can resize
 * at the edge, and `next/image` already has cdn.doxaplc.com in its
 * remotePatterns. Width and height are still recorded, via the pure-JS
 * `image-dimensions` package Payload depends on directly.
 *
 * `alt` is required. An image on a marketing site with no alt text is a real
 * accessibility failure, and requiring it at the schema level is the only
 * reliable way to prevent it.
 */
export const Media: CollectionConfig = {
  slug: "media",
  access: {
    // The objects are public on the CDN regardless; pretending otherwise in the
    // API would be theatre.
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  upload: {
    mimeTypes: ["image/*"],
    /**
     * Local disk ONLY when R2 is not configured.
     *
     * In production R2 is configured, the s3Storage plugin takes over and
     * forces this to true anyway, so nothing is written to the container
     * filesystem, which has no persistent volume. Falling back to disk in
     * development is what makes the upload flow testable without credentials
     * instead of being a dead button until the keys arrive.
     */
    disableLocalStorage: Boolean(process.env.R2_BUCKET),
    staticDir: "public/uploads",
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: {
        description:
          "What the image shows, for screen readers and for when it fails to load.",
      },
    },
  ],
};

import type { CollectionConfig } from "payload";

/**
 * An append-only audit trail of consent decisions.
 *
 * GDPR does not just require consent, it requires being able to demonstrate
 * it. This is that evidence: what was chosen, against which version of the
 * policy, and when. `policyVersion` matters because re-consent is required
 * when the terms materially change, and without it you cannot tell which
 * visitors agreed to what.
 *
 * Rejections are recorded as well as acceptances. A record showing someone
 * declined is exactly as useful as one showing they agreed.
 */
export const ConsentEvents: CollectionConfig = {
  slug: "consent-events",
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => false,
    // Append-only: an audit trail that can be edited is not an audit trail.
    update: () => false,
    delete: () => false,
  },
  fields: [
    { name: "visitorHash", type: "text", required: true, index: true },
    { name: "visitorId", type: "text", index: true },
    { name: "analytics", type: "checkbox", defaultValue: false },
    { name: "marketing", type: "checkbox", defaultValue: false },
    {
      name: "policyVersion",
      type: "text",
      required: true,
      index: true,
    },
    {
      name: "action",
      type: "select",
      options: [
        { label: "Accepted all", value: "accept-all" },
        { label: "Rejected all", value: "reject-all" },
        { label: "Saved a custom selection", value: "custom" },
        { label: "Withdrawn", value: "withdrawn" },
      ],
      required: true,
    },
    { name: "country", type: "text", index: true },
  ],
};

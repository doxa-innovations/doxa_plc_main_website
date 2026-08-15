import type { Field } from "payload";

import { CHANNELS } from "@/lib/channel";

/**
 * The attribution snapshot shared by visits and by a lead's first/last touch.
 *
 * On a lead these values are DENORMALIZED rather than joined to a visit row.
 * That is deliberate: visits are pruned on a retention schedule, and a lead's
 * origin has to survive that. It also keeps the dashboard's group-by queries
 * single-table.
 */
export function touchFields(prefix = ""): Field[] {
  const n = (name: string) => (prefix ? `${prefix}${name}` : name);

  return [
    {
      name: n("channel"),
      type: "select",
      options: CHANNELS.map((c) => ({ label: c, value: c })),
      index: true,
    },
    { name: n("utmSource"), type: "text", index: true },
    { name: n("utmMedium"), type: "text" },
    { name: n("utmCampaign"), type: "text", index: true },
    { name: n("utmTerm"), type: "text" },
    { name: n("utmContent"), type: "text" },
    { name: n("gclid"), type: "text" },
    { name: n("fbclid"), type: "text" },
    { name: n("msclkid"), type: "text" },
    { name: n("ttclid"), type: "text" },
    { name: n("liFatId"), type: "text" },
    { name: n("referrer"), type: "text" },
    { name: n("referrerHost"), type: "text", index: true },
    { name: n("landingPath"), type: "text" },
  ];
}

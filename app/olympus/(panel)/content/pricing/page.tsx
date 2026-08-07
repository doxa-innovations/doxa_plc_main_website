import type { Metadata } from "next";

import { requireUser } from "@/lib/auth";
import { getPayloadClient } from "@/lib/payload";

import { PricingEditor } from "./PricingEditor";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Pricing" };

export default async function PricingEditorPage() {
  await requireUser();

  const payload = await getPayloadClient();
  // Unpublished rows are included here, unlike on the public site, so they can
  // be found and switched back on.
  const [tiers, addOns] = await Promise.all([
    payload.find({
      collection: "pricing-tiers",
      sort: "order",
      limit: 0,
      pagination: false,
      depth: 0,
      overrideAccess: true,
    }),
    payload.find({
      collection: "add-ons",
      sort: "order",
      limit: 0,
      pagination: false,
      depth: 0,
      overrideAccess: true,
    }),
  ]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
          Pricing
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Click a card to read it, the pencil to change it, the grip to move it.
        </p>
      </header>

      <PricingEditor tiers={tiers.docs} addOns={addOns.docs} />
    </div>
  );
}

import type { Metadata } from "next";

import { requireUser } from "@/lib/auth";
import { getPayloadClient } from "@/lib/payload";

import { ServicesEditor } from "./ServicesEditor";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Services" };

export default async function ServicesEditorPage() {
  // The page guards itself. A layout check is not enough: layouts and pages
  // render concurrently, so an unguarded page renders real data into the body
  // of the redirect.
  await requireUser();

  const payload = await getPayloadClient();
  const services = await payload.find({
    collection: "services",
    sort: "order",
    limit: 0,
    pagination: false,
    depth: 0,
    overrideAccess: true,
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
          Services
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          The six services are fixed. Click a card to read it, the pencil to
          change the words and the prices.
        </p>
      </header>

      <ServicesEditor services={services.docs} />
    </div>
  );
}

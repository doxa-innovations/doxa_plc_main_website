import type { Metadata } from "next";

import { requireUser } from "@/lib/auth";
import { getPayloadClient } from "@/lib/payload";

import { TestimonialsEditor } from "./TestimonialsEditor";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Testimonials" };

export default async function TestimonialsEditorPage() {
  // The page guards itself. A layout check is not enough: layouts and pages
  // render concurrently, so an unguarded page renders real data into the body
  // of the redirect.
  await requireUser();

  const payload = await getPayloadClient();
  // Unpublished rows are included here, unlike on the public site, so they can
  // be found and switched back on.
  const testimonials = await payload.find({
    collection: "testimonials",
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
          Testimonials
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          The scrolling row at the foot of the home page. Click a card to read
          it, the pencil to change it, the grip to move it.
        </p>
      </header>

      <TestimonialsEditor testimonials={testimonials.docs} />
    </div>
  );
}

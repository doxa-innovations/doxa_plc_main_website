import type { Metadata } from "next";

import { requireUser } from "@/lib/auth";
import { getPayloadClient } from "@/lib/payload";

import { ContactEditor } from "./ContactEditor";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Contact details" };

export default async function ContactEditorPage() {
  await requireUser();

  const payload = await getPayloadClient();
  const settings = await payload.findGlobal({
    slug: "site-settings",
    depth: 0,
    overrideAccess: true,
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
          Contact details
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Used in the footer, the contact page, the About page, the legal page,
          the confirmation emails, and the LocalBusiness structured data. One
          change updates all of them.
        </p>
      </header>

      <ContactEditor settings={settings} />

      <p className="text-xs leading-relaxed text-ink-muted/80">
        The registration numbers, the embedded map, and the navigation menus
        stay in code on purpose. Registration numbers are legal identifiers
        checked against a government registry; the map embed carries a Google
        place id that cannot be rebuilt from a latitude and longitude; and the
        navigation links contain anchors tied to service pages.
      </p>
    </div>
  );
}

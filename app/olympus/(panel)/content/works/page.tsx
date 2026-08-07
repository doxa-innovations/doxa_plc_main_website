import type { Metadata } from "next";

import { requireUser } from "@/lib/auth";
import { getPayloadClient } from "@/lib/payload";

import { WorksEditor } from "./WorksEditor";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Works" };

export default async function WorksEditorPage() {
  await requireUser();

  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "projects",
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
          Works
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Click a project to read it, the pencil to change it, the grip to move
          it.
        </p>
      </header>

      <WorksEditor projects={docs} />
    </div>
  );
}

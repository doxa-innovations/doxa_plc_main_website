import type { Metadata } from "next";

import { requireUser } from "@/lib/auth";
import { getPayloadClient } from "@/lib/payload";

import { TeamEditor } from "./TeamEditor";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Team" };

export default async function TeamEditorPage() {
  await requireUser();

  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "team-members",
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
          Team
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Click a person to read their profile, the pencil to change it, the
          grip to move them.
        </p>
      </header>

      <TeamEditor members={docs} />
    </div>
  );
}

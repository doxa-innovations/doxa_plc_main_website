import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { TeamGrid } from "@/components/marketing/TeamGrid";
import { CtaBand } from "@/components/marketing/CtaBand";

export const metadata = buildMetadata({
  title: "Our Team",
  description:
    "Meet the founders of Doxa Innovations — full-stack engineers and designers based in Bishoftu, Ethiopia. Real people with real faces, ready to build your software.",
  path: "/team",
});

export default function TeamPage() {
  return (
    <>
      <PageHeader
        eyebrow="Team"
        title="The people behind Doxa"
        lead="Three founders, one fully-equipped office in Bishoftu, and a shared standard for the work we ship."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Team", path: "/team" },
        ]}
      />

      <Section variant="surface">
        <TeamGrid showBios />
      </Section>

      <CtaBand
        title="Want to put a face to the work?"
        body="Book a free video call. You'll meet the team, and we'll learn what you're trying to build."
        primaryLabel="Book a Free Call"
      />
    </>
  );
}

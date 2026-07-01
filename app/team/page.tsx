import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { TeamGrid } from "@/components/marketing/TeamGrid";
import { CtaBand } from "@/components/marketing/CtaBand";
import { Reveal } from "@/components/Reveal";

export const metadata = buildMetadata({
  title: "Our Team",
  description:
    "Meet the team behind Doxa Innovations, full-stack engineers and designers based in Bishoftu, Ethiopia. Real people with real faces, ready to build your software.",
  path: "/team",
});

export default function TeamPage() {
  return (
    <>
      <PageHeader
        eyebrow="Team"
        title="The people behind Doxa"
        lead="The founders and engineers who build your product, in a fully-equipped office in Bishoftu, with a shared standard for everything we ship."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Team", path: "/team" },
        ]}
      />

      <Section variant="muted" frame grid>
        <h2 className="sr-only">Team members</h2>
        <Reveal>
          <TeamGrid showBios />
        </Reveal>
      </Section>

      <CtaBand
        title="Want to put a face to the work?"
        body="Book a free video call. You'll meet the team, and we'll learn what you're trying to build."
        primaryLabel="Book a Free Call"
      />
    </>
  );
}

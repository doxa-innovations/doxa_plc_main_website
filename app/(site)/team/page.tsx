import { buildMetadata } from "@/lib/metadata";
import { getTeam } from "@/lib/content";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/SectionHeading";
import { TeamGrid } from "@/components/marketing/TeamGrid";
import { FoundersBlock } from "@/components/marketing/FoundersBlock";
import { Reveal } from "@/components/Reveal";

export const metadata = buildMetadata({
  title: "Our Team",
  description:
    "Meet the team behind Doxa Innovations, full-stack engineers and designers based in Bishoftu, Ethiopia. The founders and the people who build your software.",
  path: "/team",
});

export default async function TeamPage() {
  const team = await getTeam();
  // Split on the explicit CMS flag, not on the role text — a founder who
  // retitles themselves should not fall out of the founders block.
  const founders = team.filter((m) => m.founder);
  const members = team.filter((m) => !m.founder);

  return (
    <>
      <PageHeader
        eyebrow="Team"
        title="The people behind Doxa"
        lead="The founders and engineers who build your product, in a fully-equipped office in Bishoftu, with a shared standard for everything we ship."
      />

      {founders.length > 0 && (
        <Section variant="surface" frame grid>
          <Reveal>
            <SectionHeading
              title="Founders"
              lead="Doxa was started by three engineers who wanted to build software properly, and to be reachable while doing it."
            />
          </Reveal>
          <Reveal delay={0.05}>
            <div className="mt-12">
              <FoundersBlock members={founders} />
            </div>
          </Reveal>
        </Section>
      )}

      {members.length > 0 && (
        <Section variant="muted" frame grid>
          <Reveal>
            <SectionHeading
              title="Our Team"
              lead="The engineers and designers delivering the work day to day."
            />
          </Reveal>
          <Reveal delay={0.05}>
            <div className="mt-12">
              <TeamGrid members={members} showBios />
            </div>
          </Reveal>
        </Section>
      )}
    </>
  );
}

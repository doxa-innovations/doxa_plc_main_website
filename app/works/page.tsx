import { buildMetadata } from "@/lib/metadata";
import { sortedProjects } from "@/content/projects";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { ProjectCard } from "@/components/marketing/ProjectCard";
import { CtaBand } from "@/components/marketing/CtaBand";
import { Reveal } from "@/components/Reveal";

export const metadata = buildMetadata({
  title: "Our Work",
  description:
    "Real, live software projects delivered for clients in the US, the Netherlands, and across East Africa, e-commerce platforms, custom systems, and institutional websites you can visit right now.",
  path: "/works",
});

export default function WorksPage() {
  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title="Work you can verify, not just view"
        lead="Every project is a production system with a live link. Open them, see the work for yourself."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Works", path: "/works" },
        ]}
      />

      <Section variant="muted" frame grid>
        <h2 className="sr-only">All projects</h2>
        <Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </Reveal>
      </Section>

      <CtaBand
        title="Have a project like these in mind?"
        body="Tell us what you're building. The first call is free, and there's no obligation."
      />
    </>
  );
}

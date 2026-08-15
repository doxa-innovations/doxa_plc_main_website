import { buildMetadata } from "@/lib/metadata";
import { getProjects } from "@/lib/content";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { ProjectCard } from "@/components/marketing/ProjectCard";
import { Reveal } from "@/components/Reveal";

export const metadata = buildMetadata({
  title: "Our Work",
  description:
    "Real, live software projects delivered for clients in the US, the Netherlands, and across East Africa, e-commerce platforms, custom systems, and institutional websites you can visit right now.",
  path: "/works",
});

export default async function WorksPage() {
  const projects = await getProjects();
  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title="Work you can verify, not just view"
        lead="Every project is a production system with a live link. Open them, see the work for yourself."
      />

      {/* Tinted band so the cards read as objects on a surface. The cards
          themselves keep their own dark treatment — see ProjectCard. */}
      <Section variant="muted" frame grid>
        <h2 className="sr-only">All projects</h2>
        <Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </Reveal>
      </Section>
    </>
  );
}

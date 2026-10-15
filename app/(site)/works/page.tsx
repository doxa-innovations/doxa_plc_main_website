import { buildMetadata } from "@/lib/metadata";
import { getProjects } from "@/lib/content";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/SectionHeading";
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

  // "Doxa product" is a switch on each project in /olympus.
  const clientWork = projects.filter((p) => !p.ownProduct);
  const ownProducts = projects.filter((p) => p.ownProduct);

  // Lead with the featured projects: the first one full width, the next two
  // side by side. If fewer than three are featured, the earliest of the rest
  // fill the gap, so the layout never shows a half-empty row.
  const featuredFirst = [
    ...clientWork.filter((p) => p.featured),
    ...clientWork.filter((p) => !p.featured),
  ];
  const [lead, ...afterLead] = featuredFirst;
  const pair = afterLead.slice(0, 2);
  const leadSlugs = new Set([lead, ...pair].filter(Boolean).map((p) => p.slug));
  const rest = clientWork.filter((p) => !leadSlugs.has(p.slug));

  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title="Work you can verify, not just view"
        lead="Every project is a production system with a live link. Open them, see the work for yourself."
      />

      {/* Tinted band so the cards read as objects on a surface. */}
      <Section variant="muted" frame grid>
        <SectionHeading
          title="Client projects"
          lead="Built for businesses and institutions in the US, the Netherlands and East Africa."
          align="left"
        />
        <Reveal>
          <div className="mt-10 grid gap-6">
            {lead && <ProjectCard project={lead} size="hero" />}
            {pair.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2">
                {pair.map((project) => (
                  <ProjectCard key={project.slug} project={project} size="large" />
                ))}
              </div>
            )}
            {rest.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
              </div>
            )}
          </div>
        </Reveal>
      </Section>

      {ownProducts.length > 0 && (
        <Section frame grid>
          <SectionHeading
            title="Our own products"
            lead="Software we build and run ourselves, held to the same standard as client work."
            align="left"
          />
          <Reveal>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {ownProducts.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </Reveal>
        </Section>
      )}
    </>
  );
}

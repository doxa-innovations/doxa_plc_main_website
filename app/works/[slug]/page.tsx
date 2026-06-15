import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import { allProjectSlugs, getProjectBySlug } from "@/content/projects";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { CountryFlag } from "@/components/CountryFlag";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/marketing/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { creativeWorkSchema, graph } from "@/lib/jsonld";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return allProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return buildMetadata({ title: "Project Not Found" });
  return buildMetadata({
    title: `${project.client} — ${project.title}`,
    description: project.summary,
    path: `/works/${project.slug}`,
    ogImage: project.coverImage,
  });
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <>
      {/* Header */}
      <section className="border-b border-border bg-surface-muted pb-10 pt-28 sm:pt-32">
        <Container>
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Works", path: "/works" },
              { name: project.client, path: `/works/${project.slug}` },
            ]}
          />
          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink/60">
            <span className="inline-flex items-center gap-1.5">
              <CountryFlag code={project.countryCode} className="text-base" />
              {project.country}
            </span>
            <span aria-hidden>·</span>
            <span>{project.industry}</span>
            {project.status === "in-development" && (
              <>
                <span aria-hidden>·</span>
                <Badge className="bg-pj-accent text-pj-white">
                  In Development
                </Badge>
              </>
            )}
          </div>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
            {project.client}
          </h1>
          <p className="mt-2 text-lg font-medium text-pj-secondary">
            {project.title}
          </p>
          {project.liveUrl && (
            <div className="mt-6">
              <Button asChild>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit live site
                  <ArrowUpRight className="size-4" strokeWidth={2} />
                </a>
              </Button>
            </div>
          )}
        </Container>
      </section>

      {/* Cover image */}
      <Container className="py-10 sm:py-12">
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-surface-muted">
          <Image
            src={project.coverImage}
            alt={`${project.client} — ${project.title}`}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1100px"
            className="object-cover"
          />
        </div>
      </Container>

      {/* Case study */}
      <Section variant="surface" className="pt-0">
        <div className="mx-auto grid max-w-4xl gap-10 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div>
              <h2 className="text-xl font-bold text-ink">The challenge</h2>
              <p className="mt-3 text-ink/70">{project.problem}</p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-ink">What we built</h2>
              <p className="mt-3 text-ink/70">{project.whatWeBuilt}</p>
            </div>
          </div>
          <aside className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-ink/50">
                Tech Stack
              </h3>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.techStack.map((t) => (
                  <Badge key={t} variant="secondary" className="font-normal">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-ink/50">
                Industry
              </h3>
              <p className="mt-2 text-sm text-ink/70">{project.industry}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-ink/50">
                Country
              </h3>
              <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-ink/70">
                <CountryFlag code={project.countryCode} />
                {project.country}
              </p>
            </div>
          </aside>
        </div>

        <div className="mx-auto mt-12 max-w-4xl">
          <Link
            href="/works"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-pj-secondary hover:underline"
          >
            <ArrowLeft className="size-4" />
            Back to all projects
          </Link>
        </div>
      </Section>

      <CtaBand />

      <JsonLd schema={graph(creativeWorkSchema(project))} />
    </>
  );
}

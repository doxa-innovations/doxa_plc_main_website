import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, FileText, Quote } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import { getProjectBySlug, getSite } from "@/lib/content";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { GridField, FrameMarks } from "@/components/visual/Decor";
import { CountryFlag } from "@/components/CountryFlag";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/JsonLd";
import { creativeWorkSchema, graph } from "@/lib/jsonld";

type Params = Promise<{ slug: string }>;

/**
 * `generateStaticParams` is deliberately absent.
 *
 * Next calls it unconditionally for any route with dynamic segments, and
 * `export const dynamic = "force-dynamic"` does NOT suppress it. Reading
 * project slugs there would open a database connection during `next build`,
 * which has no database in the Docker image, and fail the build. Pages are
 * rendered on demand instead and the reads are cached in lib/content.ts.
 */

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return buildMetadata({ title: "Project Not Found" });
  return buildMetadata({
    title: `${project.client}, ${project.title}`,
    description: project.summary,
    path: `/works/${project.slug}`,
    ogImage: project.coverImage,
  });
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { slug } = await params;
  const [project, SITE] = await Promise.all([getProjectBySlug(slug), getSite()]);
  if (!project) notFound();

  return (
    <>
      {/* Header */}
      <section className="relative isolate overflow-hidden border-b border-line pb-10 pt-28 sm:pt-32">
        <GridField />
        <FrameMarks variant="plus" />
        <Container className="relative text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-ink/60 sm:justify-start">
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
          <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-ink sm:mx-0 sm:text-5xl">
            {project.client}
          </h1>
          <p className="mt-2 text-lg font-medium text-brand">
            {project.title}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 sm:justify-start">
            {project.liveUrl && (
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
            )}
            <Button asChild variant="outline">
              <a
                href={project.recommendationUrl ?? SITE.recommendationsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileText className="size-4" strokeWidth={1.75} />
                View recommendation letter
              </a>
            </Button>
          </div>
        </Container>
      </section>

      {/* Cover image */}
      <Container className="py-10 sm:py-12">
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-surface-muted">
          <Image
            src={project.coverImage}
            alt={`${project.client}, ${project.title}`}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1100px"
            className="object-cover"
          />
        </div>
      </Container>

      {/* Case study profile */}
      <Section variant="muted" frame className="pt-0">
        <div className="mx-auto max-w-4xl">
          <p className="max-w-3xl text-pretty text-lg text-ink-muted">
            {project.summary}
          </p>

          <div className="mt-12 grid gap-12 lg:grid-cols-3">
            <div className="space-y-12 lg:col-span-2">
              {/* The need */}
              <div>
                <h2 className="font-display text-2xl font-semibold text-ink">
                  The need
                </h2>
                <p className="mt-3 text-ink-muted">{project.problem}</p>
              </div>

              {/* How we approached it */}
              <div>
                <h2 className="font-display text-2xl font-semibold text-ink">
                  How we approached it
                </h2>
                <ol className="mt-6 space-y-0">
                  {project.approach.map((step, i) => (
                    <li key={i} className="relative flex gap-5 pb-8 last:pb-0">
                      {i < project.approach.length - 1 && (
                        <span
                          aria-hidden
                          className="absolute left-[1.0625rem] top-10 h-[calc(100%-1.75rem)] w-px bg-line-strong"
                        />
                      )}
                      <span className="relative z-10 inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-line bg-surface font-display text-sm font-semibold text-brand shadow-[0_0_24px_-6px_rgba(178,119,211,0.8)]">
                        {i + 1}
                      </span>
                      <div className="pt-1">
                        <h3 className="font-semibold text-ink">{step.title}</h3>
                        <p className="mt-1 text-sm text-ink-muted">
                          {step.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* The solution */}
              <div>
                <h2 className="font-display text-2xl font-semibold text-ink">
                  The solution
                </h2>
                <p className="mt-3 text-ink-muted">{project.whatWeBuilt}</p>
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
                <p className="mt-2 text-sm text-ink-muted">{project.industry}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-ink/50">
                  Country
                </h3>
                <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-ink-muted">
                  <CountryFlag code={project.countryCode} />
                  {project.country}
                </p>
              </div>
              {project.liveUrl && (
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-ink/50">
                    Live
                  </h3>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 break-all text-sm text-brand hover:underline"
                  >
                    {project.liveUrl.replace(/^https?:\/\//, "")}
                    <ArrowUpRight className="size-3.5 shrink-0" strokeWidth={1.75} />
                  </a>
                </div>
              )}
            </aside>
          </div>

          {/* Testimonial (shown once the client's quote is added) */}
          {project.testimonial && (
            <figure className="relative mt-14 overflow-hidden rounded-[1.6rem] border border-line bg-panel p-8 shadow-[0_40px_90px_-50px_rgba(124,60,180,0.7)] sm:p-10">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full bg-pj-primary/20 blur-[80px]"
              />
              <Quote
                className="relative size-8 text-brand"
                strokeWidth={1.5}
                aria-hidden
              />
              <blockquote className="relative mt-4 text-balance font-display text-xl font-medium text-ink sm:text-2xl">
                {project.testimonial.quote}
              </blockquote>
              <figcaption className="relative mt-5 text-sm text-ink-muted">
                <span className="font-semibold text-ink">
                  {project.testimonial.name}
                </span>
                , {project.testimonial.role}
              </figcaption>
            </figure>
          )}

          <div className="mt-14">
            <Link
              href="/works"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
            >
              <ArrowLeft className="size-4" />
              Back to all projects
            </Link>
          </div>
        </div>
      </Section>

      <JsonLd schema={graph(creativeWorkSchema(project))} />
    </>
  );
}

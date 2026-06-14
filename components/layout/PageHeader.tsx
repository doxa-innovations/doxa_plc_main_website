import { Container } from "./Container";
import { Breadcrumbs, type Crumb } from "@/components/seo/Breadcrumbs";

/**
 * Standard inner-page header: clears the fixed navbar, shows breadcrumbs
 * (which also emit BreadcrumbList JSON-LD), and renders the page title.
 */
export function PageHeader({
  eyebrow,
  title,
  lead,
  breadcrumbs,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  breadcrumbs?: Crumb[];
}) {
  return (
    <section className="border-b border-border bg-surface-muted pb-12 pt-28 sm:pb-16 sm:pt-32">
      <Container>
        {breadcrumbs && (
          <div className="mb-5">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}
        {eyebrow && (
          <p className="text-sm font-semibold uppercase tracking-wide text-pj-primary">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-2 max-w-3xl text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
          {title}
        </h1>
        {lead && <p className="mt-4 max-w-2xl text-lg text-ink/70">{lead}</p>}
      </Container>
    </section>
  );
}

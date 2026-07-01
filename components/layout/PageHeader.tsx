import { Container } from "./Container";
import { Breadcrumbs, type Crumb } from "@/components/seo/Breadcrumbs";
import { GridField, FrameMarks } from "@/components/visual/Decor";

/**
 * Inner-page header on the dark canvas: clears the floating navbar, shows
 * breadcrumbs (which also emit BreadcrumbList JSON-LD), a violet glow, and the
 * page title in the display face.
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
    <section className="relative isolate overflow-hidden border-b border-line bg-surface pb-14 pt-32 sm:pb-20 sm:pt-36">
      <GridField />
      <FrameMarks variant="plus" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 size-[44rem] -translate-x-1/2 rounded-full bg-pj-primary/15 blur-[120px]"
      />
      {/* Centered on mobile, left-aligned from sm up. */}
      <Container className="relative text-center sm:text-left">
        {breadcrumbs && (
          <div className="mb-6 flex justify-center sm:justify-start">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}
        {eyebrow && (
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-brand">
            {eyebrow}
          </p>
        )}
        <h1 className="mx-auto max-w-3xl text-balance font-display text-4xl font-semibold tracking-[-0.03em] text-ink sm:mx-0 sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {lead && (
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg text-ink-muted sm:mx-0">
            {lead}
          </p>
        )}
      </Container>
    </section>
  );
}

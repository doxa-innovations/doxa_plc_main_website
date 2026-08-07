import type { CSSProperties } from "react";
import { Container } from "./Container";
import { GridField, FrameMarks } from "@/components/visual/Decor";

/** Stagger step for the entrance, in ms. */
const STEP = 90;

const delay = (i: number) => ({ "--ph-delay": `${i * STEP}ms` }) as CSSProperties;

/**
 * Inner-page header on the dark canvas: clears the floating navbar, adds a
 * violet glow, and rises into place on first paint.
 *
 * The entrance is the `.ph-rise` CSS animation (globals.css) rather than
 * motion, which keeps this a server component — no client bundle, nothing to
 * hydrate, and no risk of the server/client variant mismatch that a
 * `useReducedMotion()` branch introduces.
 */
export function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
}) {
  // The eyebrow is optional, so the title leads the stagger when it is absent
  // and nothing animates against an invisible gap.
  let i = 0;

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
        {eyebrow && (
          <p
            style={delay(i++)}
            className="ph-rise mb-3 inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-brand"
          >
            {eyebrow}
          </p>
        )}
        <h1
          style={delay(i++)}
          className="ph-rise mx-auto max-w-3xl text-balance font-display text-4xl font-semibold tracking-[-0.03em] text-ink sm:mx-0 sm:text-5xl lg:text-6xl"
        >
          {title}
        </h1>
        {lead && (
          <p
            style={delay(i++)}
            className="ph-rise mx-auto mt-5 max-w-2xl text-pretty text-lg text-ink-muted sm:mx-0"
          >
            {lead}
          </p>
        )}
      </Container>
    </section>
  );
}

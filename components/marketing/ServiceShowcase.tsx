import type { CSSProperties } from "react";
import { Check, Clock, Tag } from "lucide-react";
import type { Service } from "@/content/types";
import { ServiceArt } from "@/components/marketing/ServiceArt";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/** Depth of the interlocking step, and how wide the tab is across the card. */
const NOTCH_H = 76;
const NOTCH_W = 38;

/**
 * The seam. The tab is inset from the notch by this much on its two exposed
 * edges, so the page shows straight through the join — the "border" between two
 * services is the aurora itself rather than a drawn line, which is what keeps it
 * from reading as a table.
 */
const GAP = 22;
const GAP_PCT = 1.6;

/**
 * One colour for every panel, carried at a single opacity.
 *
 * This used to be six tints, one per service. Stepping the shade down the page
 * read as a gradient rather than as six panels — the opposite of the point. The
 * panels are separated by the seam and the gap; shade does not need to do it.
 */
const TINT = "38 17 78";

/**
 * Shared by every band. `border` rather than `ring` so the edge where one band
 * meets another can be dropped per side — a ring is all four sides, which drew
 * a line straight across the join and made the tab read as a separate box
 * sitting on the panel rather than part of it.
 */
const BAND =
  "absolute border border-line/70 bg-[rgb(var(--tint)/0.45)] backdrop-blur-2xl";

/**
 * One service panel: drawn art beside the words, on tinted glass.
 *
 * The stepped silhouette is built from up to three ABUTTING bands rather than
 * one `clip-path`. `clip-path: polygon()` only takes straight segments, so its
 * step corners are always square; the alternative that rounds them,
 * `clip-path: path()`, needs absolute coordinates and cannot follow a panel
 * whose height is set by its own text. Bands are percentage-wide and
 * auto-height, so they stay responsive AND every outer corner rounds.
 *
 * They abut rather than overlap on purpose: two translucent layers stacked
 * would double up and print the seam as a darker band straight across the
 * glass.
 *
 * Below `sm` the interlock is dropped entirely for a single rounded card — at
 * that width a 38% tab is a sliver and the steps only cost vertical space.
 */
export function ServiceShowcase({
  service,
  price,
  index,
  total,
}: {
  service: Service;
  /** Formatted by the page, which knows whether the visitor is in Ethiopia. */
  price: string;
  index: number;
  total: number;
}) {
  const hasTab = index > 0;
  const hasNotch = index < total - 1;
  // Seam i sits on the right for even i, so the zig-zag alternates.
  const notchRight = index % 2 === 0;
  const tabRight = (index - 1) % 2 === 0;
  const artLeft = index % 2 === 1;

  return (
    <article
      id={service.slug}
      style={
        {
          "--tint": TINT,
          "--pull": hasTab ? `-${NOTCH_H}px` : "0px",
          // Clear the step, plus breathing room. Derived from the same
          // constants as the shape: hardcoding this as a rem value is how the
          // heading ended up sitting above the tab that overlaps it.
          "--pad-t": `${NOTCH_H + GAP + 28}px`,
          "--pad-b": `${NOTCH_H + 28}px`,
        } as CSSProperties
      }
      className={cn(
        "group relative isolate scroll-mt-24 sm:mt-[var(--pull)]",
        // Mobile: one plain rounded card, no interlock.
        "rounded-[2rem] bg-[rgb(var(--tint)/0.45)] backdrop-blur-2xl ring-1 ring-inset ring-line/70",
        "sm:rounded-none sm:bg-transparent sm:ring-0 sm:backdrop-blur-none",
      )}
    >
      {/* The silhouette, behind the content. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 hidden sm:block">
        <div
          style={{
            top: hasTab ? NOTCH_H + GAP : 0,
            bottom: hasNotch ? NOTCH_H : 0,
          }}
          className={cn(
            BAND,
            "inset-x-0",
            // Round only the corners that are actually exposed; the ones a
            // band sits against stay square so the join is invisible.
            !hasTab && "rounded-t-[2rem]",
            hasTab && (tabRight ? "rounded-tl-[2rem]" : "rounded-tr-[2rem]"),
            !hasNotch && "rounded-b-[2rem]",
            hasNotch && (notchRight ? "rounded-br-[2rem]" : "rounded-bl-[2rem]"),
          )}
        />
        {/* Drawn AFTER the middle band, and 1px into it, so it covers the
            middle's border at the join. Its own attaching edge carries no
            border, so the two read as one shape. */}
        {hasTab && (
          <div
            style={{
              top: GAP,
              width: `${NOTCH_W - GAP_PCT}%`,
              height: NOTCH_H + 1,
            }}
            className={cn(
              BAND,
              "rounded-t-[2rem] border-b-0",
              tabRight ? "right-0" : "left-0",
            )}
          />
        )}
        {hasNotch && (
          <div
            style={{ width: `${100 - NOTCH_W}%`, height: NOTCH_H + 1 }}
            className={cn(
              BAND,
              "bottom-0 rounded-b-[2rem] border-t-0",
              notchRight ? "left-0" : "right-0",
            )}
          />
        )}
      </div>
      <div
        className={cn(
          "grid items-center gap-8 p-6 sm:p-9 lg:grid-cols-2 lg:gap-12",
          // Extra room on whichever edges carry a step, so the copy never
          // runs into the notch.
          hasTab && "sm:pt-[var(--pad-t)]",
          hasNotch && "sm:pb-[var(--pad-b)]",
          artLeft && "lg:[&>*:first-child]:order-2",
        )}
      >
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] text-ink">
            {service.name}
          </h2>
          <p className="mt-2 text-ink-muted">{service.summary}</p>

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <p className="flex items-center gap-2 text-ink-muted">
              <Clock className="size-4 text-brand" aria-hidden />
              <span className="sr-only">Timeline: </span>
              {service.timeline}
            </p>
            <p className="flex items-center gap-2 font-semibold text-ink">
              <Tag className="size-4 text-brand" aria-hidden />
              <span className="sr-only">Starting price: </span>
              {price}
            </p>
          </div>

          <p className="mt-3 text-sm text-ink-muted">
            <span className="font-semibold text-ink">Best for: </span>
            {service.forWhom}
          </p>

          <p className="mt-4 text-sm text-ink-muted">{service.description}</p>

          <h3 className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
            What you get
          </h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {service.deliverables.map((d) => (
              <li
                key={d}
                className="flex items-start gap-2 text-sm text-ink-muted"
              >
                <Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
                {d}
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {service.techStack.map((t) => (
              <Badge key={t} variant="secondary" className="font-normal">
                {t}
              </Badge>
            ))}
          </div>
        </div>

        {/* The art panel, same treatment as the About page's reach map. */}
        <div className="relative overflow-hidden rounded-[1.4rem] border border-line bg-deep/70 p-4 sm:p-6">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 size-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pj-primary/20 blur-[100px]"
          />
          <div className="relative aspect-[400/260]">
            <ServiceArt slug={service.slug} />
          </div>
        </div>
      </div>
    </article>
  );
}

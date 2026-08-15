import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export interface ProcessStep {
  n: number;
  title: string;
  body: string;
}

/** How far each step is pushed right relative to the one above it. */
const OFFSET_STEP = 14;

/**
 * One class per position, because the sequence needs a shared END.
 *
 * A single keyframe with a per-arrow `animation-delay` would stagger the switch
 * OFF as well as the switch on; these share a duration and differ only in when
 * they ramp up, so all three go dark on the same frame. Listed explicitly, so a
 * fifth process step is a visible gap here rather than a silent wrap-around.
 */
const ARROW_ANIMATION = [
  "motion-safe:animate-arrow-seq-1",
  "motion-safe:animate-arrow-seq-2",
  "motion-safe:animate-arrow-seq-3",
] as const;

/**
 * A dotted arrow bridging one step to the next.
 *
 * Drawn per-gap rather than as one overlay spanning the list: an overlay would
 * need to know each card's measured position, which is only knowable at runtime
 * and breaks the moment the text reflows. A short arrow anchored between two
 * cards stays correct at any width.
 */
function StepArrow({ index }: { index: number }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 56 44"
      fill="none"
      className={cn(
        "h-12 w-20 text-brand opacity-35 sm:w-28",
        ARROW_ANIMATION[index] ?? ARROW_ANIMATION[ARROW_ANIMATION.length - 1],
      )}
    >
      <path
        d="M6 3 C6 20, 20 20, 34 33"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeDasharray="2 5"
      />
      <path
        d="M27 32 L36 35 L33 26"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * The steps as a descending staircase: each one sits a little further right
 * than the last, with a dotted arrow carrying you down to it.
 *
 * Widths are derived, not fixed. Every card is `100% - (n-1) × OFFSET` wide, so
 * the first starts flush left, each is inset one step further, and the LAST one
 * ends flush against the container's right edge no matter how many steps there
 * are. Change OFFSET_STEP or add a step and the arithmetic still lands.
 *
 * Both values are CSS variables so they can be dropped below `sm`, where there
 * is no room to stagger and the list reads better as a straight column.
 */
export function ProcessStaircase({ steps }: { steps: ProcessStep[] }) {
  const width = 100 - (steps.length - 1) * OFFSET_STEP;

  return (
    <ol className="mt-14 flex flex-col">
      {steps.map((s, i) => (
        <li
          key={s.n}
          style={
            {
              "--off": `${i * OFFSET_STEP}%`,
              "--w": `${width}%`,
            } as CSSProperties
          }
          className="ms-0 w-full sm:ms-[var(--off)] sm:w-[var(--w)]"
        >
          <div className="card-lift flex items-start gap-4 rounded-[1.6rem] border border-line bg-panel px-5 py-4 sm:px-6 sm:py-5">
            <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line bg-pj-primary/15 font-display text-base font-semibold text-brand shadow-[0_0_30px_-6px_rgba(178,119,211,0.8)]">
              {s.n}
            </span>
            <div>
              <h3 className="font-display text-base font-semibold text-ink">
                {s.title}
              </h3>
              <p className="mt-1 text-sm text-ink-muted">{s.body}</p>
            </div>
          </div>

          {/* Indented so it leaves the card it belongs to and points at the
              next one, which sits further right again. */}
          {i < steps.length - 1 && (
            <div className="ms-8 sm:ms-16" aria-hidden>
              <StepArrow index={i} />
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}

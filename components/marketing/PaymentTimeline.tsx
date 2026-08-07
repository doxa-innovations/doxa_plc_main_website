"use client";

import { motion, useReducedMotion } from "motion/react";
import { PAYMENT_MILESTONES } from "@/content/process";

const EASE = [0.16, 1, 0.3, 1] as const;

/** How long one segment takes to fill. */
const FILL = 0.6;

/** Quiet gap after a segment finishes before the next starts. */
const GAP = 0.4;

/** So milestone i starts only once i-1 has finished and the pause has passed. */
const STEP = FILL + GAP;

/**
 * The 30 / 40 / 30 milestone bar, filling like a battery when it scrolls in.
 *
 * ONE viewport observer, on the outer container, with the states propagated to
 * the children as variants. Each element used to carry its own `whileInView`,
 * which made the timing unreliable: a segment starts at `flex-basis: 0%`, so it
 * is a zero-width box, and an observer watching a zero-area target does not
 * report intersection the way a laid-out one does. The last segment in
 * particular could sit unfilled well past its turn. Observing the container
 * once and staggering by delay makes every milestone land on schedule.
 *
 * As in RevealUp: `initial` never branches on `useReducedMotion()`, because the
 * hook disagrees between server and client and would desync hydration. Only the
 * transition is branched.
 */
export function PaymentTimeline() {
  const reduce = useReducedMotion();
  const at = (i: number) => (reduce ? 0 : i * STEP);

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.4 }}
      className="rounded-[1.5rem] border border-line bg-panel p-6 shadow-[0_40px_90px_-50px_rgba(124,60,180,0.6)] sm:p-8"
    >
      {/* The track stays visible under the fill, so an unfilled segment reads
          as "not yet paid" rather than as missing layout. */}
      <div
        aria-hidden
        className="flex h-11 overflow-hidden rounded-xl bg-panel-strong"
      >
        {PAYMENT_MILESTONES.map((m, i) => (
          <motion.div
            key={m.label}
            variants={{
              hidden: { flexBasis: "0%" },
              show: { flexBasis: `${m.percent}%` },
            }}
            transition={
              reduce
                ? { duration: 0 }
                : { duration: FILL, delay: at(i), ease: EASE }
            }
            className={
              i % 2 === 0
                ? "flex shrink-0 items-center justify-center overflow-hidden bg-pj-primary text-sm font-bold text-pj-white"
                : "flex shrink-0 items-center justify-center overflow-hidden bg-pj-secondary text-sm font-bold text-pj-accent"
            }
          >
            <motion.span
              variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { duration: 0.3, delay: at(i) + FILL * 0.5 }
              }
            >
              {m.percent}%
            </motion.span>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        {PAYMENT_MILESTONES.map((m, i) => (
          <motion.dl
            key={m.label}
            variants={{
              hidden: { opacity: 0, y: 10 },
              show: { opacity: 1, y: 0 },
            }}
            transition={
              reduce
                ? { duration: 0 }
                : { duration: 0.45, delay: at(i) + FILL * 0.5, ease: EASE }
            }
          >
            <dt className="text-sm font-bold text-ink">
              {m.percent}%, {m.label}
            </dt>
            <dd className="mt-1 text-sm text-ink-muted">{m.unlocks}</dd>
          </motion.dl>
        ))}
      </div>
    </motion.div>
  );
}

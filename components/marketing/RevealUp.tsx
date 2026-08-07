"use client";

import { motion, useReducedMotion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Slide-up-on-enter, driven by motion rather than `animation-timeline: view()`.
 *
 * The CSS `Reveal` this sits alongside is Chromium-only — Safari and Firefox
 * ignore `view()` entirely and the content simply appears, which is why the
 * process stages read as static there. This costs a little client JS and works
 * everywhere.
 *
 * `initial` is deliberately NOT branched on `useReducedMotion()`. That hook
 * returns null on the server and true on the client, so branching the rendered
 * styles produces a hydration mismatch (Hero.tsx has exactly that bug). Only
 * the transition is branched, which the server never renders.
 */
export function RevealUp({
  children,
  delay = 0.4,
  className,
}: {
  children: React.ReactNode;
  /** Seconds before the slide starts once the block enters view. */
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      // `once: false` on purpose: leaving the viewport animates back to
      // `initial`, so scrolling up slides the block down and away and scrolling
      // back down lifts it again. Bi-directional, not a one-shot.
      //
      // The bottom margin is what sets WHEN it fires. Without it a tall block
      // counts as "in view" the instant its top edge clears the fold, so a
      // stage animated while it was still off the bottom of the screen and the
      // motion was over before you reached it. Pulling the root's bottom edge
      // up by 42% means a stage only starts once it has risen past roughly the
      // middle of the viewport — as you finish the one above it.
      viewport={{ once: false, amount: 0.15, margin: "0px 0px -42% 0px" }}
      transition={
        reduce
          ? { duration: 0 }
          : { duration: 0.7, delay, ease: EASE }
      }
    >
      {children}
    </motion.div>
  );
}

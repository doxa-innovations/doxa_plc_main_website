"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { motion, useReducedMotion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

/** How long one stage takes to slide up and fade in. */
const DURATION = 0.7;

/**
 * Stage one is NOT scroll-triggered. It reveals itself this long after the page
 * loads, so by the time the visitor has read the header and scrolled down, the
 * sequence has already opened on its own.
 */
const OPENING_DELAY = 1200;

/**
 * How near the top of the document counts as "back at the beginning" — the one
 * and only place the sequence rearms.
 *
 * Not zero: scroll restoration, a trackpad fling and a smooth-scrolled anchor
 * all routinely settle a pixel or two short, and an exact test would leave the
 * stages latched open with no way back.
 */
const TOP = 8;

/**
 * Which run of the sequence is current. Bumping it is what rearms every stage
 * at once — see the latch in `ProcessStep`.
 */
const RunContext = createContext(0);

/**
 * Wraps the stage list and owns the single question the stages cannot answer
 * individually: has the visitor gone back to the top of the page?
 *
 * That is the only reset. Scrolling up THROUGH the stages leaves them alone,
 * which is the whole point — see `ProcessStep`.
 */
export function ProcessSteps({ children }: { children: ReactNode }) {
  const [run, setRun] = useState(0);

  useEffect(() => {
    let wasAtTop = window.scrollY <= TOP;

    const onScroll = () => {
      const atTop = window.scrollY <= TOP;
      // Only the CROSSING into the top counts. Testing `atTop` alone would
      // rearm on every scroll event while sitting up there, restarting the
      // opening timer over and over.
      if (atTop && !wasAtTop) setRun((n) => n + 1);
      wasAtTop = atTop;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <RunContext.Provider value={run}>{children}</RunContext.Provider>;
}

/**
 * One stage of the process, revealed once and then LEFT ALONE.
 *
 * The behaviour this replaces was bi-directional: leaving the viewport animated
 * a stage back to its initial state, so scrolling up un-built the list and
 * scrolling down re-built it, and a stage could be seen re-entering while the
 * one below it was still on screen. Here a stage that has appeared stays
 * appeared for the rest of the run.
 *
 * The latch stores WHICH run revealed the stage rather than a boolean, which is
 * what makes "hold until we are back at the top" fall out for free: the stage
 * is shown only while its stamp matches the current run, so bumping the run
 * clears all six at once, and any stage still on screen re-latches immediately
 * because the effect below depends on `run`.
 */
export function ProcessStep({
  index,
  children,
}: {
  index: number;
  children: ReactNode;
}) {
  const run = useContext(RunContext);
  const reduce = useReducedMotion();

  const [shownIn, setShownIn] = useState<number | null>(null);
  const shown = shownIn === run;

  // Stage one opens the sequence on a timer. It still honours the observer as
  // well, so someone who scrolls straight down within the first second finds it
  // already there rather than blank.
  const opensItself = index === 0;
  useEffect(() => {
    if (!opensItself) return;
    const timer = setTimeout(() => setShownIn(run), reduce ? 0 : OPENING_DELAY);
    return () => clearTimeout(timer);
  }, [opensItself, run, reduce]);

  return (
    <motion.div
      // `onViewportEnter` rather than `useInView` + an effect: entering the
      // viewport is an EVENT, and latching in the callback keeps it one render
      // instead of the cascading pair an effect would produce.
      //
      // There is deliberately no `onViewportLeave`. Leaving is the case this
      // component exists to ignore.
      onViewportEnter={() => setShownIn(run)}
      // The bottom margin sets WHEN a stage fires. Without it a tall stage
      // counts as in view the instant its top edge clears the fold, so it would
      // animate while still off the bottom of the screen and be over before you
      // arrived. Pulling the root's bottom edge up by 42% means a stage starts
      // only once it has risen past roughly mid-viewport, as you finish the one
      // above it.
      viewport={{ once: false, amount: 0.15, margin: "0px 0px -42% 0px" }}
      // `initial` never branches on `useReducedMotion()`: the hook returns null
      // on the server and a real value on the client, so branching the rendered
      // styles desyncs hydration. Only the transition is branched, which the
      // server never renders.
      initial={{ opacity: 0, y: 34 }}
      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 34 }}
      transition={reduce ? { duration: 0 } : { duration: DURATION, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

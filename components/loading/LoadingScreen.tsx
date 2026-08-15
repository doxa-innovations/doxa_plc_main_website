"use client";

import type { RefObject } from "react";
import { AnimatePresence, motion } from "motion/react";
import { GlowField, GridField, Rings } from "@/components/visual/Decor";
import { cn } from "@/lib/utils";

/** The house entrance curve (Hero.tsx, Navbar.tsx). */
const EASE = [0.16, 1, 0.3, 1] as const;

const WORD = "LOADING";

export type LoaderState = "boot" | "loading" | "idle";

/**
 * The full-screen transition curtain.
 *
 * Purely presentational — every timing decision lives in
 * RouteLoaderProvider. The progress fill is driven by writing straight to
 * `barRef.style.width` on each animation frame rather than through state,
 * so a 60fps bar costs zero React re-renders.
 *
 * Sits at z-[90]: above the navbar (z-50), mini player (z-[60]) and consent
 * bar (z-[70]), but below the global film grain (z-100, globals.css), so the
 * curtain picks up the site's texture for free.
 */
export function LoadingScreen({
  state,
  barRef,
}: {
  state: LoaderState;
  barRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <AnimatePresence>
      {state !== "idle" && (
        // A <section> with an accessible name, not a <div>: that maps to the
        // `region` landmark, and every other element here is decorative and
        // aria-hidden, so as a plain div the curtain was the one piece of page
        // content sitting outside any landmark. `role="status"` moved to the
        // sr-only line below, which is the thing that should actually be
        // announced.
        <motion.section
          key="route-loader"
          aria-label="Loading"
          // `initial={false}` renders straight at the animate state, so the
          // curtain is simply *there* — no fade-in, on boot or on a click. A
          // curtain that fades in shows you the page it is meant to hide.
          // Only the exit is animated.
          initial={false}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          // The boot curtain gets out of the way faster than a navigation one.
          // On first load this fade is pure cost — it sits between the browser
          // and the page it is covering, and Speed Index counts every frame of
          // it. On a click it is the transition itself, so it keeps its beat.
          transition={{ duration: state === "boot" ? 0.28 : 0.5, ease: EASE }}
          className={cn(
            "fixed inset-0 z-[90] overflow-hidden",
            state === "boot" && "route-loader-boot",
          )}
        >
          <p className="sr-only" role="status" aria-live="polite">
            Loading
          </p>
          {/* The glass itself. Deliberately /70 rather than the site's usual
              /95: at 95% nothing shows through, and the brief is "no legible
              content, but visible movement". A 64px blur destroys legibility
              while colour masses behind still shift as the page swaps. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-deep/70 backdrop-blur-[64px] backdrop-saturate-150"
          />

          {/* Guarantees motion even when the page behind is perfectly static.
              `z-0` overrides each layer's built-in -z-10 (tailwind-merge keeps
              the last conflicting z-utility). */}
          <GlowField blooms="duo" className="z-0" />
          <Rings className="z-0 motion-safe:animate-ring-drift" />
          <GridField cell={56} fade="edges" className="z-0" />

          {/* Mark. The SVG's fill is a baked #7851A9, not currentColor, which
              reads muted at this scale on #0d0020 — hence the brightness lift
              on top of the scaled-up house glow. */}
          <div className="absolute inset-0 grid place-items-center">
            <div className="relative grid place-items-center">
              {/* Staggered so a new ping leaves the mark every 600ms. The
                  delay has to be inline: `animate-sonar` emits the `animation`
                  shorthand, which resets any delay set by a utility class. */}
              {[0, 600, 1200].map((delay) => (
                <span
                  key={delay}
                  aria-hidden
                  style={{ animationDelay: `${delay}ms` }}
                  className="absolute size-32 rounded-full border border-grid-strong opacity-0 motion-safe:animate-sonar sm:size-40"
                />
              ))}
              <img
                src="/logo.svg"
                alt=""
                aria-hidden
                className="relative size-20 brightness-125 drop-shadow-[0_0_40px_rgba(178,119,211,0.55)] motion-safe:animate-logo-breathe sm:size-24"
              />
            </div>
          </div>

          {/* Word + hairline, pinned to the bottom edge. */}
          <div className="absolute inset-x-0 bottom-0">
            <p
              aria-hidden
              className="mb-5 text-center text-xs font-semibold uppercase tracking-[0.18em] text-brand"
            >
              {WORD.split("").map((letter, i) => (
                <span
                  key={i}
                  className="inline-block motion-safe:animate-letter-pop"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  {letter}
                </span>
              ))}
            </p>

            <div aria-hidden className="h-px w-full bg-line">
              <div
                ref={barRef}
                style={{ width: "0%" }}
                className="h-px bg-gradient-to-r from-pj-primary via-pj-secondary to-glow shadow-[0_0_12px_2px_rgba(178,119,211,0.55)]"
              />
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}

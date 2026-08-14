"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
// Static config only: the founding year in the badge. Contact details are not
// used here, so this does not need the CMS-backed config.
import { SITE } from "@/content/site";

import { Container } from "@/components/layout/Container";
import {
  HeroShowcase,
  type ShowcaseItem,
} from "@/components/sections/HeroShowcase";
import { GridField, FrameMarks, Hatch } from "@/components/visual/Decor";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero({
  showcase,
  initialIndex = 0,
}: {
  showcase: ShowcaseItem[];
  initialIndex?: number;
}) {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  };
  const item: Variants = {
    hidden: reduce ? {} : { opacity: 0, y: 22, filter: "blur(8px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: EASE } },
  };

  return (
    // Transparent, not `bg-surface`: the homepage's aurora canvas is the
    // ground here, and a fill would paint straight over it.
    <section className="relative isolate overflow-hidden">
      {/* blueprint grid + hatch + corner crosshairs, behind the glow */}
      <GridField fade="edges" />
      <Hatch />
      <FrameMarks variant="plus" />
      {/* The two drifting blooms that used to sit here are gone: the page's
          aurora canvas now supplies the ambient violet, and stacking both
          washed the black out of the ground entirely. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </div>

      <Container className="relative pb-20 pt-32 sm:pt-36">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mx-auto max-w-3xl text-center"
        >
          <motion.p
            variants={item}
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel px-2.5 py-1 text-[0.62rem] font-medium text-ink-muted backdrop-blur-sm sm:gap-2 sm:px-3.5 sm:py-1.5 sm:text-xs"
          >
            <span className="size-1 shrink-0 rounded-full bg-pj-secondary sm:size-1.5" />
            Legally registered PLC · Est. {SITE.registration.foundingYear} ·
            Bishoftu, Ethiopia
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-6 text-balance font-display text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.035em] text-ink sm:text-6xl lg:text-[4.2rem]"
          >
            Great software,{" "}
            <span className="text-brand">built to last.</span>
          </motion.h1>

          {/* The headline is deliberately about tone, which left nothing above
              the fold saying what the company actually sells — the h1 is the
              strongest on-page signal there is and it named neither the work
              nor the country. This carries that, so the line above does not
              have to. */}
          <motion.p
            variants={item}
            className="mx-auto mt-5 max-w-2xl text-balance text-base text-ink-muted sm:text-lg"
          >
            A legally registered Ethiopian software company building websites,
            online stores and custom tools for businesses worldwide.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-7 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-primary py-2.5 pl-5 pr-2.5 text-sm font-medium text-primary-foreground shadow-[0_16px_44px_-12px_rgba(178,119,211,0.95)] transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98] sm:py-3.5 sm:pl-6 sm:pr-3 sm:text-base"
            >
              Start a project
              <span className="grid size-6 place-items-center rounded-full bg-white/15 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:size-8">
                <ArrowUpRight className="size-3.5 sm:size-4" strokeWidth={2} />
              </span>
            </Link>
            <Link
              href="/works"
              className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-panel px-5 py-2.5 text-sm font-medium text-ink backdrop-blur-sm transition-colors duration-200 hover:bg-panel-strong sm:px-6 sm:py-3.5 sm:text-base"
            >
              See our work
            </Link>
          </motion.div>
          <motion.p
            variants={item}
            className="mt-3 text-[0.66rem] text-ink-muted/80 sm:mt-4 sm:text-sm"
          >
            Free discovery call · no upfront payment · you own everything.
          </motion.p>
        </motion.div>

        {/* Auto-rotating deck: the dots under it jump to a card by hand */}
        <HeroShowcase projects={showcase} initialIndex={initialIndex} />
      </Container>
    </section>
  );
}

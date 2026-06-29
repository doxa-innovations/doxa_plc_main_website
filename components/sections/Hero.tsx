"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { SITE } from "@/content/site";
import { getProjectBySlug } from "@/content/projects";
import { Container } from "@/components/layout/Container";
import { HeroShowcase } from "@/components/sections/HeroShowcase";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  // Carousel order: [left, center, right] with KLA starting in the center.
  // Add more slugs here and the deck cycles through all of them.
  const showcase = [
    getProjectBySlug("lce-church"),
    getProjectBySlug("kla-construction-equipment"),
    getProjectBySlug("doxa-ledger"),
  ].filter((p): p is NonNullable<typeof p> => Boolean(p));

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  };
  const item: Variants = {
    hidden: reduce ? {} : { opacity: 0, y: 22, filter: "blur(8px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: EASE } },
  };

  return (
    <section className="relative overflow-hidden bg-surface">
      {/* glow field */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-0 size-[40rem] rounded-full bg-pj-primary/25 blur-[130px] animate-blob" />
        <div className="absolute -right-24 top-24 size-[34rem] rounded-full bg-pj-secondary/20 blur-[130px] animate-blob [animation-delay:4s]" />
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
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-ink-muted backdrop-blur-sm"
          >
            <span className="size-1.5 rounded-full bg-pj-secondary" />
            Legally registered PLC · Est. {SITE.registration.foundingYear} ·
            Bishoftu, Ethiopia
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-6 text-balance font-display text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.035em] text-ink sm:text-6xl lg:text-[4.2rem]"
          >
            Great software,{" "}
            <span className="text-pj-secondary">built affordably.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-xl text-pretty text-lg text-ink-muted"
          >
            We&apos;re a legally registered Ethiopian software studio building
            websites, e-commerce, and custom products for businesses worldwide.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-9 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-primary py-3.5 pl-6 pr-3 text-base font-medium text-primary-foreground shadow-[0_16px_44px_-12px_rgba(178,119,211,0.95)] transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98]"
            >
              Start a project
              <span className="grid size-8 place-items-center rounded-full bg-white/15 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight className="size-4" strokeWidth={2} />
              </span>
            </Link>
            <Link
              href="/works"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3.5 text-base font-medium text-ink backdrop-blur-sm transition-colors duration-200 hover:bg-white/[0.09]"
            >
              See our work
            </Link>
          </motion.div>
          <motion.p variants={item} className="mt-4 text-sm text-ink-muted/80">
            Free discovery call · no upfront payment · you own everything.
          </motion.p>
        </motion.div>

        {/* Auto-rotating deck: hover any card to slide it to the front */}
        <HeroShowcase projects={showcase} initialIndex={1} />
      </Container>
    </section>
  );
}

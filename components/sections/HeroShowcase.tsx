"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
/**
 * The deck only ever draws a screenshot in a browser frame, so it asks for
 * exactly that rather than a whole Project. A Project satisfies this shape
 * structurally, so CMS-backed entries still pass straight through — and a
 * screenshot with no case study behind it can be listed without inventing
 * one.
 */
export interface ShowcaseItem {
  slug: string;
  client: string;
  title: string;
  coverImage: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;
const ROTATE_MS = 3800;

/**
 * Resting transform for a card given its position relative to the active one.
 * Card size is fixed (center 1000px, sides 800px), so depth here comes purely
 * from horizontal offset, rotation, vertical drop and opacity. x offsets are a
 * percentage of the card's own width so they track the responsive vw cap.
 */
function variantFor(off: number) {
  const a = Math.abs(off);
  if (off === 0) return { x: "0%", y: 0, rotate: 0, opacity: 1 };
  if (a === 1)
    return {
      x: off < 0 ? "-48%" : "48%",
      y: 22,
      rotate: off < 0 ? -6 : 6,
      opacity: 1,
    };
  if (a === 2)
    return {
      x: off < 0 ? "-90%" : "90%",
      y: 42,
      rotate: off < 0 ? -11 : 11,
      opacity: 0.55,
    };
  // Beyond the visible window: hidden, ready to rotate in.
  return {
    x: off < 0 ? "-122%" : "122%",
    y: 50,
    rotate: off < 0 ? -14 : 14,
    opacity: 0,
  };
}

/**
 * Mobile resting transform by stack depth (0 = front). Cards are centered
 * (no horizontal fan) and stack downward; the back-most card is hidden just
 * below, ready to rise up into the front spot. The motion is purely vertical.
 */
function mobileVariant(d: number) {
  if (d === 0) return { x: "0%", y: 0, rotate: 0, scale: 1, opacity: 1 };
  if (d === 1) return { x: "0%", y: 16, rotate: 0, scale: 0.95, opacity: 1 };
  if (d === 2) return { x: "0%", y: 30, rotate: 0, scale: 0.9, opacity: 0.8 };
  if (d === 3) return { x: "0%", y: 42, rotate: 0, scale: 0.86, opacity: 0.4 };
  // Back of the stack: parked just below, hidden, ready to sweep up to front.
  return { x: "0%", y: 56, rotate: 0, scale: 0.82, opacity: 0 };
}

function CardFrame({
  project,
  priority,
}: {
  project: ShowcaseItem;
  priority: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-deep shadow-[0_50px_120px_-40px_rgba(124,60,180,0.9)]">
      <div className="flex items-center gap-1.5 border-b border-line bg-panel px-3 py-2.5">
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
      </div>
      <div className="relative aspect-[16/10]">
        <Image
          src={project.coverImage}
          alt={`${project.client}, ${project.title}`}
          fill
          sizes="(max-width:1024px) 90vw, 640px"
          className="object-cover"
          priority={priority}
        />
      </div>
    </div>
  );
}

/**
 * Auto-rotating "deck of cards" showcase. The cards continuously cycle which
 * project sits in the center (front). Works for any number of projects (up to
 * five are visible at a time, center plus two a side).
 */
export function HeroShowcase({
  projects,
  initialIndex = 0,
}: {
  projects: ShowcaseItem[];
  initialIndex?: number;
}) {
  const reduce = useReducedMotion();
  const n = projects.length;
  const [active, setActive] = useState(initialIndex);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile uses a centered vertical card-stack instead of the horizontal fan.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Desktop cycles forward (fan slides sideways); mobile cycles backward so the
  // card at the back of the stack is the one that rises up to the front.
  const dir = isMobile ? -1 : 1;

  useEffect(() => {
    if (reduce || n < 2) return;
    const id = setInterval(
      () => setActive((a) => (a + dir + n) % n),
      ROTATE_MS,
    );
    return () => clearInterval(id);
  }, [reduce, n, dir]);

  // Signed offset of card i from the active one, wrapped to the nearest side.
  function rel(i: number) {
    let d = ((i - active) % n + n) % n;
    if (d > n / 2) d -= n;
    return d;
  }

  // Reduced motion: a single static centered card, no rotation.
  if (reduce) {
    return (
      <div className="relative mx-auto mt-10 flex h-[18rem] w-full items-center justify-center sm:mt-16 sm:h-[20rem] md:h-[22rem] lg:h-[24rem]">
        <div className="w-[86vw] max-w-[22rem] sm:w-[500px] sm:max-w-[90vw]">
          <CardFrame project={projects[active]} priority />
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto mt-10 h-[18rem] w-full sm:mt-16 sm:h-[20rem] md:h-[22rem] lg:h-[24rem]">
      {projects.map((project, i) => {
        // Mobile: centered vertical stack, depth 0 = front.
        if (isMobile) {
          const d = (i - active + n) % n;
          const v = mobileVariant(d);
          return (
            <div
              key={project.slug}
              className="absolute inset-0 flex items-center justify-center"
              style={{ zIndex: n - d }}
            >
              <motion.div
                className="w-[86vw] max-w-[22rem] will-change-transform"
                animate={v}
                transition={{ duration: 0.55, ease: EASE }}
              >
                <CardFrame project={project} priority={d === 0} />
              </motion.div>
            </div>
          );
        }

        // Desktop: horizontal fan.
        const off = rel(i);
        const v = variantFor(off);
        return (
          <div
            key={project.slug}
            className="absolute inset-0 flex items-center justify-center"
            style={{ zIndex: off === 0 ? 30 : 30 - Math.abs(off) * 4 }}
          >
            <motion.div
              className={`will-change-transform ${
                off === 0 ? "w-[500px] max-w-[90vw]" : "w-[400px] max-w-[72vw]"
              }`}
              animate={v}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <CardFrame project={project} priority={off === 0} />
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

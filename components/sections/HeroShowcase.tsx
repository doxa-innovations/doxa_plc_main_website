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
  /** The card at the front of the deck — the LCP candidate. */
  priority?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-deep shadow-[0_50px_120px_-40px_rgba(124,60,180,0.9)]">
      <div className="flex items-center gap-1.5 border-b border-line bg-panel px-3 py-2.5">
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
      </div>
      <div className="relative aspect-[16/10]">
        {/* `fetchPriority` + `loading`, NOT `priority`.

            This image is the measured LCP element, and `priority` (deprecated
            in Next 16 in favour of `preload`) emitted a preload <link> with no
            fetchpriority on it at all — which is precisely what Lighthouse
            reports as "fetchpriority=high should be applied to the image
            preload request".

            The docs also steer away from preload when several images could be
            the LCP depending on viewport, which is exactly this deck: mobile
            renders a vertical stack and desktop a horizontal fan, each with a
            different card in front. Marking the front card high-priority lets
            the browser pick, rather than preloading a card that may not be
            the one on screen. */}
        <Image
          src={project.coverImage}
          alt={`${project.client}, ${project.title}`}
          fill
          sizes="(max-width:1024px) 90vw, 640px"
          className="object-cover"
          fetchPriority={priority ? "high" : "auto"}
          loading={priority ? "eager" : "lazy"}
        />
      </div>
    </div>
  );
}

/**
 * Manual control for the deck: one dot per project, the active one stretched
 * into a pill. The hit area is the padded button, not the 6px dot, so it stays
 * tappable on a phone.
 */
function Dots({
  projects,
  active,
  onSelect,
}: {
  projects: ShowcaseItem[];
  active: number;
  onSelect: (i: number) => void;
}) {
  if (projects.length < 2) return null;
  return (
    <div className="mt-8 flex items-center justify-center gap-1 sm:mt-6">
      {projects.map((project, i) => (
        <button
          key={project.slug}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`Show ${project.client}, ${project.title}`}
          aria-current={i === active}
          // p-2.5 around a 6px dot is what carries the button past the 24px
          // minimum tap target; the dot itself is deliberately smaller.
          className="group grid cursor-pointer place-items-center rounded-full p-2.5 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand"
        >
          <span
            className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              i === active
                ? "w-6 bg-brand"
                : "w-1.5 bg-white/25 group-hover:bg-white/50"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

/**
 * Auto-rotating "deck of cards" showcase. The cards continuously cycle which
 * project sits in the center (front), and the dots underneath jump straight to
 * one. Works for any number of projects (up to five are visible at a time,
 * center plus two a side).
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
  // Bumped on every dot press. It is a dependency of the rotate effect purely
  // so the interval restarts: without it a click made a quarter-second before
  // the tick would flick straight past the card the visitor just chose.
  const [picks, setPicks] = useState(0);

  function goTo(i: number) {
    setActive(i);
    setPicks((p) => p + 1);
  }

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
  }, [reduce, n, dir, picks]);

  // Signed offset of card i from the active one, wrapped to the nearest side.
  function rel(i: number) {
    let d = ((i - active) % n + n) % n;
    if (d > n / 2) d -= n;
    return d;
  }

  // Reduced motion: a single static centered card. Nothing rotates on its own,
  // which makes the dots the only way through the deck rather than a shortcut.
  if (reduce) {
    return (
      <div className="mt-10 sm:mt-16">
        <div className="relative mx-auto flex h-[18rem] w-full items-center justify-center sm:h-[20rem] md:h-[22rem] lg:h-[24rem]">
          <div className="w-[86vw] max-w-[22rem] sm:w-[500px] sm:max-w-[90vw]">
            <CardFrame project={projects[active]} priority />
          </div>
        </div>
        <Dots projects={projects} active={active} onSelect={goTo} />
      </div>
    );
  }

  return (
    <div className="mt-10 sm:mt-16">
      <div className="relative mx-auto h-[18rem] w-full sm:h-[20rem] md:h-[22rem] lg:h-[24rem]">
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
                  off === 0
                    ? "w-[500px] max-w-[90vw]"
                    : "w-[400px] max-w-[72vw]"
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
      <Dots projects={projects} active={active} onSelect={goTo} />
    </div>
  );
}

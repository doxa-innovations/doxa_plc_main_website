"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

import type { Testimonial } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * Testimonials as a deck, built on the same idea as the hero showcase: one
 * card is active in the centre, its neighbours sit behind and to the sides,
 * and arrows step through them.
 *
 * This replaced a continuous marquee. Two things were wrong with that: a row
 * that never stops moving cannot be read (you are always partway through a
 * sentence that is sliding away), and the cards were sliced flat at the
 * container edge. Here nothing is clipped — the neighbours simply fade out as
 * they travel, so the edges dissolve instead of cutting.
 *
 * Timing is deliberately slow. These are paragraphs, not logos: ROTATE_MS is
 * roughly the time it takes to read one, and any interaction resets it so the
 * card you just chose is not whipped away half a second later.
 */

const EASE = [0.16, 1, 0.3, 1] as const;
const ROTATE_MS = 7000;

/**
 * Resting transform for a card, by its signed distance from the active one.
 *
 * The active card is full size and fully opaque; its neighbours are stepped
 * down in scale and opacity so the eye is told, without a label, which one it
 * is meant to be reading. Anything further out is parked at zero opacity ready
 * to come round.
 */
function variantFor(off: number) {
  const a = Math.abs(off);
  if (off === 0) return { x: "0%", scale: 1, opacity: 1 };
  // x is a percentage of the card's OWN width. At 96% and 0.86 scale the
  // neighbour's inner edge lands just past the active card's outer edge, so it
  // reads as the next card waiting rather than as text printed over this one.
  // Anything closer and two paragraphs overlap, which is what the first
  // attempt got wrong.
  if (a === 1)
    return { x: off < 0 ? "-96%" : "96%", scale: 0.86, opacity: 0.35 };
  if (a === 2)
    return { x: off < 0 ? "-168%" : "168%", scale: 0.8, opacity: 0.1 };
  return { x: off < 0 ? "-190%" : "190%", scale: 0.78, opacity: 0 };
}

/** "May 2026", or an empty string when no date was recorded. */
function monthYear(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * "Marit de Vries" → "MV". First and LAST word, not the first two: taking the
 * first two renders a surname with a particle in it as "MD".
 */
function initials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "";
  return (first + last).toUpperCase();
}

function Stars({ rating }: { rating: number }) {
  return (
    <div
      className="flex items-center gap-1"
      role="img"
      aria-label={`Rated ${rating} out of 5`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "size-4",
            i < rating
              ? "fill-pj-secondary text-pj-secondary"
              : "text-line-strong",
          )}
          strokeWidth={1.5}
          aria-hidden
        />
      ))}
    </div>
  );
}

function Card({
  testimonial,
  active,
}: {
  testimonial: Testimonial;
  active: boolean;
}) {
  const when = monthYear(testimonial.date);
  const meta = [testimonial.role, when].filter(Boolean).join(" · ");

  return (
    <figure
      className={cn(
        "flex h-full flex-col rounded-[1.4rem] border bg-panel p-6 transition-colors duration-500 sm:p-8",
        active
          ? "border-line-strong shadow-[0_40px_90px_-50px_rgba(124,60,180,0.7)]"
          : "border-line",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <Stars rating={testimonial.rating} />
        <Quote className="size-5 shrink-0 text-brand/40" strokeWidth={1.5} aria-hidden />
      </div>

      <blockquote className="mt-5 flex-1 text-pretty text-base leading-relaxed text-ink-muted sm:text-lg">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
        {testimonial.photo ? (
          <img
            src={testimonial.photo}
            alt=""
            loading="lazy"
            className="size-11 shrink-0 rounded-full border border-line object-cover"
          />
        ) : (
          <span
            aria-hidden
            className="grid size-11 shrink-0 place-items-center rounded-full border border-line bg-pj-primary/15 text-xs font-semibold text-brand"
          >
            {initials(testimonial.name)}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">
            {testimonial.name}
          </p>
          {meta && <p className="truncate text-xs text-ink-muted">{meta}</p>}
        </div>
      </figcaption>
    </figure>
  );
}

export function TestimonialCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const reduce = useReducedMotion();
  const n = testimonials.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  // Bumped on every manual move. It is a dependency of the rotate effect only
  // so the interval restarts: without it, pressing next a moment before the
  // tick would jump two cards at once.
  const [picks, setPicks] = useState(0);

  function goTo(i: number) {
    setActive(((i % n) + n) % n);
    setPicks((p) => p + 1);
  }

  useEffect(() => {
    if (reduce || paused || n < 2) return;
    const id = setInterval(() => setActive((a) => (a + 1) % n), ROTATE_MS);
    return () => clearInterval(id);
  }, [reduce, paused, n, picks]);

  // Signed offset of card i from the active one, wrapped to the nearest side,
  // so a deck of five never travels the long way round.
  function rel(i: number) {
    let d = (((i - active) % n) + n) % n;
    if (d > n / 2) d -= n;
    return d;
  }

  const controls = (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => goTo(active - 1)}
        aria-label="Previous testimonial"
        className="grid size-10 place-items-center rounded-full border border-line bg-panel text-ink-muted transition-colors hover:border-line-strong hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <ChevronLeft className="size-4" strokeWidth={2} aria-hidden />
      </button>

      {/* Dots double as the position indicator the row was missing — the
          "where am I in this list" job a scrollbar would have done. */}
      <div className="flex items-center gap-1">
        {testimonials.map((t, i) => (
          <button
            key={t.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Show the testimonial from ${t.name}`}
            aria-current={i === active}
            className="group grid cursor-pointer place-items-center rounded-full p-2.5 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand"
          >
            <span
              className={cn(
                "h-1.5 rounded-full transition-[width,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                i === active
                  ? "w-6 bg-brand"
                  : "w-1.5 bg-white/25 group-hover:bg-white/50",
              )}
            />
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => goTo(active + 1)}
        aria-label="Next testimonial"
        className="grid size-10 place-items-center rounded-full border border-line bg-panel text-ink-muted transition-colors hover:border-line-strong hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <ChevronRight className="size-4" strokeWidth={2} aria-hidden />
      </button>
    </div>
  );

  /**
   * Reduced motion: one card, no deck, no rotation. The controls become the
   * only way through, which is the point — nothing moves unless asked.
   */
  if (reduce) {
    return (
      <div>
        <div className="mx-auto w-full max-w-2xl">
          <Card testimonial={testimonials[active]} active />
        </div>
        {n > 1 && controls}
      </div>
    );
  }

  return (
    <div
      // Hover and focus pause the rotation for the same reason the marquee
      // did: a paragraph that moves while you are reading it is unreadable.
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        // Fixed height, so the deck does not jolt taller and shorter as
        // quotes of different lengths take the centre. Sized to the longest
        // quote at the narrowest column, which is the mobile case.
        className="relative h-[25rem] overflow-hidden sm:h-[20rem]"
        /**
         * The edge fade, and the reason it is an INLINE style.
         *
         * This started life as a Tailwind arbitrary value,
         * `[mask-image:linear-gradient(...,black_calc(100%-6rem),...)]`.
         * Tailwind turns underscores into spaces but leaves everything else
         * alone, so it emitted `calc(100%-6rem)` — which is not valid CSS,
         * because calc needs whitespace around the minus. The browser threw
         * the whole declaration away, there was no mask at all, and the cards
         * were sliced flat at the container edge. Written here it is plain
         * CSS that cannot be mangled.
         *
         * `overflow-hidden` is what stops the fanned-out neighbours widening
         * the page; the mask is what stops that clip being a knife edge.
         */
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0, black 14%, black 86%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0, black 14%, black 86%, transparent 100%)",
        }}
        // Arrow keys move the deck when it has focus, which is what a
        // keyboard user expects of anything with next/previous controls.
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            goTo(active - 1);
          }
          if (e.key === "ArrowRight") {
            e.preventDefault();
            goTo(active + 1);
          }
        }}
      >
        {testimonials.map((testimonial, i) => {
          const off = rel(i);
          const isActive = off === 0;
          return (
            <div
              key={testimonial.id}
              className="absolute inset-0 flex items-center justify-center"
              style={{ zIndex: 30 - Math.abs(off) * 4 }}
              // Only the card being read is exposed. Without this a screen
              // reader walks all five, including the ones drawn at 12% opacity.
              aria-hidden={!isActive}
              // …and the same for the keyboard: a control inside a card nobody
              // can see must not be a tab stop.
              inert={!isActive}
            >
              <motion.div
                // `w-full max-w-[34rem]`, not `w-[min(88vw,34rem)]`: Tailwind
                // generated no rule at all for that arbitrary min(), so the
                // card silently stretched to the full deck width and the fan
                // collapsed into one slab. Two ordinary utilities cannot fail
                // that way.
                className="h-full w-full max-w-[34rem] will-change-transform"
                animate={variantFor(off)}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <Card testimonial={testimonial} active={isActive} />
              </motion.div>
            </div>
          );
        })}
      </div>

      {n > 1 && controls}
    </div>
  );
}

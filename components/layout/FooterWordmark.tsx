"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const LETTERS = ["D", "O", "X", "A"];

/**
 * The oversized "DOXA" at the foot of every page.
 *
 * As the footer scrolls into view the letters rise out of the bottom edge one
 * after another, tied to the scroll position, so the word settles into place
 * exactly as the visitor reaches the end of the page. The wrapper's
 * `overflow-hidden` is what makes them appear to come up from below the fold.
 *
 * Each letter carries the gradient itself: `bg-clip-text` only clips to the
 * text of the element that owns the background, so on a parent it would stop
 * working once the letters are transformed independently.
 *
 * Nothing starts hidden on the server, and with reduced motion the word simply
 * sits in place.
 */
export function FooterWordmark() {
  const root = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-letter]", {
          yPercent: 70,
          ease: "none",
          stagger: 0.18,
          scrollTrigger: {
            trigger: root.current,
            // Starts only once the top of the word is on screen, so the rise
            // is seen rather than finished out of view, and runs to the very
            // end of the page. The wrapper hangs below the document's last
            // pixel (its negative bottom margin), so "bottom bottom" would
            // never be reached and the last letters would stop part-way up.
            // The higher scrub value lets the letters trail the scroll.
            start: "top 92%",
            end: "max",
            scrub: 1.4,
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      aria-hidden
      className="pointer-events-none relative -mb-[4vw] select-none overflow-hidden"
    >
      {/* Opaque vertical gradient clipped to the glyphs, so the letters cover
          the ring lines while keeping the fade. Its colours are theme tokens
          (globals.css): deep violet on light, near-black violet on dark. */}
      <p className="text-center font-display text-[26vw] font-semibold leading-[0.8] tracking-[-0.04em]">
        {LETTERS.map((letter, i) => (
          <span
            key={i}
            data-letter
            className="inline-block bg-gradient-to-b from-(--wordmark-from) to-(--wordmark-to) bg-clip-text text-transparent will-change-transform"
          >
            {letter}
          </span>
        ))}
      </p>
    </div>
  );
}

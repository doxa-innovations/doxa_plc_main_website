"use client";

import { useEffect, useRef } from "react";

/**
 * Which way the page last moved, as a REF rather than state.
 *
 * Deliberately not `useState`: a state update per scroll event re-renders every
 * consumer on every frame of a scroll, and this value is only ever read at the
 * instant an intersection observer fires. A ref costs one assignment and zero
 * renders.
 */
export function useScrollDirection() {
  const direction = useRef<"down" | "up">("down");

  useEffect(() => {
    let last = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      // Sub-pixel events and the rubber-band bounce at either end of the
      // document report a direction that the visitor never actually asked for.
      if (Math.abs(y - last) < 1) return;
      direction.current = y > last ? "down" : "up";
      last = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return direction;
}

"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  applyTheme,
  currentTheme,
  nextSwitch,
  scheduledTheme,
  storedTheme,
  storeTheme,
  type Theme,
} from "@/lib/theme";

gsap.registerPlugin(useGSAP);

/** Knob centre, in the switch's 64×32 viewBox, for each theme. */
const KNOB_X = { light: 16, dark: 48 };

/**
 * The light/dark switch in the footer.
 *
 * It shows the mode a click takes you TO: a moon and night sky while the
 * site is light, a sun while it is dark, with the label to match.
 *
 * One paused GSAP timeline holds the whole change, the sun at progress 0 and
 * the moon at 1, so a click just plays it forwards or backwards and a second
 * click mid-way reverses from wherever it is instead of jumping. The knob
 * slides across, the sun's rays spin away, a shadow slides over the sun to
 * carve the crescent moon, and the night sky's stars come out.
 *
 * The page itself changes behind a circle that grows out of the switch (View
 * Transitions; browsers without it, and visitors who prefer reduced motion,
 * get the new colours at once).
 *
 * It also keeps the page on the clock while it is open: if the visitor has
 * not picked a theme, the site turns dark at 16:00 and light at 05:00 without
 * a reload. See lib/theme.ts for the rules.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const root = useRef<HTMLButtonElement | null>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  /** The theme the switch is showing or animating towards. */
  const shown = useRef<Theme | null>(null);
  const [theme, setTheme] = useState<Theme>("light");
  const maskId = `theme-moon-${useId().replace(/:/g, "")}`;

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: "power3.inOut" } })
        .to(
          q("[data-knob]"),
          { x: KNOB_X.dark - KNOB_X.light, duration: 0.55 },
          0,
        )
        .to(q("[data-track]"), { attr: { fill: "#19003a" }, duration: 0.55 }, 0)
        .to(
          q("[data-knob-face]"),
          { attr: { fill: "#2a1458" }, duration: 0.55 },
          0,
        )
        .to(
          q("[data-rays]"),
          {
            rotation: 120,
            scale: 0.3,
            opacity: 0,
            transformOrigin: "50% 50%",
            duration: 0.35,
            ease: "power2.in",
          },
          0,
        )
        .to(
          q("[data-core]"),
          { attr: { r: 6.4, fill: "#e0c3ff" }, duration: 0.4 },
          0.08,
        )
        .to(
          q("[data-shadow]"),
          { attr: { cx: 3.4, cy: -3.4 }, duration: 0.4, ease: "power3.out" },
          0.18,
        )
        .fromTo(
          q("[data-star]"),
          { opacity: 0, scale: 0.2, transformOrigin: "50% 50%" },
          {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            stagger: 0.07,
            ease: "back.out(2)",
          },
          0.28,
        );

      const now = currentTheme();
      shown.current = now;
      setTheme(now);
      tl.current.progress(now === "light" ? 1 : 0);
      applyTheme(now); // brings the browser's top-bar colour in line
    },
    { scope: root },
  );

  /**
   * Moves the switch to `next`, animated unless reduced motion is on. Safe to
   * call repeatedly: it does nothing if the switch is already headed there.
   */
  const showSwitch = useCallback((next: Theme) => {
    const t = tl.current;
    if (!t || shown.current === next) return;
    shown.current = next;
    setTheme(next);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      t.pause().progress(next === "light" ? 1 : 0);
    } else if (next === "light") {
      t.play();
    } else {
      t.reverse();
    }
  }, []);

  // Follow the clock while the page is open, unless the visitor has picked.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const sync = () => {
      const want = storedTheme() ?? scheduledTheme();
      if (want !== currentTheme()) applyTheme(want);
      clearTimeout(timer);
      // +1s so the check lands just after the hour, not a hair before it.
      timer = setTimeout(sync, nextSwitch().getTime() - Date.now() + 1000);
    };

    const onVisible = () => {
      if (document.visibilityState === "visible") sync();
    };

    // The switch shows whatever theme the page is actually in, whoever set
    // it (the clock, this switch, or a page left open across a deploy), so
    // the two can never disagree.
    const observer = new MutationObserver(() => showSwitch(currentTheme()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    showSwitch(currentTheme());

    sync();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [showSwitch]);

  const toggle = () => {
    const next: Theme = currentTheme() === "dark" ? "light" : "dark";
    storeTheme(next);
    showSwitch(next);

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce || typeof document.startViewTransition !== "function") {
      applyTheme(next);
      return;
    }

    // Grow the new theme out of the switch until it covers the far corner.
    const box = root.current!.getBoundingClientRect();
    const x = box.left + box.width / 2;
    const y = box.top + box.height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = document.startViewTransition(() => applyTheme(next));
    transition.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 750,
            easing: "cubic-bezier(0.77, 0, 0.175, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      })
      .catch(() => {
        // Skipped (another transition started, tab hidden): the theme is
        // already applied by the callback, so there is nothing to recover.
      });
  };

  const target = theme === "dark" ? "Light mode" : "Dark mode";

  return (
    <button
      ref={root}
      type="button"
      aria-label={`Switch to ${target.toLowerCase()}`}
      onClick={toggle}
      className={
        "group inline-flex items-center gap-3 rounded-full py-1.5 text-xs text-ink-muted transition-colors duration-200 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-secondary " +
        (className ?? "")
      }
    >
      <span aria-hidden>{target}</span>
      <svg
        aria-hidden
        viewBox="0 0 64 32"
        className="h-8 w-16 shrink-0 transition-transform duration-150 ease-out group-active:scale-[0.96]"
      >
        <defs>
          {/* The moon is the sun's disc with a second disc of knob colour
              slid over it. As a mask, so the knob's own fill shows through
              the bite whatever colour it is at that moment. */}
          <mask
            id={maskId}
            maskUnits="userSpaceOnUse"
            x="-12"
            y="-12"
            width="24"
            height="24"
          >
            <rect x="-12" y="-12" width="24" height="24" fill="white" />
            <circle data-shadow cx="13" cy="-13" r="5.4" fill="black" />
          </mask>
        </defs>

        <rect
          data-track
          x="0.5"
          y="0.5"
          width="63"
          height="31"
          rx="15.5"
          fill="#efe8fb"
          stroke="var(--line-strong)"
        />

        {/* Night sky, on the side the knob leaves */}
        <g fill="#e0c3ff">
          {[
            [12, 11, 1.7],
            [22, 19, 1.2],
            [11, 22, 0.9],
          ].map(([cx, cy, s], i) => (
            <path
              key={i}
              data-star
              opacity={0}
              d={`M${cx} ${cy - s * 1.8}Q${cx} ${cy} ${cx + s * 1.8} ${cy}Q${cx} ${cy} ${cx} ${cy + s * 1.8}Q${cx} ${cy} ${cx - s * 1.8} ${cy}Q${cx} ${cy} ${cx} ${cy - s * 1.8}Z`}
            />
          ))}
        </g>

        {/* Static offset outside, GSAP's x inside: GSAP reads an existing
            transform attribute as its starting x, so they stay separate. */}
        <g transform={`translate(${KNOB_X.light} 16)`}>
          <g data-knob>
            <circle
              data-knob-face
              r="12"
              fill="#ffffff"
              stroke="rgba(25, 0, 58, 0.12)"
              strokeWidth="0.75"
            />
            <g
              data-rays
              stroke="#7851a9"
              strokeWidth="1.6"
              strokeLinecap="round"
            >
              {Array.from({ length: 8 }, (_, i) => {
                const a = (i * Math.PI) / 4;
                return (
                  <line
                    key={i}
                    x1={Math.cos(a) * 6.6}
                    y1={Math.sin(a) * 6.6}
                    x2={Math.cos(a) * 8.6}
                    y2={Math.sin(a) * 8.6}
                  />
                );
              })}
            </g>
            <circle data-core r="4.2" fill="#7851a9" mask={`url(#${maskId})`} />
          </g>
        </g>
      </svg>
    </button>
  );
}

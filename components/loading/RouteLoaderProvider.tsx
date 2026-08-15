"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { LoadingScreen, type LoaderState } from "./LoadingScreen";

/**
 * How long the curtain stays up on a CLICKED NAVIGATION once the destination
 * is ready. A deliberate beat: the destination is usually prefetched and
 * commits almost instantly, and a curtain that flashes for 80ms reads as a
 * glitch rather than a transition.
 */
const NAV_MIN_HOLD_MS = 2000;

/**
 * The floor for the BOOT curtain, and nothing more.
 *
 * This used to share NAV_MIN_HOLD_MS, which meant every first paint sat
 * behind the curtain until 2s after navigation start no matter how fast the
 * page actually arrived. It was the single largest performance cost on the
 * site: first contentful paint and largest contentful paint landed at the
 * same timestamp — the moment the curtain lifted — so Lighthouse measured the
 * timer, not the page. Speed Index followed it up to 2.3s.
 *
 * The boot curtain now lifts when the page is genuinely ready. This effect
 * runs on mount, i.e. once React has hydrated and the page is interactive,
 * so "ready" is simply "we got here". The floor only exists so a very fast
 * hydration does not show a 40ms flash of curtain.
 */
const BOOT_MIN_HOLD_MS = 250;

/** Backstop, so an abandoned navigation can never strand the curtain. */
const FAILSAFE_MS = 8000;

/** Ceiling the bar eases toward while still waiting — never 100%. */
const PENDING_CEILING = 0.9;

/**
 * Time constant for the bar's approach, derived from the navigation hold so
 * the two stay in step. Tuned to roughly half the hold: the bar is still
 * visibly travelling when the curtain lifts, rather than parking at the
 * ceiling and reading as stuck. Change NAV_MIN_HOLD_MS and this follows.
 */
const BAR_TAU_MS = NAV_MIN_HOLD_MS * 0.5;

type RouteLoaderContextValue = { start: () => void };

const RouteLoaderContext = createContext<RouteLoaderContextValue>({
  start: () => {},
});

/**
 * Opt a programmatic navigation into the curtain — e.g. a form that calls
 * `router.push()` on success. Link clicks are picked up automatically.
 */
export function useRouteLoader() {
  return useContext(RouteLoaderContext);
}

/**
 * Shows a branded curtain over public route changes.
 *
 * It observes navigation rather than intercepting it: the click listener
 * never calls preventDefault(), so next/link still owns prefetching, scroll
 * restoration and history. The curtain lifts when usePathname() reports the
 * new route has committed AND the minimum hold has elapsed — whichever is
 * later. That second condition is what makes it a real gate: every public
 * route here is static and prefetched, so commit is usually near-instant,
 * but a cold cache or slow network holds the curtain for as long as it takes.
 *
 * Back/forward deliberately does NOT trigger it (only clicks call start()).
 */
export function RouteLoaderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [state, setState] = useState<LoaderState>("boot");

  const barRef = useRef<HTMLDivElement | null>(null);
  const stateRef = useRef<LoaderState>("boot");
  const prevPath = useRef(pathname);
  const startedAt = useRef(0);
  const target = useRef(PENDING_CEILING);
  const value = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const failsafeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (failsafeTimer.current) clearTimeout(failsafeTimer.current);
    hideTimer.current = null;
    failsafeTimer.current = null;
  }, []);

  // stateRef mirrors `state` for the click handler and the pathname effect,
  // which both need the current value without re-subscribing. Kept in step
  // here rather than during render, where mutating a ref is not allowed.
  const transition = useCallback((next: LoaderState) => {
    stateRef.current = next;
    setState(next);
  }, []);

  const start = useCallback(() => {
    if (stateRef.current === "loading") return;
    clearTimers();
    startedAt.current = performance.now();
    value.current = 0;
    target.current = PENDING_CEILING;
    transition("loading");
    failsafeTimer.current = setTimeout(
      () => transition("idle"),
      FAILSAFE_MS,
    );
  }, [clearTimers, transition]);

  // Boot curtain. Reaching this effect means React has hydrated and the page
  // is interactive, so the curtain has already done its job and comes down.
  // `performance.now()` is milliseconds since navigation start, so on any
  // real-world load the floor has long since passed and `remaining` is 0 —
  // the curtain lifts on the same frame rather than waiting out a timer.
  useEffect(() => {
    target.current = 1;
    const remaining = Math.max(0, BOOT_MIN_HOLD_MS - performance.now());
    const timer = setTimeout(() => transition("idle"), remaining);
    return () => clearTimeout(timer);
  }, [transition]);

  // Commit signal. usePathname() updates in the same commit that renders the
  // new page, so reaching here means the destination is genuinely on screen.
  useEffect(() => {
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;
    if (stateRef.current !== "loading") return; // back/forward, or already idle

    clearTimers();
    target.current = 1;
    const elapsed = performance.now() - startedAt.current;
    hideTimer.current = setTimeout(
      () => transition("idle"),
      Math.max(0, NAV_MIN_HOLD_MS - elapsed),
    );
  }, [pathname, clearTimers, transition]);

  useEffect(() => clearTimers, [clearTimers]);

  // Progress. Written straight to the DOM so the bar runs at 60fps without
  // re-rendering the tree.
  useEffect(() => {
    if (state === "idle") return;

    let frame = 0;
    let last = 0;
    const tick = (now: number) => {
      // Exponential approach weighted by real elapsed time, so a 120Hz display
      // fills at the same rate as a 60Hz one.
      const dt = last ? Math.min(now - last, 100) : 16.7;
      last = now;
      const k = 1 - Math.exp(-dt / BAR_TAU_MS);
      value.current += (target.current - value.current) * k;
      if (barRef.current) {
        barRef.current.style.width = `${(value.current * 100).toFixed(2)}%`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [state]);

  // Lock scrolling and keep focus out of the covered page.
  useEffect(() => {
    const locked = state !== "idle";
    document.documentElement.classList.toggle("route-loading", locked);

    const main = document.querySelector("main");
    if (main) {
      if (locked) main.setAttribute("inert", "");
      else main.removeAttribute("inert");
    }

    return () => {
      document.documentElement.classList.remove("route-loading");
      document.querySelector("main")?.removeAttribute("inert");
    };
  }, [state]);

  // Capture phase so we see the click before next/link handles it. We never
  // preventDefault — the router still performs the navigation itself.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return; // new tab / new window / download
      }

      const anchor = (event.target as Element | null)?.closest?.<HTMLAnchorElement>(
        "a[href]",
      );
      if (!anchor) return;
      if (anchor.dataset.noTransition !== undefined) return;
      if (anchor.hasAttribute("download")) return;

      const anchorTarget = anchor.getAttribute("target");
      if (anchorTarget && anchorTarget !== "_self") return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      // Skips mailto:/tel: (opaque origin) and anything off-site.
      if (url.origin !== window.location.origin) return;
      // The admin panel has its own layout tree and is explicitly excluded.
      if (
        url.pathname.startsWith("/olympus") ||
        url.pathname.startsWith("/api")
      ) {
        return;
      }
      // In-page #hash links and links to the page you're already on.
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      ) {
        return;
      }

      start();
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [start]);

  return (
    <RouteLoaderContext.Provider value={{ start }}>
      {/* Rendered BEFORE children on purpose. Next streams the HTML, so markup
          placed after the page body arrives tens of kilobytes later — the
          browser paints the page, then drops the curtain over it, which is
          exactly backwards. Emitting it first puts it in the opening bytes of
          the stream. It is `position: fixed` at z-[90], so DOM order changes
          nothing about layout or stacking. */}
      <LoadingScreen state={state} barRef={barRef} />
      {children}
    </RouteLoaderContext.Provider>
  );
}

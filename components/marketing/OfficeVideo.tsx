"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useYouTubePlayer } from "./useYouTubePlayer";

function fmt(t: number) {
  if (!Number.isFinite(t) || t < 0) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const ctrlBtn =
  "grid size-9 place-items-center rounded-full border border-line bg-panel-strong text-ink transition-colors hover:border-pj-secondary/50 hover:bg-pj-secondary/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pj-secondary";

/**
 * Branded, fully custom player for the walkthrough clips.
 *
 * The video is hosted on YouTube and played through the IFrame Player API with
 * `controls: 0`, so none of this UI is YouTube's — the play button, scrubber,
 * mute and fullscreen below are ours, driving their player through
 * useYouTubePlayer. An iframe is the only supported way to play a YouTube
 * video; it is not the only way to LOOK like YouTube, and this does not.
 *
 * Nothing loads from Google until the visitor presses play. Until then the
 * stage is just a poster image, which is why `poster` matters: it is the whole
 * pre-click experience, not a decoration.
 *
 * Once started and scrolled out of view, the player re-docks to a floating
 * mini-player in the corner so playback continues while they browse. Floating
 * relies on `position: fixed`, so this must not sit under a transformed /
 * backdrop-filtered ancestor (it is rendered outside <Reveal>).
 *
 * Its Section also needs a z-index above the sections that follow it. `Section`
 * is `isolate`, which traps this component's z-[60] inside that one band — so
 * later bands painted over the floating player and swallowed its clicks the
 * moment you scrolled past the video.
 */
export function OfficeVideo({
  videoId,
  poster,
  title,
}: {
  /** YouTube video id, e.g. the `awuPRpS0Cqw` in a youtu.be link. */
  videoId: string;
  poster?: string;
  title: string;
}) {
  const playerRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);

  const {
    containerRef,
    activated,
    playing,
    muted,
    current,
    duration,
    activate,
    toggle,
    stop,
    toggleMute,
    seek,
  } = useYouTubePlayer(videoId);

  const [ratio, setRatio] = useState(1);
  const [dismissed, setDismissed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Float once the player has been started, the user hasn't dismissed it, and
  // the inline anchor has mostly scrolled off screen.
  const floating = activated && !dismissed && ratio < 0.25;

  // NO fallback to YouTube's own thumbnail (i.ytimg.com/vi/<id>/...), even
  // though it would look better than the panel below. That URL is a request to
  // Google on page load, for every visitor, which is exactly the thing the
  // facade exists to prevent — and /privacy now states in plain words that
  // nothing reaches Google until you press play. A prettier still is not worth
  // making the privacy policy false. Supply `poster` from our own CDN or
  // /public instead.

  useEffect(() => {
    const el = anchorRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setRatio(entry.intersectionRatio),
      { threshold: [0, 0.1, 0.25, 0.5, 0.6, 0.8, 1] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onFs = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const togglePlay = useCallback(() => {
    // Pressing play is the only thing that re-arms the mini player. The
    // observer used to clear `dismissed` whenever the anchor came back into
    // view, which meant closing it while ABOVE the video and then scrolling
    // down re-opened it on the way past — the close never held.
    if (!playing) setDismissed(false);
    toggle();
  }, [playing, toggle]);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void playerRef.current?.requestFullscreen?.();
  }, []);

  const returnToSection = useCallback(() => {
    anchorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const dismiss = useCallback(() => {
    if (playing) toggle();
    setDismissed(true);
  }, [playing, toggle]);

  return (
    <div ref={anchorRef} className="relative aspect-video w-full">
      {/* Reserved-space placeholder shown while the player floats in the corner */}
      {floating && (
        <div className="absolute inset-0 grid place-items-center rounded-[1.4rem] border border-dashed border-line-strong bg-panel p-6 text-center">
          <div className="flex flex-col items-center gap-3">
            <span className="grid size-12 place-items-center rounded-full border border-pj-secondary/40 bg-pj-primary/15 text-brand">
              <Play className="size-5 translate-x-0.5" aria-hidden />
            </span>
            <p className="text-sm font-medium text-ink">
              Playing in the corner
            </p>
            <button
              type="button"
              onClick={returnToSection}
              className="rounded-full border border-line-strong bg-panel px-4 py-1.5 text-xs font-medium text-ink transition-colors hover:border-pj-secondary/50 hover:bg-pj-secondary/15"
            >
              Bring it back here
            </button>
          </div>
        </div>
      )}

      <div
        ref={playerRef}
        className={cn(
          "group overflow-hidden bg-deep shadow-[0_40px_90px_-50px_rgba(124,60,180,0.8)]",
          floating
            // The consent banner publishes its height as --consent-banner-h
            // while it is open, so the dock lifts above it instead of hiding
            // underneath. The variable is absent otherwise and the fallback
            // gives the normal 1rem inset.
            ? "fixed bottom-[calc(1rem+var(--consent-banner-h,0px))] right-4 z-[60] aspect-video w-[22rem] max-w-[85vw] animate-[mini-pop_0.28s_cubic-bezier(0.16,1,0.3,1)] rounded-2xl border border-pj-secondary/40 ring-1 ring-pj-secondary/25 transition-[bottom] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            : "absolute inset-0 rounded-[1.4rem] border border-line",
        )}
      >
        {/* Before the first press this is a still image and nothing else — no
            iframe, no YouTube script, no request to Google at all. */}
        {!activated &&
          (poster ? (
            // Through next/image: the poster on the CDN is a full-size JPEG
            // (~182 KiB) for a frame drawn at most 1024px wide, and it is the
            // whole visual before the first press. `fill` because the stage
            // sizes itself, and the mini-player reuses the same element at a
            // fraction of the size.
            <Image
              src={poster}
              alt=""
              fill
              sizes="(max-width:768px) 100vw, 1024px"
              className="size-full object-cover"
              aria-hidden
            />
          ) : (
            // No poster supplied: a brand panel rather than a Google-hosted
            // still. Plainer, but it keeps the no-contact-before-click promise.
            <div
              aria-hidden
              className="size-full bg-[radial-gradient(60%_60%_at_50%_40%,rgba(124,60,180,0.35),transparent)]"
            />
          ))}

        {/* The API replaces this div with the iframe. `pointer-events-none` is
            what keeps the player ours: every click lands on our own controls
            above instead of YouTube's click-through to their watch page. */}
        <div className="pointer-events-none absolute inset-0">
          <div ref={containerRef} />
        </div>

        {/* Whole-stage click target, so clicking the picture toggles playback
            the way clicking a <video> used to. It sits BEFORE the control bar
            in the DOM, so the bar still takes its own clicks. */}
        <button
          type="button"
          onClick={activated ? togglePlay : activate}
          // Names the clip rather than saying "video". This button is the only
          // thing describing what is about to play — the poster is decorative
          // and the iframe is hidden from the tree.
          aria-label={
            playing
              ? `Pause ${title}`
              : current > 0
                ? `Resume ${title}`
                : `Play ${title}`
          }
          className={cn(
            "absolute inset-0 grid place-items-center transition-colors focus-visible:outline-none",
            playing ? "bg-transparent" : "bg-deep/30 hover:bg-deep/20",
          )}
        >
          {!playing && (
            <span
              className={cn(
                "grid place-items-center rounded-full bg-pj-primary text-white shadow-[0_18px_50px_-12px_rgba(120,81,169,0.95)] transition-transform duration-200 group-hover:scale-105",
                floating ? "size-12" : "size-16 sm:size-20",
              )}
            >
              <Play
                className={cn("translate-x-0.5", floating ? "size-5" : "size-7 sm:size-9")}
                fill="currentColor"
                aria-hidden
              />
            </span>
          )}
        </button>

        {/* Floating-only: return + close */}
        {floating && (
          <div className="absolute right-2 top-2 z-10 flex gap-1.5">
            <button
              type="button"
              onClick={returnToSection}
              aria-label="Expand back to the page"
              className="grid size-7 place-items-center rounded-full bg-deep/70 text-ink backdrop-blur-sm transition-colors hover:bg-deep/90 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pj-secondary"
            >
              <Maximize className="size-3.5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Close mini player"
              className="grid size-7 place-items-center rounded-full bg-deep/70 text-ink backdrop-blur-sm transition-colors hover:bg-deep/90 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pj-secondary"
            >
              <X className="size-3.5" aria-hidden />
            </button>
          </div>
        )}

        {/* Branded control bar */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 bg-gradient-to-t from-deep/95 via-deep/55 to-transparent px-3 pb-2.5 pt-10 transition-opacity duration-200",
            playing
              ? "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
              : "opacity-100",
          )}
        >
          <label className="sr-only" htmlFor="office-video-seek">
            Seek
          </label>
          <input
            id="office-video-seek"
            type="range"
            min={0}
            max={duration || 0}
            step={0.05}
            value={current}
            onChange={(e) => seek(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer rounded-full accent-pj-secondary"
            aria-label="Seek"
          />
          <div className="mt-2 flex items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? "Pause" : "Play"}
              className="grid size-9 place-items-center rounded-full bg-pj-primary text-white shadow-[0_10px_30px_-10px_rgba(120,81,169,0.9)] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pj-secondary"
            >
              {playing ? (
                <Pause className="size-4" fill="currentColor" aria-hidden />
              ) : (
                <Play className="size-4 translate-x-px" fill="currentColor" aria-hidden />
              )}
            </button>
            <button
              type="button"
              onClick={stop}
              aria-label="Stop"
              className={ctrlBtn}
            >
              <Square className="size-3.5" fill="currentColor" aria-hidden />
            </button>
            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
              className={ctrlBtn}
            >
              {muted ? (
                <VolumeX className="size-4" aria-hidden />
              ) : (
                <Volume2 className="size-4" aria-hidden />
              )}
            </button>
            <span className="ml-1 text-xs font-medium tabular-nums text-ink-muted">
              {fmt(current)} <span className="text-ink-muted/50">/</span>{" "}
              {fmt(duration)}
            </span>
            {!floating && (
              <button
                type="button"
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                className={cn(ctrlBtn, "ml-auto")}
              >
                {isFullscreen ? (
                  <Minimize className="size-4" aria-hidden />
                ) : (
                  <Maximize className="size-4" aria-hidden />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

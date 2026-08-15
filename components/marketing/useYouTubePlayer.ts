"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * The YouTube IFrame Player API, wrapped so a branded control bar can drive it
 * the same way it drove a <video> element.
 *
 * Why an iframe at all: YouTube exposes no supported way to read the media
 * stream directly, and pulling one out anyway breaks their terms and stops
 * working whenever they change the format. The iframe is the only legitimate
 * transport. What it does not have to be is YouTube-SHAPED — `controls: 0`
 * removes their chrome completely and every control is re-exposed as a method
 * here, so the player the visitor sees is ours.
 *
 * Nothing is requested from Google until `activate()` runs. The API script,
 * the iframe, and every cookie YouTube would set are all deferred to a real
 * click on the play button, so a visitor who never plays the video is never
 * exposed to it. That is the privacy answer as much as the performance one:
 * see the consent notes in CLAUDE.md before changing it to load eagerly.
 */

interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  mute(): void;
  unMute(): void;
  isMuted(): boolean;
  getCurrentTime(): number;
  getDuration(): number;
  destroy(): void;
  /** Deprecated upstream and may be absent — always call through askForBestQuality. */
  setPlaybackQuality?: (quality: string) => void;
  getAvailableQualityLevels?: () => string[];
}

/**
 * Ask for the best stream the video actually has.
 *
 * Read this before trying to force a resolution: YouTube DEPRECATED
 * programmatic quality selection. `setPlaybackQuality` is documented as a
 * suggestion the player is free to ignore, and it usually does — quality is
 * chosen from bandwidth, and from the size the player is rendered at.
 *
 * So the call below is the polite half, and the layout is the half that works:
 * the iframe is sized to the container's real pixels (width/height 100% on an
 * `inset-0` wrapper), because a player rendered small is served a small stream
 * no matter what is requested here. Shrinking the video's container is what
 * would actually cost quality.
 */
function askForBestQuality(player: YTPlayer) {
  const levels = player.getAvailableQualityLevels?.();
  // Ordered best-first by the API, so index 0 is the highest this video has.
  const best = levels?.[0];
  if (best) player.setPlaybackQuality?.(best);
  else player.setPlaybackQuality?.("highres");
}

interface YTPlayerEvent {
  data: number;
  target: YTPlayer;
}

declare global {
  interface Window {
    YT?: {
      Player: new (
        el: HTMLElement,
        opts: {
          videoId: string;
          host?: string;
          width?: string;
          height?: string;
          playerVars?: Record<string, string | number>;
          events?: {
            onReady?: (e: YTPlayerEvent) => void;
            onStateChange?: (e: YTPlayerEvent) => void;
          };
        },
      ) => YTPlayer;
      PlayerState: { PLAYING: number; PAUSED: number; ENDED: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

/**
 * One script for the whole page, however many players are on it.
 *
 * `onYouTubeIframeAPIReady` is a SINGLE global callback, so a second player
 * that overwrote it would silently cancel the first. The promise is resolved
 * once and every player awaits the same one.
 */
let apiPromise: Promise<void> | null = null;

function loadIframeApi(): Promise<void> {
  if (apiPromise) return apiPromise;

  apiPromise = new Promise<void>((resolve) => {
    if (window.YT?.Player) {
      resolve();
      return;
    }
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };
    const script = document.createElement("script");
    // The API script itself only exists on youtube.com. The PLAYER is pointed
    // at youtube-nocookie.com below, which is the part that governs what gets
    // stored on the visitor's device.
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    document.head.appendChild(script);
  });

  return apiPromise;
}

export interface YouTubeController {
  /** Attach to the element the iframe replaces. */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** True once the visitor has asked for the video and the iframe exists. */
  activated: boolean;
  playing: boolean;
  muted: boolean;
  current: number;
  duration: number;
  activate: () => void;
  toggle: () => void;
  stop: () => void;
  toggleMute: () => void;
  seek: (seconds: number) => void;
}

export function useYouTubePlayer(videoId: string): YouTubeController {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);

  const [activated, setActivated] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  const activate = useCallback(() => {
    if (activated) return;
    setActivated(true);

    void loadIframeApi().then(() => {
      const host = containerRef.current;
      if (!host || !window.YT || playerRef.current) return;

      playerRef.current = new window.YT.Player(host, {
        videoId,
        host: "https://www.youtube-nocookie.com",
        // The API REPLACES the container element with the iframe, so the
        // container's own classes are gone by the time it renders. Sizing has
        // to come through here; the wrapper around it is what positions it.
        width: "100%",
        height: "100%",
        playerVars: {
          // No YouTube chrome: our control bar is the only UI.
          controls: 0,
          // No related-video grid at the end, no keyboard shortcuts fighting
          // ours, no annotations, no fullscreen button we did not draw.
          rel: 0,
          disablekb: 1,
          iv_load_policy: 3,
          fs: 0,
          playsinline: 1,
          // The click that activated the player is the user gesture that makes
          // this allowed. If a browser refuses it anyway the play button simply
          // stays up, which is a safe failure.
          autoplay: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (e) => {
            setDuration(e.target.getDuration());
            setMuted(e.target.isMuted());
            askForBestQuality(e.target);
            e.target.playVideo();
          },
          onStateChange: (e) => {
            const state = window.YT?.PlayerState;
            if (!state) return;
            setPlaying(e.data === state.PLAYING);
            if (e.data === state.PLAYING || e.data === state.ENDED) {
              setDuration(e.target.getDuration());
              // The full ladder is only known once playback has begun; asking
              // again here is what actually reaches the top rung, since at
              // onReady getAvailableQualityLevels is often still empty.
              if (e.data === state.PLAYING) askForBestQuality(e.target);
            }
          },
        },
      });
    });
  }, [activated, videoId]);

  // The IFrame API has no `timeupdate` event, so the scrubber is polled. Only
  // while playing — a paused player's time cannot move on its own.
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      const player = playerRef.current;
      if (!player) return;
      setCurrent(player.getCurrentTime());
      const d = player.getDuration();
      if (d) setDuration(d);
    }, 250);
    return () => window.clearInterval(id);
  }, [playing]);

  useEffect(() => {
    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, []);

  const toggle = useCallback(() => {
    const player = playerRef.current;
    if (!player) {
      activate();
      return;
    }
    if (playing) player.pauseVideo();
    else player.playVideo();
  }, [activate, playing]);

  const stop = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    player.pauseVideo();
    player.seekTo(0, true);
    setCurrent(0);
  }, []);

  const toggleMute = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    if (player.isMuted()) player.unMute();
    else player.mute();
    setMuted(player.isMuted());
  }, []);

  const seek = useCallback((seconds: number) => {
    const player = playerRef.current;
    if (!player) return;
    player.seekTo(seconds, true);
    setCurrent(seconds);
  }, []);

  return {
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
  };
}

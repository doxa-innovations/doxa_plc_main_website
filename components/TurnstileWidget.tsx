"use client";

import { useEffect, useRef } from "react";

/**
 * Cloudflare Turnstile, rendered invisibly.
 *
 * `appearance: "interaction-only"` is what makes this the no-click experience
 * that was asked for: nothing is drawn at all unless Cloudflare decides this
 * particular visitor genuinely needs to prove something, which is rare. The
 * usual case is a token appearing silently with no visible widget and no
 * "select all the traffic lights".
 *
 * Rendered explicitly rather than by the script's automatic scan. The auto
 * scan runs once when the script loads, so on a client-side navigation into
 * this page the script is already loaded, the scan never re-runs, and the
 * widget silently never appears.
 */

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: Record<string, unknown>,
      ) => string | undefined;
      remove: (id: string) => void;
      reset: (id?: string) => void;
    };
    onloadTurnstileCallback?: () => void;
  }
}

const SCRIPT_ID = "cf-turnstile-script";
const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

export function TurnstileWidget({
  siteKey,
  onToken,
}: {
  siteKey: string;
  /** Called with the token, or null when it expires or errors. */
  onToken: (token: string | null) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  // Held in a ref so re-renders never tear down and recreate the widget, which
  // would make Cloudflare issue a fresh challenge mid-form. Updated in an
  // effect rather than during render: mutating a ref while rendering is not
  // safe under concurrent rendering, which is what react-hooks/refs catches.
  const onTokenRef = useRef(onToken);
  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    let cancelled = false;

    const render = () => {
      if (cancelled || !containerRef.current || !window.turnstile) return;
      if (widgetIdRef.current !== null) return;

      widgetIdRef.current =
        window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          // Invisible unless a challenge is genuinely required.
          appearance: "interaction-only",
          // Telemetry marker used by Cloudflare for aggregate activation
          // stats. Never per-user.
          action: "turnstile-spin-v1",
          callback: (token: string) => onTokenRef.current(token),
          // A token is single-use and expires after ~5 minutes. Clearing it
          // means a slow form-filler gets a fresh one rather than submitting
          // a stale token that would be rejected.
          "expired-callback": () => onTokenRef.current(null),
          "timeout-callback": () => onTokenRef.current(null),
          "error-callback": () => {
            onTokenRef.current(null);
            // Not fatal: the server treats an absent token as unverified and
            // decides from there, so a Cloudflare outage cannot wedge a
            // visitor out of the form.
            return true;
          },
        }) ?? null;
    };

    if (window.turnstile) {
      render();
    } else if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.onload = render;
      document.head.appendChild(script);
    } else {
      // The script is in flight from a previous mount. Poll briefly rather
      // than racing its onload, which has already been claimed.
      const timer = setInterval(() => {
        if (window.turnstile) {
          clearInterval(timer);
          render();
        }
      }, 100);
      return () => {
        cancelled = true;
        clearInterval(timer);
      };
    }

    return () => {
      cancelled = true;
      if (widgetIdRef.current !== null && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [siteKey]);

  return <div ref={containerRef} />;
}

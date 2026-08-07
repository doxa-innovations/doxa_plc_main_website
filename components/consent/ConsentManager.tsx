"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import {
  CONSENT_POLICY_VERSION,
  type ConsentAction,
  type ConsentState,
  getConsentServerSnapshot,
  getConsentSnapshot,
  subscribeToConsent,
  writeConsentCookie,
} from "@/lib/consent";
import { applyConsentMode } from "@/lib/consent-mode";
import { cn } from "@/lib/utils";

/**
 * The consent banner and the visit beacon, in one mount point.
 *
 * They live together because they share one piece of state: whether analytics
 * consent exists. Splitting them would need a context or an event bus to carry
 * a single boolean between two siblings.
 *
 * The two jobs are deliberately unequal. The beacon runs for everyone, because
 * it stores nothing on the visitor's device. The banner governs only the
 * optional extras layered on top.
 *
 * The bar stays mounted in the closed position rather than unmounting. That
 * makes the exit animation and the footer's reopen link trivial, and off
 * screen it is inert and aria-hidden so it reaches neither the tab order nor
 * a screen reader.
 */

function postJson(url: string, body: unknown): void {
  void fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {
    // Analytics must never surface an error to a visitor.
  });
}

function Switch({
  checked,
  onChange,
  disabled,
  label,
}: {
  checked: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        checked
          ? "border-pj-secondary/50 bg-pj-primary"
          : "border-line-strong bg-panel-strong",
        disabled && "cursor-not-allowed opacity-60",
      )}
    >
      <span
        className={cn(
          "pointer-events-none block size-4 rounded-full bg-white transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
          checked ? "translate-x-[1.4rem]" : "translate-x-[0.2rem]",
        )}
      />
    </button>
  );
}

export function ConsentManager() {
  // undefined while hydrating, null when undecided, object when decided.
  const stored = useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    getConsentServerSnapshot,
  );

  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState({ analytics: false, marketing: false });
  const barRef = useRef<HTMLDivElement>(null);
  const beaconFired = useRef(false);

  const needsDecision = stored === null;

  /** One visit per page load. The server de-duplicates repeat loads. */
  const fireBeacon = useCallback(() => {
    if (beaconFired.current) return;
    beaconFired.current = true;
    postJson("/api/t", {
      url: window.location.href,
      referrer: document.referrer || null,
      /**
       * `navigator.webdriver` is true in every browser under automation, and
       * is the one signal a headless session still emits honestly by default.
       * It catches the crawlers that spoof their user agent to look human,
       * which is exactly the set a server-side check cannot see.
       */
      automation:
        typeof navigator !== "undefined" && navigator.webdriver === true,
    });
  }, []);

  // Push consent signals before anything Google-owned could load, and again on
  // every change. Syncing an external system is exactly what an effect is for.
  useEffect(() => {
    if (stored === undefined) return;
    applyConsentMode(stored);
  }, [stored]);

  useEffect(() => {
    fireBeacon();
  }, [fireBeacon]);

  // Mount closed, then open on the next frame so the transition has two
  // distinct states to interpolate between. setState inside rAF is
  // asynchronous, so this does not cascade renders.
  useEffect(() => {
    if (!needsDecision) return;
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setOpen(true)),
    );
    return () => cancelAnimationFrame(id);
  }, [needsDecision]);

  // Publish the bar's height so the floating video mini-player lifts above it
  // instead of sitting underneath.
  useEffect(() => {
    const root = document.documentElement;
    const bar = barRef.current;
    if (!open || !bar) {
      root.style.removeProperty("--consent-banner-h");
      return;
    }
    const observer = new ResizeObserver(([entry]) => {
      root.style.setProperty(
        "--consent-banner-h",
        `${Math.round(entry.contentRect.height)}px`,
      );
    });
    observer.observe(bar);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--consent-banner-h");
    };
  }, [open]);

  // Reopened from the footer link.
  useEffect(() => {
    const reopen = () => {
      const current = getConsentSnapshot();
      setDraft({
        analytics: current?.analytics ?? false,
        marketing: current?.marketing ?? false,
      });
      setExpanded(true);
      setOpen(true);
    };
    window.addEventListener("doxa:open-consent", reopen);
    return () => window.removeEventListener("doxa:open-consent", reopen);
  }, []);

  const decide = useCallback(
    (next: { analytics: boolean; marketing: boolean }, action: ConsentAction) => {
      const state: ConsentState = {
        v: CONSENT_POLICY_VERSION,
        analytics: next.analytics,
        marketing: next.marketing,
        at: new Date().toISOString(),
      };

      writeConsentCookie(state);
      applyConsentMode(state);
      setDraft(next);
      setOpen(false);
      setExpanded(false);

      postJson("/api/consent", { ...next, action });

      // Re-fire so a newly consenting visitor gets their persistent id issued
      // against the session they are already in, rather than the next one.
      if (next.analytics) {
        beaconFired.current = false;
        fireBeacon();
      }
    },
    [fireBeacon],
  );

  return (
    <div
      ref={barRef}
      role="region"
      aria-label="Cookie preferences"
      data-state={open ? "open" : "closed"}
      aria-hidden={!open}
      inert={!open ? true : undefined}
      // z-[70] clears the floating video mini-player at z-[60]. The film-grain
      // overlay sits at z-100 but is pointer-events:none at 3% opacity.
      className={cn(
        "fixed inset-x-0 bottom-0 z-[70] border-t border-line bg-deep/95 backdrop-blur-xl",
        "transition-transform ease-[cubic-bezier(0.16,1,0.3,1)]",
        // Enter deliberately, leave quickly: slow where the visitor is
        // deciding, fast once the system is only acknowledging.
        "data-[state=open]:translate-y-0 data-[state=open]:duration-[280ms]",
        "data-[state=closed]:translate-y-full data-[state=closed]:duration-200",
      )}
    >
      <Container className="py-4 sm:py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          <div className="max-w-2xl">
            <p className="font-display text-sm font-semibold text-ink">
              We measure where our visitors come from
            </p>
            <p className="mt-1.5 text-sm text-ink-muted">
              That part works without storing anything on your device, so it
              runs either way. Optional cookies let us recognise a returning
              visit across days and measure our ads. They stay off unless you
              turn them on.{" "}
              <a
                href="/privacy"
                className="text-brand underline underline-offset-4 hover:text-glow"
              >
                Read the privacy policy
              </a>
              .
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:shrink-0">
            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Accept and Reject must carry the SAME visual weight: same
                  size, same fill treatment, same border. A prominent accept
                  beside a quieter reject is not valid consent under GDPR and
                  regulators have ruled on it repeatedly.
                  The default Button ships a violet glow shadow, which would
                  pull the eye to Accept, so it is removed here and both get an
                  explicit border instead. */}
              <Button
                onClick={() =>
                  decide({ analytics: true, marketing: true }, "accept-all")
                }
                className="border border-pj-secondary/50 shadow-none hover:shadow-none sm:min-w-[9rem]"
              >
                Accept all
              </Button>
              <Button
                onClick={() =>
                  decide({ analytics: false, marketing: false }, "reject-all")
                }
                className="border border-line-strong bg-surface-nested text-ink shadow-none hover:bg-surface-nested/80 hover:shadow-none sm:min-w-[9rem]"
              >
                Reject all
              </Button>
            </div>
            <Button
              variant="ghost"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              className="text-ink-muted hover:text-ink"
            >
              {expanded ? "Hide options" : "Choose what we use"}
            </Button>
          </div>
        </div>

        {expanded && (
          <div className="mt-5 grid gap-3 border-t border-line pt-5 sm:grid-cols-3">
            <Row
              title="Necessary"
              body="Remembers this choice, and keeps you signed in if you work here. Always on."
              checked
              disabled
            />
            <Row
              title="Analytics"
              body="Recognises a returning visit across days, instead of only within one session."
              checked={draft.analytics}
              onChange={(analytics) => setDraft((d) => ({ ...d, analytics }))}
            />
            <Row
              title="Marketing"
              body="Measures which ads led to an enquiry, so we know what is worth paying for."
              checked={draft.marketing}
              onChange={(marketing) => setDraft((d) => ({ ...d, marketing }))}
            />
            <div className="sm:col-span-3">
              <Button
                variant="outline"
                onClick={() => decide(draft, "custom")}
              >
                Save preferences
              </Button>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

function Row({
  title,
  body,
  checked,
  disabled,
  onChange,
}: {
  title: string;
  body: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (next: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-3 rounded-[1.25rem] border border-line bg-panel p-4">
      <Switch
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        label={title}
      />
      <div>
        <p className="text-sm font-medium text-ink">{title}</p>
        <p className="mt-1 text-xs text-ink-muted">{body}</p>
      </div>
    </div>
  );
}

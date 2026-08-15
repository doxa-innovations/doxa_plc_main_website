import Link from "next/link";

import { TIMEFRAMES, type TimeframeKey } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * Timeframe selector, as links rather than client state.
 *
 * The whole dashboard is server-rendered from SQL, so the range belongs in the
 * URL: the view becomes linkable and shareable, the back button works, and no
 * JavaScript is needed to change it.
 */
export function TimeframeTabs({
  active,
  basePath,
}: {
  active: TimeframeKey;
  basePath: string;
}) {
  return (
    <div
      role="tablist"
      aria-label="Timeframe"
      className="inline-flex rounded-full border border-line bg-panel p-1"
    >
      {(Object.keys(TIMEFRAMES) as TimeframeKey[]).map((key) => {
        const selected = key === active;
        return (
          <Link
            key={key}
            href={`${basePath}?range=${key}`}
            role="tab"
            aria-selected={selected}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors duration-200",
              selected
                ? "bg-panel-strong text-ink"
                : "text-ink-muted hover:text-ink",
            )}
          >
            {TIMEFRAMES[key].label}
          </Link>
        );
      })}
    </div>
  );
}

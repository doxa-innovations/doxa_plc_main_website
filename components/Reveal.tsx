import { cn } from "@/lib/utils";

/**
 * Scroll-reveal that is SAFE by default: content is fully visible with no JS,
 * on crawlers, and under prefers-reduced-motion. The entrance is a pure CSS
 * scroll-driven animation (see `.reveal` in globals.css) applied ONLY where
 * `animation-timeline: view()` is supported, so we never gate visibility on a
 * transition that might not fire (the impeccable reveal rule).
 */
export function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  /** Accepted for call-site compatibility; scroll-driven timing is automatic. */
  delay?: number;
  y?: number;
  className?: string;
}) {
  return <div className={cn("reveal", className)}>{children}</div>;
}

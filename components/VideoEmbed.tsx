import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Reusable video slot. Until a real `src` is provided it renders a styled
 * "video coming soon" placeholder at the right aspect ratio (portrait for the
 * FAQ tech-talk clips, landscape for the thank-you video), so the layout is
 * ready for the videos the client will supply.
 */
export function VideoEmbed({
  src,
  poster,
  title,
  orientation = "landscape",
  className,
}: {
  src?: string;
  poster?: string;
  title: string;
  orientation?: "portrait" | "landscape";
  className?: string;
}) {
  const aspect = orientation === "portrait" ? "aspect-[9/16]" : "aspect-video";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.4rem] border border-line bg-surface-muted",
        aspect,
        className,
      )}
    >
      {src ? (
        <video
          src={src}
          poster={poster}
          controls
          playsInline
          preload="metadata"
          className="size-full object-cover"
        />
      ) : (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 [background:radial-gradient(60%_50%_at_50%_38%,rgba(124,60,180,0.28),transparent)]"
          />
          <div className="absolute inset-0 grid place-items-center p-6">
            <div className="flex flex-col items-center gap-3 text-center">
              <span className="grid size-14 place-items-center rounded-full border border-line-strong bg-panel-strong text-brand backdrop-blur-sm">
                <Play className="size-6" strokeWidth={1.5} aria-hidden />
              </span>
              <p className="text-sm font-medium text-ink">{title}</p>
              <p className="text-xs text-ink-muted">Video coming soon</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

import { cn } from "@/lib/utils";

/**
 * Background "blueprint" decoration — a restrained engineering/construction
 * language that echoes the grid-built brand logo and the "engineered to earn
 * your trust" voice. Token-driven (`--grid`, `--grid-strong`, `--mark`), always
 * behind content (`-z-10` inside an `isolate`d section), pointer-events-none,
 * aria-hidden. Mostly static, so nothing to gate for reduced-motion.
 *
 * Each layer is full-bleed but masked with a slow gradient so it's strongest at
 * the band's edges and dissolves to nothing across the center where content
 * lives, returning on the far side — no hard cutoffs. `background-attachment:
 * fixed` anchors every grid to the viewport so the squares align across bands.
 */

const MAX_W = "mx-auto h-full w-full max-w-6xl px-4 sm:px-6 lg:px-8";

const gridStyle = (cell: number): React.CSSProperties => ({
  backgroundImage:
    "linear-gradient(to right, var(--grid) 1px, transparent 1px)," +
    "linear-gradient(to bottom, var(--grid) 1px, transparent 1px)",
  backgroundSize: `${cell}px ${cell}px`,
  backgroundAttachment: "fixed",
});

// Slow, gradual fade masks — the decoration is full at the band's edges and
// dissolves to nothing across the center (behind content), then returns on the
// far side. No hard cutoffs anywhere. `sides` is the default left↔right fade;
// `edges` is the hero's radial variant.
const FADE: Record<string, string | undefined> = {
  sides:
    "linear-gradient(to right, #000 0%, transparent 33%, transparent 67%, #000 100%)",
  edges:
    "radial-gradient(ellipse 85% 78% at 50% 44%, transparent 32%, #000 86%)",
  top: "linear-gradient(to bottom, #000, transparent)",
  bottom: "linear-gradient(to top, #000, transparent)",
  none: undefined,
};

/**
 * Blueprint grid, full-bleed, masked with a slow fade so it lives at the band's
 * edges and dissolves behind centered content. `background-attachment: fixed`
 * anchors it to the viewport so the squares align across every band.
 */
export function GridField({
  className,
  cell = 56,
  fade = "sides",
}: {
  className?: string;
  cell?: number;
  fade?: keyof typeof FADE;
}) {
  const mask = FADE[fade];
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10", className)}
      style={{ ...gridStyle(cell), WebkitMaskImage: mask, maskImage: mask }}
    />
  );
}

/** Dotted field — a full-bleed texture variant, same slow fade as the grid. */
export function Dots({
  className,
  gap = 24,
  fade = "sides",
}: {
  className?: string;
  gap?: number;
  fade?: keyof typeof FADE;
}) {
  const mask = FADE[fade];
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10", className)}
      style={{
        backgroundImage:
          "radial-gradient(var(--grid-strong) 1px, transparent 1.6px)",
        backgroundSize: `${gap}px ${gap}px`,
        backgroundAttachment: "fixed",
        WebkitMaskImage: mask,
        maskImage: mask,
      }}
    />
  );
}

/**
 * Diagonal hatching in the side gutters (transparent across the content column)
 * — drafting-paper texture for empty space, layered with the grid in the hero.
 */
export function Hatch({
  className,
  gap = 8,
}: {
  className?: string;
  gap?: number;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 [mask-image:linear-gradient(to_right,#000,#000_8%,transparent_16%,transparent_84%,#000_92%,#000)]",
        className,
      )}
      style={{
        backgroundImage: `repeating-linear-gradient(-45deg, var(--grid-strong) 0, var(--grid-strong) 1px, transparent 1px, transparent ${gap}px)`,
        backgroundAttachment: "fixed",
      }}
    />
  );
}

/**
 * Registration marks at the four corners of the content column: crosshairs
 * ("plus", default) or L-brackets ("bracket").
 */
export function FrameMarks({
  className,
  variant = "plus",
  size = 16,
}: {
  className?: string;
  variant?: "bracket" | "plus";
  size?: number;
}) {
  const corners = [
    "left-0 top-0 border-l border-t",
    "right-0 top-0 border-r border-t",
    "left-0 bottom-0 border-l border-b",
    "right-0 bottom-0 border-r border-b",
  ];
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10", className)}
    >
      <div className={cn(MAX_W, "relative")}>
        {variant === "bracket"
          ? corners.map((c, i) => (
              <span
                key={i}
                className={cn("absolute border-mark", c)}
                style={{ width: size, height: size }}
              />
            ))
          : (
              [
                "left-0 top-0",
                "right-0 top-0",
                "left-0 bottom-0",
                "right-0 bottom-0",
              ] as const
            ).map((pos, i) => <Crosshair key={i} className={cn("absolute", pos)} />)}
      </div>
    </div>
  );
}

/** A single "+" crosshair, centered on its anchor point. */
export function Crosshair({
  className,
  size = 14,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none block -translate-x-1/2 -translate-y-1/2",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-mark" />
      <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-mark" />
    </span>
  );
}

/**
 * Full-width concentric rings, centered, that dissolve across the middle so
 * footer content sits over clean space and the arcs return on either side —
 * the same slow left↔right fade as the section grids. The footer's signature.
 */
export function Rings({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden [mask-image:linear-gradient(to_right,#000_0%,transparent_36%,transparent_64%,#000_100%)]",
        className,
      )}
    >
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <span
          key={i}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-grid-strong"
          style={{ width: 360 + i * 360, height: 360 + i * 360 }}
        />
      ))}
    </div>
  );
}

/**
 * Soft violet ambient glow blooms. Sits behind content on dark bands for depth;
 * use sparingly (hero, CTA). Defaults to two offset blooms.
 */
export function GlowField({
  className,
  blooms = "duo",
}: {
  className?: string;
  blooms?: "duo" | "center";
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      {blooms === "center" ? (
        <div className="absolute left-1/2 top-1/2 size-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pj-primary/25 blur-[130px]" />
      ) : (
        <>
          <div className="absolute -left-32 top-0 size-[40rem] rounded-full bg-pj-primary/25 blur-[130px] motion-safe:animate-blob" />
          <div className="absolute -right-24 top-24 size-[34rem] rounded-full bg-pj-secondary/20 blur-[130px] motion-safe:animate-blob [animation-delay:4s]" />
        </>
      )}
    </div>
  );
}

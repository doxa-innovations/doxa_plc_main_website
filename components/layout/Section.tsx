import { cn } from "@/lib/utils";
import { Container } from "./Container";
import { FrameMarks, GridField, Dots } from "@/components/visual/Decor";

type SectionVariant = "surface" | "muted" | "light" | "tint" | "deep" | "accent";

const variantClasses: Record<SectionVariant, string> = {
  // Deep-violet is the default canvas (the original #14002e): `surface` and
  // `muted` are both that base color, `deep` the darker spotlight band,
  // `accent` the brand-accent.
  //
  // `light` and `tint` are the white accent bands. Adding the `.light` class
  // flips the token scope (globals.css), so `bg-surface` resolves to #ffffff
  // and `text-ink` to the violet — every token-based child inverts with it.
  surface: "bg-surface text-ink",
  muted: "bg-surface text-ink",
  light: "light bg-surface text-ink",
  tint: "light bg-surface-muted text-ink",
  deep: "bg-deep text-ink",
  accent: "bg-pj-accent text-pj-white",
};

/**
 * Full-bleed violet section with vertical rhythm. Carries the shared blueprint
 * backdrop: a gutter grid + corner crosshairs by default (opt out per band),
 * with `dots` for a textural variant and `frame="bracket"` for L-brackets.
 */
export function Section({
  id,
  variant = "surface",
  className,
  containerClassName,
  grid = true,
  dots = false,
  frame = true,
  bracket = false,
  children,
}: {
  id?: string;
  variant?: SectionVariant;
  className?: string;
  containerClassName?: string;
  /** Gutter blueprint grid (default on). */
  grid?: boolean;
  /** Use a dotted gutter field instead of the line grid. */
  dots?: boolean;
  /** Corner registration marks (default on). */
  frame?: boolean;
  /** Render corner L-brackets instead of crosshairs. */
  bracket?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative isolate py-16 sm:py-20 lg:py-24",
        variantClasses[variant],
        className,
      )}
    >
      {dots ? <Dots /> : grid && <GridField />}
      {frame && <FrameMarks variant={bracket ? "bracket" : "plus"} />}
      <Container className={cn("relative", containerClassName)}>{children}</Container>
    </section>
  );
}

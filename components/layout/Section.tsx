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
  // `surface` and `muted` paint NOTHING. The site sits on the shared aurora
  // canvas (globals.css, mounted in app/(site)/layout.tsx); a fill here would
  // paint straight over it. They stay as separate names because call sites use
  // them to mean "default band" vs "the next one along", and `deep`/`accent`
  // still darken deliberately on top of the canvas.
  //
  // In light mode `deep` flips to the soft violet-tint accent band so it does
  // not paint a full-height dark box on an otherwise white page. `accent`
  // stays as pj-accent by design — it is a hero-strength surface and reads
  // fine as a dark accent in either theme.
  surface: "text-ink",
  muted: "text-ink",
  light: "light bg-surface text-ink",
  tint: "light bg-surface-muted text-ink",
  deep: "bg-deep text-ink light:bg-surface-muted",
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

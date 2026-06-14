import { cn } from "@/lib/utils";
import { Container } from "./Container";

type SectionVariant = "surface" | "muted" | "accent";

const variantClasses: Record<SectionVariant, string> = {
  surface: "bg-surface text-ink",
  muted: "bg-surface-muted text-ink",
  accent: "bg-pj-accent text-pj-white",
};

/**
 * Full-bleed section with vertical rhythm and a background variant, so pages
 * can alternate light / muted / accent bands for visual rhythm.
 */
export function Section({
  id,
  variant = "surface",
  className,
  containerClassName,
  children,
}: {
  id?: string;
  variant?: SectionVariant;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-16 sm:py-20 lg:py-24",
        variantClasses[variant],
        className,
      )}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

import { cn } from "@/lib/utils";

/** Eyebrow + title + optional lead, used to head most sections. */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "center",
  inverted = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "center" | "left";
  inverted?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "text-sm font-semibold uppercase tracking-wide",
            inverted ? "text-pj-secondary" : "text-pj-primary",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl",
          inverted ? "text-pj-white" : "text-ink",
        )}
      >
        {title}
      </h2>
      {lead && (
        <p
          className={cn(
            "mt-4 text-lg",
            inverted ? "text-pj-white/70" : "text-ink/70",
          )}
        >
          {lead}
        </p>
      )}
    </div>
  );
}

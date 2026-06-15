import { cn } from "@/lib/utils";

/**
 * Section header. The eyebrow is OPT-IN and should be used sparingly (at most
 * ~1 per 3 sections), an eyebrow above every section is the #1 AI tell. Most
 * sections should use the headline alone. Display font for headings.
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "center" | "left";
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
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-pj-secondary">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-balance text-3xl font-semibold tracking-[-0.03em] text-ink sm:text-4xl lg:text-[2.75rem] lg:leading-[1.05]">
        {title}
      </h2>
      {lead && (
        <p
          className={cn(
            "mt-4 text-lg text-ink-muted",
            align === "center" ? "mx-auto" : "",
            "max-w-2xl text-pretty",
          )}
        >
          {lead}
        </p>
      )}
    </div>
  );
}

import { cn } from "@/lib/utils";

/**
 * Dashboard primitives.
 *
 * The bar lists are plain HTML, not a chart library. A horizontal bar chart is
 * a div with a width, and doing it this way keeps the values as real selectable
 * text, keeps it readable when CSS fails, and makes it a table for screen
 * readers rather than an unlabelled canvas.
 */

const BAR = "#b277d3";

export function Card({
  title,
  subtitle,
  children,
  className,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-[1.25rem] border border-line bg-panel p-5",
        className,
      )}
    >
      {title && (
        <div className="mb-4">
          <h2 className="font-display text-sm font-semibold text-ink">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-0.5 text-xs text-ink-muted">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

/**
 * A single number that matters. Not a chart: one value with no trend to show
 * has no shape, and drawing it as a chart would be decoration.
 */
export function StatTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-[1.25rem] border border-line bg-panel p-5">
      <p className="text-xs font-medium text-ink-muted">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold tabular-nums tracking-tight text-ink">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-ink-muted/80">{hint}</p>}
    </div>
  );
}

export interface BarDatum {
  label: string;
  sublabel?: string;
  value: number;
  /** Optional second column, e.g. leads against visits. */
  secondary?: number;
  secondaryLabel?: string;
}

export function BarList({
  data,
  valueLabel,
  emptyMessage = "Nothing recorded yet.",
}: {
  data: BarDatum[];
  valueLabel: string;
  emptyMessage?: string;
}) {
  if (data.length === 0) {
    return <p className="py-6 text-sm text-ink-muted">{emptyMessage}</p>;
  }

  // Scale to the largest bar rather than to the total, so the top row always
  // fills the track and small values stay visible instead of collapsing.
  const max = Math.max(...data.map((d) => d.value), 1);
  const hasSecondary = data.some((d) => d.secondary !== undefined);

  return (
    <table className="w-full text-sm">
      <caption className="sr-only">
        {valueLabel} by category
        {hasSecondary ? ", with leads" : ""}
      </caption>
      <thead className="sr-only">
        <tr>
          <th scope="col">Category</th>
          <th scope="col">{valueLabel}</th>
          {hasSecondary && <th scope="col">Leads</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((d) => (
          <tr key={`${d.label}-${d.sublabel ?? ""}`} className="group">
            <td className="py-1.5 pr-3 align-middle">
              <div className="relative">
                {/* The bar sits behind the label so the row stays one line
                    and the text is always legible on top of it. */}
                <div
                  aria-hidden
                  className="absolute inset-y-0 left-0 rounded-r-[4px] opacity-25 transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.32,1)]"
                  style={{
                    width: `${Math.max((d.value / max) * 100, 1.5)}%`,
                    backgroundColor: BAR,
                  }}
                />
                <div className="relative flex min-h-[26px] items-center gap-2 px-2">
                  <span className="truncate text-ink">{d.label}</span>
                  {d.sublabel && (
                    <span className="truncate text-xs text-ink-muted">
                      {d.sublabel}
                    </span>
                  )}
                </div>
              </div>
            </td>
            <td className="w-14 py-1.5 text-right align-middle tabular-nums text-ink">
              {d.value.toLocaleString()}
            </td>
            {hasSecondary && (
              <td className="w-16 py-1.5 pl-3 text-right align-middle tabular-nums text-ink-muted">
                {d.secondary?.toLocaleString() ?? "0"}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

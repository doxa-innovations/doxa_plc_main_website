"use client";

import { cn } from "@/lib/utils";

/**
 * A real toggle, not a checkbox.
 *
 * Hand-rolled rather than pulled from Radix because it must post a value with
 * a plain `<form action={serverAction}>`, and a native checkbox is the only
 * control that does that with no JavaScript glue. So the checkbox stays as the
 * real input, visually hidden, and the switch is drawn from its checked state.
 * Keyboard operation, label association and form submission all keep working.
 *
 * Note the knob selector: `peer-checked:` compiles to a SIBLING combinator
 * (`.peer:checked ~ &`), and the knob is a descendant of the label rather than
 * a sibling of the input, so a bare `peer-checked:translate-x-*` on the knob
 * silently never matches. The transform is therefore declared on the label and
 * reaches the knob through a child selector.
 */
export function Switch({
  name,
  defaultChecked,
  label,
  hint,
  className,
}: {
  name: string;
  defaultChecked?: boolean;
  label: string;
  hint?: string;
  className?: string;
}) {
  const id = `switch-${name}`;
  return (
    <div className={cn("flex items-start gap-3", className)}>
      <input
        id={id}
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="peer sr-only"
      />

      <label
        htmlFor={id}
        aria-hidden
        className={cn(
          "relative mt-0.5 inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border transition-colors duration-200",
          "border-line-strong bg-panel-strong",
          "peer-checked:border-pj-secondary/50 peer-checked:bg-pj-primary",
          "peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/50",
          "peer-checked:[&>span]:translate-x-[1.4rem]",
        )}
      >
        <span className="pointer-events-none block size-4 translate-x-[0.2rem] rounded-full bg-white transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]" />
      </label>

      <div className="min-w-0">
        <label
          htmlFor={id}
          className="cursor-pointer text-sm font-medium text-ink"
        >
          {label}
        </label>
        {hint && <p className="mt-0.5 text-xs text-ink-muted/80">{hint}</p>}
      </div>
    </div>
  );
}

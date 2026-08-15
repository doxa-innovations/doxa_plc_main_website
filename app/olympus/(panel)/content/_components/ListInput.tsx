"use client";

import { useState } from "react";
import { GripVertical, Plus, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * An editable list of full sentences, one row each.
 *
 * Distinct from PillInput on purpose. Pills suit short single words like a
 * tech stack; the "what this tier includes" lines are phrases such as
 * "Fully tailored web, mobile & cloud", which would wrap badly as pills and
 * whose commas would fight the pill input's comma-splitting.
 *
 * Submitted as one newline-joined hidden field so the server action parsing is
 * shared with PillInput.
 */
export function ListInput({
  label,
  name,
  defaultValues,
  placeholder = "Add an item",
  hint,
}: {
  label: string;
  name: string;
  defaultValues: string[];
  placeholder?: string;
  hint?: string;
}) {
  const [values, setValues] = useState<string[]>(
    defaultValues.length > 0 ? defaultValues : [""],
  );

  const update = (index: number, next: string) =>
    setValues((v) => v.map((item, i) => (i === index ? next : item)));

  const remove = (index: number) =>
    setValues((v) => (v.length === 1 ? [""] : v.filter((_, i) => i !== index)));

  return (
    <div className="space-y-1.5 sm:col-span-2">
      <Label>{label}</Label>

      <div className="space-y-2">
        {values.map((value, i) => (
          <div key={i} className="flex items-center gap-2">
            <GripVertical
              className="size-4 shrink-0 text-ink-muted/40"
              aria-hidden
            />
            <Input
              value={value}
              placeholder={placeholder}
              onChange={(e) => update(i, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  // Enter adds the next row rather than submitting the form,
                  // so a list can be typed without reaching for the mouse.
                  e.preventDefault();
                  setValues((v) => [
                    ...v.slice(0, i + 1),
                    "",
                    ...v.slice(i + 1),
                  ]);
                }
              }}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label={`Remove item ${i + 1}`}
              className="grid size-8 shrink-0 place-items-center rounded-full text-ink-muted transition-colors hover:bg-destructive/20 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              <X className="size-4" strokeWidth={2} aria-hidden />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setValues((v) => [...v, ""])}
        className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
      >
        <Plus className="size-3.5" strokeWidth={2} aria-hidden />
        Add item
      </button>

      {hint && <p className="text-xs text-ink-muted/80">{hint}</p>}

      {/* Blank rows are dropped on the way out, so an empty trailing row that
          the editor left behind never becomes an empty bullet on the site. */}
      <input
        type="hidden"
        name={name}
        value={values.map((v) => v.trim()).filter(Boolean).join("\n")}
      />
    </div>
  );
}

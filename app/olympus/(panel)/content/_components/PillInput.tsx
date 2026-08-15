"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * Tag input: each value is a pill you can remove, new ones are typed and
 * committed with Enter or a comma.
 *
 * Replaces a textarea where every line was an item. That version worked but
 * asked the editor to hold an invisible rule in their head, gave no feedback
 * that a line had registered, and silently accepted a trailing blank line as
 * nothing. A pill is a thing you can see and delete.
 *
 * The values are submitted through one hidden input holding a newline-joined
 * string, so the existing server action parsing is unchanged and the form
 * still posts without JavaScript in the loop.
 */
export function PillInput({
  label,
  name,
  defaultValues,
  placeholder = "Type and press Enter",
  hint,
}: {
  label: string;
  name: string;
  defaultValues: string[];
  placeholder?: string;
  hint?: string;
}) {
  const [values, setValues] = useState<string[]>(defaultValues);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const add = (raw: string) => {
    const next = raw.trim();
    if (!next) return;
    // Case-insensitive de-dupe: "React" and "react" are the same tech.
    if (values.some((v) => v.toLowerCase() === next.toLowerCase())) {
      setDraft("");
      return;
    }
    setValues((v) => [...v, next]);
    setDraft("");
  };

  const remove = (index: number) =>
    setValues((v) => v.filter((_, i) => i !== index));

  return (
    <div className="space-y-1.5 sm:col-span-2">
      <Label htmlFor={`${name}-input`}>{label}</Label>

      <div
        className={cn(
          "flex min-h-[2.75rem] flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent p-2",
          "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {values.map((value, i) => (
          <span
            key={`${value}-${i}`}
            className="inline-flex items-center gap-1 rounded-full border border-line bg-panel-strong py-1 pl-2.5 pr-1 text-xs text-ink"
          >
            {value}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                remove(i);
              }}
              aria-label={`Remove ${value}`}
              className="grid size-4 place-items-center rounded-full text-ink-muted transition-colors hover:bg-destructive/20 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              <X className="size-3" strokeWidth={2.5} aria-hidden />
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          id={`${name}-input`}
          type="text"
          value={draft}
          placeholder={values.length === 0 ? placeholder : ""}
          onChange={(e) => {
            // A pasted comma-separated list should become pills, not one pill.
            if (e.target.value.includes(",")) {
              e.target.value.split(",").forEach(add);
            } else {
              setDraft(e.target.value);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              // Enter commits a pill; it must not submit the whole form.
              e.preventDefault();
              add(draft);
            } else if (e.key === "Backspace" && draft === "") {
              // Backspace on an empty field deletes the previous pill, which is
              // what every tag input does and what fingers expect.
              setValues((v) => v.slice(0, -1));
            }
          }}
          onBlur={() => add(draft)}
          className="min-w-[8rem] flex-1 bg-transparent px-1 text-sm text-ink outline-none placeholder:text-ink-muted/60"
        />
      </div>

      {hint && <p className="text-xs text-ink-muted/80">{hint}</p>}

      <input type="hidden" name={name} value={values.join("\n")} />
    </div>
  );
}

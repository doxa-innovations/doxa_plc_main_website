"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

/**
 * Plain field primitives for the edit modal.
 *
 * Uncontrolled inputs with `defaultValue`, submitted by a plain
 * `<form action={serverAction}>`. These forms are flat, save whole records and
 * have no cross-field validation, so a form library would add a dependency and
 * hydration cost for nothing.
 */

export function Field({
  label,
  name,
  defaultValue,
  hint,
  type = "text",
  wide,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  hint?: string;
  type?: string;
  wide?: boolean;
  required?: boolean;
  placeholder?: string;
}) {
  const id = `field-${name}`;
  return (
    <div className={cn("space-y-1.5", wide && "sm:col-span-2")}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue ?? ""}
      />
      {hint && <p className="text-xs text-ink-muted/80">{hint}</p>}
    </div>
  );
}

export function Area({
  label,
  name,
  defaultValue,
  hint,
  rows = 3,
  wide = true,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  hint?: string;
  rows?: number;
  wide?: boolean;
}) {
  const id = `field-${name}`;
  return (
    <div className={cn("space-y-1.5", wide && "sm:col-span-2")}>
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        name={name}
        rows={rows}
        defaultValue={defaultValue ?? ""}
      />
      {hint && <p className="text-xs text-ink-muted/80">{hint}</p>}
    </div>
  );
}

export function SelectField({
  label,
  name,
  defaultValue,
  options,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  options: { label: string; value: string }[];
  hint?: string;
}) {
  const id = `field-${name}`;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {/* A native select: one of the few controls that is better plain, and it
          keeps the form working without JavaScript. */}
      <select
        id={id}
        name={name}
        defaultValue={defaultValue}
        className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm text-ink outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-surface-muted">
            {o.label}
          </option>
        ))}
      </select>
      {hint && <p className="text-xs text-ink-muted/80">{hint}</p>}
    </div>
  );
}

/** A label/value row for the detail drawer. Renders nothing when empty. */
export function DetailRow({
  label,
  value,
}: {
  label: string;
  value?: React.ReactNode;
}) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex gap-4 border-b border-line/60 py-2.5 last:border-0">
      <dt className="w-32 shrink-0 text-xs text-ink-muted">{label}</dt>
      <dd className="min-w-0 flex-1 break-words text-sm text-ink">{value}</dd>
    </div>
  );
}

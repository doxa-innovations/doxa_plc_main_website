import type { Field } from "payload";

/**
 * Payload has no "array of strings" field, so a list of plain strings has to
 * be modelled as an array of single-field rows. These two helpers keep that
 * detail in one place rather than repeating the `{ value: string }[]` shape
 * and its unwrapping at every call site.
 */
export function stringList(
  name: string,
  options: { label?: string; required?: boolean } = {},
): Field {
  return {
    name,
    type: "array",
    label: options.label,
    required: options.required,
    fields: [{ name: "value", type: "text", required: true }],
  };
}

/** Unwraps a stored list back into the `string[]` the site's types expect. */
export function readStringList(
  rows: { value?: string | null }[] | null | undefined,
): string[] {
  if (!rows) return [];
  return rows
    .map((r) => r.value?.trim())
    .filter((v): v is string => Boolean(v));
}

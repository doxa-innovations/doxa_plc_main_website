"use client";

import { useMemo, useRef, useState } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";

import { Label } from "@/components/ui/label";
import { allCountries, findCountryByName } from "@/lib/countries";
import { cn } from "@/lib/utils";

/**
 * Searchable country picker.
 *
 * Hand-rolled rather than a combobox dependency: it needs to post two values
 * (the display name and the ISO code) into a plain form, and the whole list is
 * ~250 static rows, so filtering is a trivial `includes`.
 *
 * It fills the country code itself. That field drives the flag on the project
 * card, and asking someone to remember that the Netherlands is NL is exactly
 * the kind of task a computer should do.
 */
export function CountrySelect({
  label,
  nameField,
  codeField,
  defaultName,
  defaultCode,
}: {
  label: string;
  nameField: string;
  codeField: string;
  defaultName?: string | null;
  defaultCode?: string | null;
}) {
  const countries = useMemo(() => allCountries(), []);

  // Seed from the code when it is present, since it is unambiguous; fall back
  // to matching the free-text name the projects were originally written with.
  const initial =
    countries.find(
      (c) => c.code.toUpperCase() === (defaultCode ?? "").toUpperCase(),
    ) ??
    findCountryByName(defaultName) ??
    null;

  const [selected, setSelected] = useState(initial);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter(
      (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase() === q,
    );
  }, [countries, query]);

  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>

      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setOpen((v) => !v);
            setQuery("");
            requestAnimationFrame(() => searchRef.current?.focus());
          }}
          aria-expanded={open}
          aria-haspopup="listbox"
          className="flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 text-sm text-ink outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <span className={cn(!selected && "text-ink-muted/60")}>
            {selected ? `${selected.name} (${selected.code})` : "Select a country"}
          </span>
          <ChevronsUpDown
            className="size-4 shrink-0 text-ink-muted"
            strokeWidth={1.75}
            aria-hidden
          />
        </button>

        {open && (
          <>
            {/* Click-away. Sits behind the panel, above everything else. */}
            <div
              className="fixed inset-0 z-[90]"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <div className="absolute left-0 right-0 top-full z-[91] mt-1 overflow-hidden rounded-lg border border-line bg-surface-nested shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]">
              <div className="flex items-center gap-2 border-b border-line px-3">
                <Search
                  className="size-4 shrink-0 text-ink-muted"
                  strokeWidth={1.75}
                  aria-hidden
                />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setOpen(false);
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (filtered[0]) {
                        setSelected(filtered[0]);
                        setOpen(false);
                      }
                    }
                  }}
                  placeholder="Search countries"
                  className="h-9 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted/60"
                />
              </div>

              <ul role="listbox" className="max-h-60 overflow-y-auto py-1">
                {filtered.length === 0 && (
                  <li className="px-3 py-2 text-sm text-ink-muted">
                    No match.
                  </li>
                )}
                {filtered.map((c) => {
                  const isSelected = selected?.code === c.code;
                  return (
                    <li key={c.code}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          setSelected(c);
                          setOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left text-sm transition-colors",
                          isSelected
                            ? "bg-panel-strong text-ink"
                            : "text-ink-muted hover:bg-panel-strong hover:text-ink",
                        )}
                      >
                        <span>{c.name}</span>
                        <span className="flex items-center gap-2">
                          <span className="text-xs text-ink-muted/70">
                            {c.code}
                          </span>
                          {isSelected && (
                            <Check
                              className="size-3.5 text-brand"
                              strokeWidth={2.5}
                              aria-hidden
                            />
                          )}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </>
        )}
      </div>

      {/* Both values post together; the code is never typed by hand. */}
      <input type="hidden" name={nameField} value={selected?.name ?? ""} />
      <input type="hidden" name={codeField} value={selected?.code ?? ""} />
    </div>
  );
}

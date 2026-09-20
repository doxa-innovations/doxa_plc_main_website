"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

/**
 * Sun/moon icon button that swaps between the two token blocks in globals.css.
 *
 * Icon visibility is driven by the `.dark` / `.light` Tailwind variants
 * against the class next-themes writes on <html>, so the correct icon paints
 * on the first frame with no useEffect/useState dance — the setState-in-effect
 * mount-guard pattern would trip react-hooks/set-state-in-effect under React
 * 19 anyway.
 *
 * Click handler falls back to `dark` if resolvedTheme is undefined on the
 * first client tick, matching the server-rendered default class.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  const toggle = () => {
    setTheme((resolvedTheme ?? "dark") === "dark" ? "light" : "dark");
  };

  return (
    <button
      type="button"
      aria-label="Toggle color theme"
      title="Toggle color theme"
      onClick={toggle}
      className={cn(
        "relative grid size-10 place-items-center rounded-full border border-line bg-panel text-ink-muted transition-colors duration-200 hover:bg-panel-strong hover:text-ink",
        className,
      )}
    >
      {/* Both icons live in the DOM; only the active one is visible. Avoids
          layout thrash between renders and lets each rotate/fade in place.
          The .dark / .light classes are on <html>, so both variants resolve. */}
      <Sun
        aria-hidden
        strokeWidth={2}
        className="absolute size-4 rotate-0 scale-100 opacity-100 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] dark:-rotate-90 dark:scale-0 dark:opacity-0"
      />
      <Moon
        aria-hidden
        strokeWidth={2}
        className="absolute size-4 rotate-90 scale-0 opacity-0 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] dark:rotate-0 dark:scale-100 dark:opacity-100"
      />
    </button>
  );
}

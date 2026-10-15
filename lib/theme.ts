/**
 * Light and dark on the public site.
 *
 * The site follows the visitor's own clock: light from 05:00, dark from
 * 16:00. The footer switch lets a visitor pick the other one, and that choice
 * holds until the next scheduled change (the next 05:00 or 16:00), after which
 * the clock is in charge again.
 *
 * The theme is a `data-theme` attribute on <html>. `globals.css` only applies
 * the light tokens when it is not "dark", so with no JavaScript at all the
 * site is light. /olympus has no `.site-light` wrapper and stays dark either
 * way.
 *
 * As with consent mode, this exports a script SOURCE as well as runtime
 * helpers: `themeBootstrapScript()` runs inline in the document head, during
 * HTML parsing, so the right theme is on <html> before the first paint and a
 * dark-hours visit never flashes white.
 */

export type Theme = "light" | "dark";

export const THEME_KEY = "doxa-theme";

/** Light from this hour (inclusive)... */
const LIGHT_FROM = 5;
/** ...dark from this one. */
const DARK_FROM = 16;

/** The browser's top-bar colour for each theme. */
export const THEME_COLOR: Record<Theme, string> = {
  light: "#fbf9fe",
  dark: "#19003a",
};

/** The theme the clock calls for at `now`, in the visitor's local time. */
export function scheduledTheme(now = new Date()): Theme {
  const h = now.getHours();
  return h >= LIGHT_FROM && h < DARK_FROM ? "light" : "dark";
}

/** The next 05:00 or 16:00 after `now`, local time. */
export function nextSwitch(now = new Date()): Date {
  const at = new Date(now);
  at.setMinutes(0, 0, 0);
  const h = now.getHours();
  if (h < LIGHT_FROM) at.setHours(LIGHT_FROM);
  else if (h < DARK_FROM) at.setHours(DARK_FROM);
  else {
    at.setDate(at.getDate() + 1);
    at.setHours(LIGHT_FROM);
  }
  return at;
}

/** The visitor's pick, if they made one and it has not run out yet. */
export function storedTheme(now = Date.now()): Theme | null {
  try {
    const raw = localStorage.getItem(THEME_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw) as { theme?: unknown; until?: unknown };
    if (
      (saved.theme === "light" || saved.theme === "dark") &&
      typeof saved.until === "number" &&
      saved.until > now
    ) {
      return saved.theme;
    }
    localStorage.removeItem(THEME_KEY);
  } catch {
    // Storage blocked or the value is garbage: fall back to the clock.
  }
  return null;
}

/** Remembers the visitor's pick until the clock would next change it. */
export function storeTheme(theme: Theme) {
  try {
    localStorage.setItem(
      THEME_KEY,
      JSON.stringify({ theme, until: nextSwitch().getTime() }),
    );
  } catch {
    // The switch still works for this page view without storage.
  }
}

export function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

/** Puts `theme` on the document. Colours follow through CSS. */
export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", THEME_COLOR[theme]);
}

/**
 * The inline <head> script. Same rules as above, written out as plain ES5
 * because it runs before any bundle has loaded.
 */
export function themeBootstrapScript(): string {
  return `(function(){var t;try{var s=JSON.parse(localStorage.getItem(${JSON.stringify(
    THEME_KEY,
  )})||"null");if(s&&(s.theme==="light"||s.theme==="dark")&&s.until>Date.now())t=s.theme}catch(e){}if(!t){var h=new Date().getHours();t=h>=${LIGHT_FROM}&&h<${DARK_FROM}?"light":"dark"}document.documentElement.setAttribute("data-theme",t)})();`;
}

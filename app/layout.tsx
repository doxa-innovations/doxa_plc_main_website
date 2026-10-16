import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SITE } from "@/content/site";
import { Toaster } from "@/components/ui/sonner";
import { consentBootstrapScript } from "@/lib/consent-mode";
import { THEME_COLOR, themeBootstrapScript } from "@/lib/theme";

const georama = localFont({
  variable: "--font-georama",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
  src: [
    { path: "./fonts/Georama-Light.ttf", weight: "300", style: "normal" },
    { path: "./fonts/Georama-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Georama-Italic.ttf", weight: "400", style: "italic" },
    { path: "./fonts/Georama-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/Georama-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/Georama-BoldItalic.ttf", weight: "700", style: "italic" },
    { path: "./fonts/Georama-ExtraBold.ttf", weight: "800", style: "normal" },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  // 50 characters. The legal name was in here, which pushed it to 76 and got
  // it cut in results at roughly 60. It still reaches crawlers through
  // og:site_name, the JSON-LD legalName, and the footer, so nothing is lost
  // but the truncation.
  title: {
    default: `Affordable Software Outsourcing · ${SITE.name}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.legalName,
  keywords: [
    "software outsourcing company",
    "affordable web development",
    "Ethiopian software company",
    "outsource website development",
    "custom software development",
    "e-commerce development",
    "React Native app development",
    "hire developers Africa",
    "small business web development",
    "outsource software development",
  ],
  authors: [{ name: SITE.legalName, url: SITE.url }],
  creator: SITE.legalName,
  alternates: { canonical: SITE.url },
  openGraph: {
    type: "website",
    siteName: SITE.legalName,
    locale: "en_US",
    url: SITE.url,
    title: `Affordable Software Outsourcing · ${SITE.name}`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.legalName,
    description: SITE.description,
  },
};

/**
 * The browser chrome colour. Dark here; on the public site ThemeToggle
 * swaps it to the light value whenever the light theme is showing.
 */
export const viewport: Viewport = {
  themeColor: THEME_COLOR.dark,
};

/**
 * The document shell, and nothing else.
 *
 * The marketing chrome (navbar, footer, JSON-LD, consent banner) lives in
 * `app/(site)/layout.tsx` so that the admin panel at /olympus can render
 * without it. Route groups do not affect URLs, so every public path is
 * unchanged.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: the theme script below sets `data-theme` on
    // this element before React hydrates, which React would otherwise report
    // as a mismatch. It only silences this element's own attributes.
    <html
      lang="en"
      className={`dark ${georama.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Light or dark for the public site (lib/theme.ts), set during HTML
            parsing so a visit after 16:00 never flashes the light theme
            first. A few hundred bytes; on /olympus it changes nothing. */}
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript() }} />
        <link rel="preconnect" href="https://cdn.doxaplc.com" crossOrigin="" />
        {/* Google Consent Mode defaults, inline and first.

            This has to execute before the tag manager container does, and it
            has to be a raw inline script rather than next/script to get that
            guarantee: `beforeInteractive` is only permitted in this file and
            only promises to run before Next's own code, whereas an inline
            script in the head runs during HTML parsing, full stop.

            It lives in the ROOT layout while the container itself is mounted
            in `(site)` — the split is what makes the ordering unconditional.
            Costing a few hundred bytes and no network request, it is cheap
            enough to ship on /olympus too. */}
        <script
          dangerouslySetInnerHTML={{ __html: consentBootstrapScript() }}
        />
      </head>
      <body className="min-h-dvh bg-surface font-sans text-ink antialiased">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}

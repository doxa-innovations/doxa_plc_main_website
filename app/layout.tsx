import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SITE } from "@/content/site";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { consentBootstrapScript } from "@/lib/consent-mode";

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
 * Two entries so mobile browsers pick the chrome that matches the active
 * theme. next-themes writes .dark or .light on <html> after hydration; the
 * server ships .dark by default (see RootLayout below), and the OS-preferred
 * value overrides both once the client mounts.
 */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#19003a" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
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
    // suppressHydrationWarning is required by next-themes: the client script
    // rewrites the class attribute on <html> before React hydrates so the
    // stored theme paints on the first frame, and that write shows up as a
    // benign mismatch otherwise.
    <html
      lang="en"
      className={`dark ${georama.variable}`}
      suppressHydrationWarning
    >
      <head>
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
        <ThemeProvider>
          {children}
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}

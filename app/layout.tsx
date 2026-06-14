import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SITE } from "@/content/site";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { Toaster } from "@/components/ui/sonner";
import {
  graph,
  localBusinessSchema,
  organizationSchema,
  websiteSchema,
} from "@/lib/jsonld";

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
  title: {
    default: `${SITE.legalName} — Affordable Software Outsourcing`,
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
    title: `${SITE.legalName} — Affordable Software Outsourcing`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.legalName,
    description: SITE.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={georama.variable}>
      <head>
        <link rel="preconnect" href="https://cdn.doxaplc.com" crossOrigin="" />
      </head>
      <body className="min-h-dvh bg-surface font-sans text-ink antialiased">
        <JsonLd
          schema={graph(
            organizationSchema(),
            websiteSchema(),
            localBusinessSchema(),
          )}
        />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}

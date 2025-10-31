import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import React from "react";

// Make sure these files exist at: src/app/fonts/
const georama = localFont({
    src: [
        { path: "./fonts/Georama-Regular.ttf", weight: "400", style: "normal" },
        { path: "./fonts/Georama-Italic.ttf",    weight: "400", style: "italic" },
        { path: "./fonts/Georama-Bold.ttf",      weight: "700", style: "normal" },
        { path: "./fonts/Georama-BoldItalic.ttf", weight: "700", style: "italic" },
        { path: "./fonts/Georama-Light.ttf",     weight: "300", style: "normal" },
        { path: "./fonts/Georama-BoldItalic.ttf",weight: "700", style: "italic" },
        { path: "./fonts/Georama-Medium.ttf",weight: "500", style: "normal" },
        { path: "./fonts/Georama-ExtraBold.ttf",weight: "900", style: "normal" },
    ],
    display: "swap",
    preload: true,
    fallback: ["system-ui", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
    title: "Doxa Innovations",
    icons: { icon: "/logo.svg" },
    description:
        "Doxa Innovative Software Development PLC is an online creative hub dedicated to helping businesses " +
        "establish a strong and professional brand identity at an affordable price. With a focus on enhancing how businesses " +
        "present themselves to their clients, the studio provides branding solutions that help companies stand out and effectively " +
        "communicate their vision.",
    keywords: [
        "doxa", "doxa innovations", "doksa", "software company", "ethiopian company", "Bee Design Studio", "creative design services",
        "digital branding", "graphic design", "website design", "branding solutions", "logo design", "UI/UX design", "digital marketing",
        "illustration services", "web development", "custom design studio", "modern branding", "social media design", "marketing creatives",
        "visual identity", "motion graphics", "professional design studio", "creative agency", "branding agency", "Bee Design Studio",
        "Ethiopian design company", "creative design services Ethiopia", "digital branding Ethiopia", "graphic design Ethiopia",
        "website design Ethiopia", "branding solutions Ethiopia", "logo design Ethiopia", "UI/UX design Ethiopia", "Ethiopian digital marketing",
        "illustration services Ethiopia", "web development Ethiopia", "custom design studio Ethiopia", "modern branding Ethiopia",
        "Ethiopian creative agency", "social media design Ethiopia", "marketing creatives Ethiopia", "visual identity Ethiopia",
        "motion graphics Ethiopia", "professional design studio Ethiopia", "branding agency Ethiopia", "Ethiopian design and branding services",
    ],
    authors: { name: "Doxa Innovations Software Development PLC" },
    openGraph: {
        title: "Doxa Innovations - Creative Design Services",
        description:
            "Experience cutting-edge design, branding, and web/software development with Doxa Innovations, Ethiopia's premier creative agency.",
        url: "https://beedesign.studio",
        siteName: "Doxa Innovations",
        images: [
            {
                url: "https://beedesign.studio/assets/logo.png",
                width: 1200,
                height: 630,
                alt: "Doxa Innovations Banner",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Doxa Innovations - Creative Design Services",
        description:
            "Doxa Innovations delivers creative solutions for your design, branding, and web development needs. Visit us today!",
        images: ["https://beedesign.studio/assets/logo.png"],
    },
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className={`${georama.className} antialiased`}>{children}</body>
        </html>
    );
}

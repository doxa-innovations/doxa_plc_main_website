import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";
import { allProjectSlugs } from "@/content/projects";

const STATIC_ROUTES = [
  "",
  "/services",
  "/works",
  "/how-it-works",
  "/about",
  "/pricing",
  "/team",
  "/contact",
  "/legal",
  "/faq",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE.url}${route}`,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));

  const projectEntries: MetadataRoute.Sitemap = allProjectSlugs().map(
    (slug) => ({
      url: `${SITE.url}/works/${slug}`,
      changeFrequency: "yearly",
      priority: 0.6,
    }),
  );

  return [...staticEntries, ...projectEntries];
}

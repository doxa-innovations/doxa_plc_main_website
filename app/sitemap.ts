import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";
import { getProjects } from "@/lib/content";

/**
 * `force-dynamic` because project slugs now come from the database.
 *
 * sitemap.ts is a Route Handler that Next prerenders at build time by default,
 * and the Docker build has no database. Generating it per request costs one
 * cached query and keeps newly published work in the sitemap immediately,
 * rather than at the next deploy.
 *
 * /olympus is deliberately absent, and must stay absent. Listing it here, or
 * in robots.txt, publishes the location of the admin panel to every crawler.
 */
export const dynamic = "force-dynamic";

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE.url}${route}`,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));

  const projects = await getProjects();
  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${SITE.url}/works/${project.slug}`,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticEntries, ...projectEntries];
}

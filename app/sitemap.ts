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
  // Deliberately no `lastModified` on the static routes. The only date
  // available for them is the deploy, and stamping every URL with one shared
  // timestamp is worse than omitting it: Google discounts the field entirely
  // once it stops correlating with actual changes.
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE.url}${route}`,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));

  // Projects DO have a real per-URL date, so they get one. `changeFrequency`
  // and `priority` are kept for both, but note Google ignores them; lastmod is
  // the field that actually schedules a recrawl.
  const projects = await getProjects();
  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${SITE.url}/works/${project.slug}`,
    ...(project.updatedAt
      ? { lastModified: new Date(project.updatedAt) }
      : {}),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticEntries, ...projectEntries];
}

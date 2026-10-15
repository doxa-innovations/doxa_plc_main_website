import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/content/types";
import { CountryFlag } from "@/components/CountryFlag";
import { cn } from "@/lib/utils";

/**
 * Portfolio card with a real screenshot and hover lift.
 *
 * `size` sets how much room the card claims on /works:
 * - `default`: the regular tile in a three-column grid.
 * - `large`: one of the two featured tiles under the lead project, in a
 *   two-column row, so the screenshot and the copy both get more room.
 * - `hero`: the lead project, spanning the full width. From lg the
 *   screenshot and the copy sit side by side.
 */
export function ProjectCard({
  project,
  size = "default",
}: {
  project: Project;
  size?: "default" | "large" | "hero";
}) {
  const hero = size === "hero";
  const large = size === "large";

  return (
    <Link
      href={`/works/${project.slug}`}
      className={cn(
        "card-lift group relative flex flex-col overflow-hidden rounded-[1.4rem] border border-line bg-panel focus-visible:outline-2 focus-visible:outline-pj-secondary light:shadow-[0_8px_30px_-16px_rgba(25,0,58,0.2)]",
        hero && "lg:grid lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]",
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden",
          hero ? "aspect-[16/10] lg:aspect-auto lg:min-h-[26rem]" : "aspect-[16/10]",
        )}
      >
        <Image
          src={project.coverImage}
          alt={`${project.client}, ${project.title}`}
          fill
          sizes={
            hero
              ? "(max-width: 1024px) 100vw, 60vw"
              : large
                ? "(max-width: 640px) 100vw, 50vw"
                : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          }
          className={cn(
            "object-cover transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.04]",
            // The bigger frames show the top of the page, where the site's
            // own header and headline are, rather than a slice of the middle.
            (hero || large) && "object-top",
          )}
          priority={hero}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep/80 via-transparent to-transparent" />
        {project.status === "in-development" && (
          <span className="dark absolute left-3 top-3 rounded-full border border-line-strong bg-deep/70 px-2.5 py-1 text-xs font-medium text-ink backdrop-blur-sm">
            In Development
          </span>
        )}
      </div>
      <div
        className={cn(
          "flex flex-1 flex-col",
          hero ? "p-6 sm:p-8 lg:justify-center lg:p-10" : large ? "p-6 sm:p-7" : "p-5",
        )}
      >
        <div className="flex items-center gap-2 text-xs text-ink-muted">
          <CountryFlag code={project.countryCode} className="text-sm" />
          <span>{project.country}</span>
          <span aria-hidden className="text-ink-muted/40">
            ·
          </span>
          <span>{project.industry}</span>
        </div>
        <h3
          className={cn(
            "mt-2 font-display font-semibold text-ink",
            hero ? "text-2xl sm:text-3xl lg:text-4xl" : large ? "text-xl sm:text-2xl" : "text-lg",
          )}
        >
          {project.client}
        </h3>
        <p
          className={cn(
            "font-medium text-brand",
            hero ? "mt-1 text-base sm:text-lg" : large ? "text-base" : "text-sm",
          )}
        >
          {project.title}
        </p>
        <p
          className={cn(
            "mt-2 flex-1 text-ink-muted",
            hero
              ? "mt-4 text-base lg:flex-none"
              : large
                ? "line-clamp-3 text-[0.9375rem]"
                : "line-clamp-2 text-sm",
          )}
        >
          {project.summary}
        </p>
        <span
          className={cn(
            "mt-4 inline-flex items-center gap-1 font-semibold text-ink",
            hero ? "mt-6 text-base" : "text-sm",
          )}
        >
          View project
          <ArrowUpRight
            className="size-4 text-brand transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={1.75}
          />
        </span>
      </div>
    </Link>
  );
}

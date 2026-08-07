import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/content/types";
import { CountryFlag } from "@/components/CountryFlag";

/** Portfolio card, dark glass tile with a real screenshot and hover lift. */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/works/${project.slug}`}
      className="card-lift group relative flex flex-col overflow-hidden rounded-[1.4rem] border border-line bg-panel focus-visible:outline-2 focus-visible:outline-pj-secondary light:shadow-[0_8px_30px_-16px_rgba(25,0,58,0.2)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={project.coverImage}
          alt={`${project.client}, ${project.title}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep/80 via-transparent to-transparent" />
        {project.status === "in-development" && (
          <span className="dark absolute left-3 top-3 rounded-full border border-line-strong bg-deep/70 px-2.5 py-1 text-xs font-medium text-ink backdrop-blur-sm">
            In Development
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs text-ink-muted">
          <CountryFlag code={project.countryCode} className="text-sm" />
          <span>{project.country}</span>
          <span aria-hidden className="text-ink-muted/40">
            ·
          </span>
          <span>{project.industry}</span>
        </div>
        <h3 className="mt-2 font-display text-lg font-semibold text-ink">
          {project.client}
        </h3>
        <p className="text-sm font-medium text-brand">{project.title}</p>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-ink-muted">
          {project.summary}
        </p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ink">
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

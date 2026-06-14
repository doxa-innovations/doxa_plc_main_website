import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/content/types";
import { CountryFlag } from "@/components/CountryFlag";
import { Badge } from "@/components/ui/badge";

/** Portfolio card used on the home Featured Work block and the /works grid. */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/works/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-pj-primary"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-muted">
        <Image
          src={project.coverImage}
          alt={`${project.client} — ${project.title}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {project.status === "in-development" && (
          <Badge className="absolute left-3 top-3 bg-pj-accent text-pj-white">
            In Development
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-sm text-ink/60">
          <CountryFlag code={project.countryCode} className="text-base" />
          <span>{project.country}</span>
          <span aria-hidden>·</span>
          <span>{project.industry}</span>
        </div>
        <h3 className="mt-2 text-lg font-bold text-ink">
          {project.client}
        </h3>
        <p className="text-sm font-medium text-pj-primary">{project.title}</p>
        <p className="mt-2 line-clamp-3 flex-1 text-sm text-ink/70">
          {project.summary}
        </p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-pj-primary">
          View Project
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}

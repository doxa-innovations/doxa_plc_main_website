"use client";

import Link from "next/link";
import { ExternalLink, EyeOff, Star } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { readStringList } from "@/collections/fields/stringList";
import type { Project } from "@/payload-types";
import { cn } from "@/lib/utils";

import { saveProject } from "../actions";
import {
  AddButton,
  DeleteButton,
  DetailDrawer,
  EditButton,
  EditModal,
  EditorShell,
  OpenDetail,
} from "../_components/EditorShell";
import { Area, DetailRow, Field, SelectField } from "../_components/Fields";
import { CountrySelect } from "../_components/CountrySelect";
import { ImageUpload } from "../_components/ImageUpload";
import { PillInput } from "../_components/PillInput";
import { SortableArea, SortableItem } from "../_components/Sortable";

/**
 * Projects as a sortable list.
 *
 * A list rather than cards: there are eleven of them and growing, each
 * identified by a client name, so a vertical list scans faster than a grid and
 * makes the running order obvious, which is the thing being dragged.
 */
export function WorksEditor({ projects }: { projects: Project[] }) {
  return (
    <EditorShell<Project>>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-ink-muted">
          {projects.length} case studies, shown in this order. Drag to
          rearrange.
        </p>
        <AddButton label="Add project" />
      </div>

      {projects.length === 0 ? (
        <p className="rounded-[1.25rem] border border-dashed border-line px-4 py-10 text-center text-sm text-ink-muted">
          No projects yet.
        </p>
      ) : (
        <SortableArea items={projects} collection="projects" layout="list">
          {(project) => (
            <SortableItem key={project.id} id={project.id}>
              {(handle) => (
                <article className="flex items-center gap-2 rounded-[1.25rem] border border-line bg-panel p-3 transition-colors hover:border-line-strong">
                  {handle}

                  <img
                    src={project.coverImage}
                    alt=""
                    className="hidden size-12 shrink-0 rounded-lg border border-line object-cover sm:block"
                  />

                  <OpenDetail record={project} className="min-w-0 flex-1">
                    <p className="truncate font-display text-sm font-semibold text-ink">
                      {project.client}
                    </p>
                    <p className="truncate text-xs text-ink-muted">
                      {project.title}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <Chip>{project.country}</Chip>
                      {project.featured && (
                        <Chip icon={<Star className="size-3" />}>Featured</Chip>
                      )}
                      {project.status === "in-development" && (
                        <Chip>In development</Chip>
                      )}
                      {!project.published && (
                        <Chip icon={<EyeOff className="size-3" />} muted>
                          Hidden
                        </Chip>
                      )}
                    </div>
                  </OpenDetail>

                  <div className="flex shrink-0 items-center gap-1">
                    <EditButton record={project} />
                    <DeleteButton
                      collection="projects"
                      id={project.id}
                      name={project.client}
                    />
                  </div>
                </article>
              )}
            </SortableItem>
          )}
        </SortableArea>
      )}

      <DetailDrawer<Project>
        title={(p) => `${p.client}, ${p.title}`}
        render={(p) => (
          <>
            <img
              src={p.coverImage}
              alt=""
              className="mb-4 aspect-video w-full rounded-lg border border-line object-cover"
            />
            <dl>
              <DetailRow label="Client" value={p.client} />
              <DetailRow label="Title" value={p.title} />
              <DetailRow
                label="Country"
                value={`${p.country} (${p.countryCode})`}
              />
              <DetailRow label="Industry" value={p.industry} />
              <DetailRow label="Summary" value={p.summary} />
              <DetailRow label="The need" value={p.problem} />
              <DetailRow label="The solution" value={p.whatWeBuilt} />
              <DetailRow
                label="Tech stack"
                value={
                  <div className="flex flex-wrap gap-1.5">
                    {readStringList(p.techStack).map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-line bg-panel-strong px-2 py-0.5 text-xs"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                }
              />
              <DetailRow label="Testimonial" value={p.testimonial?.quote} />
              <DetailRow
                label="Live site"
                value={
                  p.liveUrl ? (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-brand hover:underline"
                    >
                      {p.liveUrl.replace(/^https?:\/\//, "")}
                      <ExternalLink className="size-3" aria-hidden />
                    </a>
                  ) : null
                }
              />
              <DetailRow
                label="Status"
                value={p.status === "live" ? "Live" : "In development"}
              />
              <DetailRow label="Featured" value={p.featured ? "Yes" : "No"} />
              <DetailRow
                label="Published"
                value={p.published ? "Live" : "Hidden"}
              />
              <DetailRow
                label="On the site"
                value={
                  <Link
                    href={`/works/${p.slug}`}
                    target="_blank"
                    className="text-brand hover:underline"
                  >
                    /works/{p.slug}
                  </Link>
                }
              />
            </dl>
          </>
        )}
      />

      <EditModal<Project>
        action={saveProject}
        title={(p) => (p ? `Edit ${p.client}` : "New project")}
        description="The URL slug is generated from the client and title when a project is created, and is not editable afterwards because changing it breaks every existing link."
        render={(p) => (
          <>
            <Field label="Client" name="client" defaultValue={p?.client} required />
            <Field label="Title" name="title" defaultValue={p?.title} required />

            <CountrySelect
              label="Country"
              nameField="country"
              codeField="countryCode"
              defaultName={p?.country}
              defaultCode={p?.countryCode}
            />
            <Field label="Industry" name="industry" defaultValue={p?.industry} />

            <Area
              label="Summary"
              name="summary"
              defaultValue={p?.summary}
              rows={2}
              hint="The card blurb and the page description."
            />
            <Area
              label="The need"
              name="problem"
              defaultValue={p?.problem}
              rows={3}
            />
            <Area
              label="The solution"
              name="whatWeBuilt"
              defaultValue={p?.whatWeBuilt}
              rows={4}
            />

            <PillInput
              label="Tech stack"
              name="techStack"
              defaultValues={readStringList(p?.techStack)}
              placeholder="React, then Enter"
            />

            <ImageUpload
              label="Cover image"
              name="coverImage"
              defaultValue={p?.coverImage}
              hint="Shown on the works grid and at the top of the case study."
            />
            <ImageUpload
              label="Client logo"
              name="logo"
              defaultValue={p?.logo}
              aspect="aspect-square"
            />

            <Field
              label="Live URL"
              name="liveUrl"
              type="url"
              defaultValue={p?.liveUrl}
              wide
              hint="Leave empty for in-house or unreleased work."
            />

            <Area
              label="Testimonial quote"
              name="testimonialQuote"
              defaultValue={p?.testimonial?.quote}
              rows={2}
              hint="Optional. Adding one also publishes a Review in the page's structured data."
            />
            <Field
              label="Testimonial name"
              name="testimonialName"
              defaultValue={p?.testimonial?.name}
            />
            <Field
              label="Testimonial role"
              name="testimonialRole"
              defaultValue={p?.testimonial?.role}
            />

            <SelectField
              label="Status"
              name="status"
              defaultValue={p?.status ?? "live"}
              options={[
                { label: "Live", value: "live" },
                { label: "In development", value: "in-development" },
              ]}
            />

            <div className="space-y-3 sm:col-span-2">
              <Switch
                name="featured"
                label="Featured"
                defaultChecked={Boolean(p?.featured)}
                hint="Shows in the Featured Work block on the homepage."
              />
              <Switch
                name="published"
                label="Published"
                defaultChecked={p ? Boolean(p.published) : true}
                hint="Turn off to hide from the site without deleting."
              />
            </div>
          </>
        )}
      />
    </EditorShell>
  );
}

function Chip({
  children,
  icon,
  muted,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-line px-2 py-0.5 text-[0.65rem] text-ink-muted",
        muted ? "bg-panel-strong" : "bg-panel",
      )}
    >
      {icon}
      {children}
    </span>
  );
}

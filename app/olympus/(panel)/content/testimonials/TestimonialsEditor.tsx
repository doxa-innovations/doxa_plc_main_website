"use client";

import { EyeOff, Star } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import type { Testimonial } from "@/payload-types";
import { cn } from "@/lib/utils";

import { saveTestimonial } from "../actions";
import {
  AddButton,
  DeleteButton,
  DetailDrawer,
  EditButton,
  EditModal,
  EditorShell,
  OpenDetail,
} from "../_components/EditorShell";
import { Area, DetailRow, Field } from "../_components/Fields";
import { ImageUpload } from "../_components/ImageUpload";
import { SortableArea, SortableItem } from "../_components/Sortable";

/**
 * Testimonials as draggable cards.
 *
 * The full editor, unlike the services one: this collection is meant to grow,
 * so add, delete and reorder are all here.
 */

/** "May 2026", or an empty string. Matches how the public card reads. */
function monthYear(value?: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** The value a `<input type="date">` needs: yyyy-mm-dd, or empty. */
function dateInputValue(value?: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function Stars({ rating }: { rating: number }) {
  return (
    <span
      className="inline-flex items-center gap-0.5"
      aria-label={`Rated ${rating} out of 5`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "size-3.5",
            i < rating ? "fill-pj-secondary text-pj-secondary" : "text-line-strong",
          )}
          strokeWidth={1.5}
          aria-hidden
        />
      ))}
    </span>
  );
}

export function TestimonialsEditor({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  return (
    <EditorShell<Testimonial>>
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-ink-muted">
            {testimonials.length} testimonials, scrolling left to right in this
            order. Drag to rearrange.
          </p>
          <AddButton label="Add testimonial" />
        </div>

        {testimonials.length === 0 ? (
          <p className="rounded-[1.25rem] border border-dashed border-line px-4 py-10 text-center text-sm text-ink-muted">
            No testimonials yet. The section stays hidden on the home page until
            there is at least one.
          </p>
        ) : (
          <SortableArea
            items={testimonials}
            collection="testimonials"
            layout="grid"
          >
            {(testimonial) => (
              <SortableItem key={testimonial.id} id={testimonial.id}>
                {(handle) => (
                  <article className="flex h-full flex-col rounded-[1.25rem] border border-line bg-panel p-4 transition-colors hover:border-line-strong">
                    <div className="mb-2 flex items-center gap-1">
                      {handle}
                      <span className="min-w-0 flex-1 truncate font-display text-sm font-semibold text-ink">
                        {testimonial.name}
                      </span>
                      <EditButton record={testimonial} />
                      <DeleteButton
                        collection="testimonials"
                        id={testimonial.id}
                        name={testimonial.name}
                      />
                    </div>

                    <OpenDetail record={testimonial} className="flex-1">
                      <Stars rating={testimonial.rating} />
                      <p className="mt-2 line-clamp-3 text-xs text-ink-muted">
                        {testimonial.quote}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {testimonial.role && <Chip>{testimonial.role}</Chip>}
                        {monthYear(testimonial.date) && (
                          <Chip>{monthYear(testimonial.date)}</Chip>
                        )}
                        {!testimonial.published && (
                          <Chip icon={<EyeOff className="size-3" />} muted>
                            Hidden
                          </Chip>
                        )}
                      </div>
                    </OpenDetail>
                  </article>
                )}
              </SortableItem>
            )}
          </SortableArea>
        )}
      </section>

      <DetailDrawer<Testimonial>
        title={(t) => t.name}
        render={(t) => (
          <dl>
            <DetailRow label="Rating" value={<Stars rating={t.rating} />} />
            <DetailRow label="Quote" value={t.quote} />
            <DetailRow label="Role & company" value={t.role} />
            <DetailRow label="Date" value={monthYear(t.date)} />
            <DetailRow
              label="Photo"
              value={t.photo ? "Set" : "None, shows initials"}
            />
            <DetailRow
              label="Published"
              value={t.published ? "Live" : "Hidden"}
            />
          </dl>
        )}
      />

      <EditModal<Testimonial>
        action={saveTestimonial}
        title={(t) => (t ? `Edit ${t.name}` : "New testimonial")}
        description="Only add quotes people actually gave you. Everything here is shown publicly under their name."
        render={(t) => (
          <>
            <Field label="Name" name="name" defaultValue={t?.name} required />
            <Field
              label="Rating"
              name="rating"
              type="number"
              defaultValue={t?.rating ?? 5}
              required
              hint="Whole stars, 1 to 5."
            />
            <Area
              label="Quote"
              name="quote"
              defaultValue={t?.quote}
              rows={4}
              hint="Their words. Leave the quote marks off, the card draws them."
            />
            <Field
              label="Role & company"
              name="role"
              defaultValue={t?.role}
              required
              placeholder="CEO at Three Roots International"
              hint="What makes them worth listening to. Include the organisation."
            />
            <Field
              label="Date"
              name="date"
              type="date"
              defaultValue={dateInputValue(t?.date)}
              hint="Shown as the month and year."
            />
            <ImageUpload
              label="Photo"
              name="photo"
              defaultValue={t?.photo}
              aspect="aspect-square"
              hint="Optional. Without one the card shows their initials."
            />
            <div className="sm:col-span-2">
              <Switch
                name="published"
                label="Published"
                defaultChecked={t ? Boolean(t.published) : true}
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
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.65rem]",
        muted
          ? "border-line bg-panel-strong text-ink-muted"
          : "border-line bg-panel text-ink-muted",
      )}
    >
      {icon}
      {children}
    </span>
  );
}

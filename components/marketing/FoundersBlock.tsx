import Image from "next/image";
import type { TeamMember } from "@/content/types";
import { cn } from "@/lib/utils";
import { JsonLd } from "@/components/seo/JsonLd";
import { graph, personSchema } from "@/lib/jsonld";
import {
  FounderShape,
  founderShapeAt,
  type FounderShapeName,
} from "@/components/visual/FounderShape";

/**
 * The founders, in a deliberately different card to the team grid.
 *
 * Where TeamGrid is a compact centred badge-card, this is a tall portrait
 * card: the photo, then the name, a hairline, the bio and the areas each
 * founder owns. The difference in shape is the point — it signals a different
 * kind of person on the page without needing a label to say so.
 *
 * The PHOTO half is the polygon treatment carried over from the previous
 * doxaplc.com: no panel fill, no border, no clipping box, just a hand-drawn
 * shape behind a cut-out figure. It only works because the founder photos are
 * cut-outs with a real alpha channel, framed head-and-shoulders with the crown
 * near the top edge — a rectangular photo with a background of its own renders
 * as a rectangle sitting on a polygon. The text half below is unchanged.
 *
 * Emits its own Person JSON-LD, because these members are filtered out of
 * TeamGrid and would otherwise vanish from the structured data.
 */
function FounderCard({
  member,
  shape,
  compact,
}: {
  member: TeamMember;
  shape: FounderShapeName;
  compact: boolean;
}) {
  return (
    <article className="group flex flex-col">
      {/* The stage is square because the cut-outs are, so `object-contain`
          lands every founder's crown and shoulder line at the same height and
          the three shapes sit on one baseline across the row.

          The percentages are measured off the old site, not guessed. What
          makes the treatment read is the shape being about 2.7x the width of
          the head, with the crown sitting INSIDE the top edge rather than
          clearing it — a shape only slightly wider than the head turns into
          two purple wings behind the shoulders. A head is ~34% of a correctly
          framed cut-out's width, so the shape lands at ~92% of the stage and
          the photo is inset from the top to leave it the headroom. */}
      <div className="relative aspect-square w-full">
        {/* The polygon's outline is #19003a, near enough the canvas colour to
            disappear into it. The glow is what stops the shape reading as a
            flat sticker, lighting it from behind the way the rest of the site
            lights its marks. */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 size-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pj-primary/25 blur-[60px]"
        />

        {/* `drop-shadow`, not `box-shadow`, and on a wrapper OUTSIDE the masked
            element below. There is no box here to cast a shadow — just a
            polygon and a cut-out figure on a transparent stage — so a
            box-shadow draws the container's rectangle as a halo around empty
            space. A drop-shadow reads the alpha channel, so the glow traces the
            polygon's edges and the shoulders instead.

            It has to sit outside the mask: masking is applied AFTER filtering,
            so a filter on the masked element itself would have its shadow
            clipped away at that element's box, which is no shadow at all. */}
        <div className="absolute inset-0 transition-[transform,filter] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-1 group-hover:drop-shadow-[0_16px_22px_rgba(124,60,180,0.55)]">
          {/* The cut-outs end at the chest, so the composition has to be faded
              out or it stops in a razor-straight line halfway down the section.
              The old card hid that edge under a gradient to the panel colour,
              which is no longer available — there is no panel, and the aurora
              canvas behind is not one flat colour to fade to. A mask fades the
              pixels themselves, so it works over whatever is behind.

              The mask covers the shape AND the figure, not the figure alone.
              Fading only the figure makes the torso go translucent while the
              polygon behind it stays solid, so the shape's outline shows
              straight through his arm — it reads as a compositing bug rather
              than a crop. Faded together, the whole composition just ends.

              Inline, not an arbitrary Tailwind value: a `mask-image` utility
              holding a gradient is exactly the silent-failure case in
              CLAUDE.md, and a mask that emits no rule leaves the hard edge
              back. */}
          <div
            className="absolute inset-0"
            style={{
              maskImage:
                "linear-gradient(to bottom, #000 82%, rgba(0, 0, 0, 0) 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, #000 82%, rgba(0, 0, 0, 0) 100%)",
            }}
          >
            <FounderShape
              name={shape}
              className="pointer-events-none absolute left-1/2 top-[4%] w-[92%] -translate-x-1/2"
            />

            {/* The photo has no hover of its own — the wrapper above moves it.
                The old `scale-[1.02]` is gone with the box that clipped it (an
                unclipped cut-out growing past its shape reads as a glitch) and
                `grayscale-0` did nothing, since all three photos are already
                monochrome.

                `grayscale` itself stays for the next photo: a colour cut-out
                uploaded in /olympus would otherwise break the row. */}
            <div className="absolute inset-x-[6%] bottom-0 top-[12%]">
              <Image
                src={member.photo}
                alt={member.name}
                fill
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 340px"
                unoptimized
                className="object-contain object-bottom grayscale"
              />
            </div>
          </div>
        </div>
      </div>

      {/* The panel, the border and the radius stay exactly where they were —
          only the PHOTO came out of the box.

          This is where the rectangular shadow belongs, because this is the only
          part of the card that IS a rectangle. `card-lift` used to sit on the
          article and drew its box around the photo stage too, haloing empty
          space. Same numbers as `card-lift`, driven by `group-hover` so the
          panel and the portrait still lift together as one card. */}
      <div
        className={cn(
          "flex flex-1 flex-col rounded-[1.6rem] border border-line bg-panel transition-[transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-1 group-hover:border-line-strong group-hover:shadow-[0_30px_80px_-30px_rgba(124,60,180,0.9)]",
          compact ? "p-5" : "p-6",
        )}
      >
        <h3
          className={cn(
            "font-display font-semibold tracking-[-0.02em] text-ink",
            compact ? "text-lg" : "text-xl",
          )}
        >
          {member.name}
        </h3>
        <p className="mt-1 text-sm font-medium text-brand">{member.role}</p>

        <div
          aria-hidden
          className={cn("h-px w-full bg-line", compact ? "my-4" : "my-5")}
        />

        {/* The bio is the long-form detail — it belongs on /team, not in the
            condensed block that only previews the founders. */}
        {!compact && (
          <p className="text-sm leading-relaxed text-ink-muted">{member.bio}</p>
        )}

        {member.expertise.length > 0 &&
          (compact ? (
            // Pills: each area of ownership reads as its own object, which is
            // what makes the condensed card scannable without the bio.
            <ul className="flex flex-wrap gap-1.5">
              {member.expertise.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-line bg-panel-strong px-2.5 py-1 text-xs font-medium text-ink-muted"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : (
            <ul className="mt-5 space-y-2">
              {member.expertise.map((tag) => (
                <li
                  key={tag}
                  className="flex items-start gap-2.5 text-sm text-ink-muted"
                >
                  <span
                    aria-hidden
                    className="mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-pj-secondary"
                  />
                  {tag}
                </li>
              ))}
            </ul>
          ))}

        {member.social.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {member.social.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-line px-3 py-1 text-xs font-medium text-ink-muted transition-colors duration-200 hover:border-line-strong hover:text-ink"
              >
                {s.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

/**
 * `compact` is the preview form used on /about: shorter card, no bio, and the
 * areas of ownership as pills rather than a bulleted list.
 */
export function FoundersBlock({
  members,
  compact = false,
}: {
  members: TeamMember[];
  compact?: boolean;
}) {
  if (members.length === 0) return null;

  return (
    <>
      <div
        className={cn(
          "mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
          compact ? "max-w-4xl" : "max-w-5xl",
        )}
      >
        {members.map((member, i) => (
          <FounderCard
            key={member.slug}
            member={member}
            shape={founderShapeAt(i)}
            compact={compact}
          />
        ))}
      </div>
      <JsonLd schema={graph(...members.map((m) => personSchema(m)))} />
    </>
  );
}

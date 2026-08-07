import Image from "next/image";
import type { TeamMember } from "@/content/types";
import { cn } from "@/lib/utils";
import { JsonLd } from "@/components/seo/JsonLd";
import { graph, personSchema } from "@/lib/jsonld";

/**
 * The founders, in a deliberately different card to the team grid.
 *
 * Where TeamGrid is a compact centred badge-card, this is a tall portrait
 * card: a large photo, then the name, a hairline, the bio and the areas each
 * founder owns. The difference in shape is the point — it signals a different
 * kind of person on the page without needing a label to say so.
 *
 * Emits its own Person JSON-LD, because these members are filtered out of
 * TeamGrid and would otherwise vanish from the structured data.
 */
function FounderCard({
  member,
  compact,
}: {
  member: TeamMember;
  compact: boolean;
}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-[1.6rem] border border-line bg-panel shadow-[0_40px_90px_-50px_rgba(124,60,180,0.6)] transition-[transform,border-color] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 hover:border-line-strong">
      <div
        className={cn(
          "relative w-full overflow-hidden bg-surface-muted",
          compact ? "aspect-[5/4]" : "aspect-[4/5]",
        )}
      >
        <Image
          src={member.photo}
          alt={member.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
          unoptimized
          className="object-cover object-top grayscale transition-[filter,transform] duration-500 group-hover:grayscale-0 group-hover:scale-[1.02]"
        />
        {/* Fades the portrait into the card so there is no hard photo edge. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-panel via-transparent to-transparent"
        />
      </div>

      <div className={cn("flex flex-1 flex-col", compact ? "p-5" : "p-6")}>
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
 * `compact` is the preview form used on /about: shorter photo, no bio, and
 * the areas of ownership as pills rather than a bulleted list.
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
        {members.map((member) => (
          <FounderCard key={member.slug} member={member} compact={compact} />
        ))}
      </div>
      <JsonLd schema={graph(...members.map((m) => personSchema(m)))} />
    </>
  );
}

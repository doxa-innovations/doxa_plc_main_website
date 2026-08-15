import Image from "next/image";
import type { TeamMember } from "@/content/types";
import { Badge } from "@/components/ui/badge";
import { JsonLd } from "@/components/seo/JsonLd";
import { graph, personSchema } from "@/lib/jsonld";

/**
 * `card-lift` rather than a hover of its own, so this matches the founder panel
 * on the same page: the same 4px rise, the same border lift, and the same
 * violet glow pooling underneath. It used to rise half as far with no glow at
 * all, and carried `hover:bg-panel` on top of `bg-panel` — a no-op — so the
 * card barely reacted next to the founders above it.
 *
 * The shared class is also where the glow's arithmetic is documented (see
 * globals.css): the negative spread means a tile under 60px tall paints no
 * shadow at all. These cards are far taller than that.
 */
function TeamCard({ member, showBio }: { member: TeamMember; showBio: boolean }) {
  return (
    <div className="card-lift group flex flex-col items-center rounded-[1.4rem] border border-line bg-panel p-6 text-center">
      <div className="relative size-28 overflow-hidden rounded-full bg-surface-muted ring-2 ring-pj-secondary/30">
        <Image
          src={member.photo}
          alt={member.name}
          fill
          sizes="112px"
          unoptimized
          className="object-cover grayscale transition-[filter] duration-500 group-hover:grayscale-0"
        />
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold text-ink">
        {member.name}
      </h3>
      <p className="text-sm font-medium text-brand">{member.role}</p>
      <div className="mt-3 flex flex-wrap justify-center gap-1.5">
        {member.expertise.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="border border-line bg-panel font-normal text-ink-muted"
          >
            {tag}
          </Badge>
        ))}
      </div>
      {showBio && <p className="mt-4 text-sm text-ink-muted">{member.bio}</p>}
    </div>
  );
}

/** Team member cards + Person JSON-LD for every member. */
/**
 * Members come in as a prop rather than being imported.
 *
 * They now live in the CMS, and fetching inside a shared presentational
 * component would either force it async at every call site or duplicate the
 * query on pages that render it twice. The server page fetches once and passes
 * the list down; the Person structured data is still built from the SAME
 * objects the cards render.
 */
export function TeamGrid({
  members,
  showBios = false,
}: {
  members: TeamMember[];
  showBios?: boolean;
}) {
  if (members.length === 0) return null;

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <TeamCard key={member.slug} member={member} showBio={showBios} />
        ))}
      </div>
      <JsonLd schema={graph(...members.map((m) => personSchema(m)))} />
    </>
  );
}

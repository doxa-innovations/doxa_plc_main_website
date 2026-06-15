import Image from "next/image";
import type { TeamMember } from "@/content/types";
import { TEAM } from "@/content/team";
import { Badge } from "@/components/ui/badge";
import { JsonLd } from "@/components/seo/JsonLd";
import { graph, personSchema } from "@/lib/jsonld";

function TeamCard({ member, showBio }: { member: TeamMember; showBio: boolean }) {
  return (
    <div className="group flex flex-col items-center rounded-[1.4rem] border border-white/10 bg-white/[0.02] p-6 text-center transition-[transform,border-color,background-color] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.04]">
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
      <p className="text-sm font-medium text-pj-secondary">{member.role}</p>
      <div className="mt-3 flex flex-wrap justify-center gap-1.5">
        {member.expertise.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="border border-white/10 bg-white/[0.05] font-normal text-ink-muted"
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
export function TeamGrid({ showBios = false }: { showBios?: boolean }) {
  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {TEAM.map((member) => (
          <TeamCard key={member.slug} member={member} showBio={showBios} />
        ))}
      </div>
      <JsonLd schema={graph(...TEAM.map((m) => personSchema(m)))} />
    </>
  );
}

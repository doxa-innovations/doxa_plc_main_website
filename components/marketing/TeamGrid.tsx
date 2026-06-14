import Image from "next/image";
import type { TeamMember } from "@/content/types";
import { TEAM } from "@/content/team";
import { Badge } from "@/components/ui/badge";
import { JsonLd } from "@/components/seo/JsonLd";
import { graph, personSchema } from "@/lib/jsonld";

function TeamCard({ member, showBio }: { member: TeamMember; showBio: boolean }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-border bg-surface p-6 text-center">
      <div className="relative size-28 overflow-hidden rounded-full bg-surface-muted ring-2 ring-pj-primary/15">
        <Image
          src={member.photo}
          alt={member.name}
          fill
          sizes="112px"
          className="object-cover"
        />
      </div>
      <h3 className="mt-4 text-lg font-bold text-ink">{member.name}</h3>
      <p className="text-sm font-medium text-pj-primary">{member.role}</p>
      <div className="mt-3 flex flex-wrap justify-center gap-1.5">
        {member.expertise.map((tag) => (
          <Badge key={tag} variant="secondary" className="font-normal">
            {tag}
          </Badge>
        ))}
      </div>
      {showBio && (
        <p className="mt-4 text-sm text-ink/70">{member.bio}</p>
      )}
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

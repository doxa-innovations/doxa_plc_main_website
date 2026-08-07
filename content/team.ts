import type { TeamMember } from "./types";

const CDN = "https://cdn.doxaplc.com/doxa-public";

/**
 * The founding team. Real names and photos are the single most powerful trust
 * signal for international clients, these drive /team, the About team grid,
 * and Person JSON-LD. (social URLs TODO: confirm before launch.)
 */
export const TEAM: TeamMember[] = [
  {
    slug: "ephrem-kebede",
    name: "Ephrem Kebede",
    role: "Co-Founder & Manager",
    founder: true,
    expertise: ["Full-Stack Engineering", "Systems Architecture", "DevOps"],
    bio: "Full-Stack Engineer and Systems Architect with 5+ years building with Next.js, Laravel, and containerized microservices. Ephrem oversees infrastructure strategy and DevOps, making sure what we ship is reliable and built to last.",
    photo: `${CDN}/EphremBW.png`,
    social: [],
  },
  {
    slug: "gedion-girma",
    name: "Gedion Girma",
    role: "Co-Founder & Lead Developer",
    founder: true,
    expertise: ["Full-Stack Engineering", "Project Execution", "Operations"],
    bio: "Full-Stack Engineer and Operations Strategist who bridges technology and project management. Gedion leads project execution and workflow optimization, keeping delivery on track and clients informed.",
    photo: `${CDN}/Gedion.avif`,
    social: [],
  },
  {
    slug: "cherinet-demeke",
    name: "Cherinet Demeke",
    role: "Co-Founder & Vice Manager",
    founder: true,
    expertise: ["UI/UX Design", "Front-End Development", "Brand Strategy"],
    bio: "UI/UX Designer and Front-End Developer who leads our visual identity and design systems. With a background in design systems, media production, and brand strategy, Cherinet makes sure every product looks as good as it works.",
    photo: `${CDN}/Cheri.avif`,
    social: [],
  },
  // TODO: replace name, role, expertise, bio, and photo with the real 4th
  // member's details (the client will provide these).
  {
    slug: "new-team-member",
    name: "New Team Member",
    role: "Software Engineer",
    founder: false,
    expertise: ["Engineering"],
    bio: "Details coming soon. This card is a placeholder for our newest team member.",
    photo: "https://picsum.photos/seed/doxa-member-4/600/600",
    social: [],
  },
];

export function getTeamMemberBySlug(slug: string): TeamMember | undefined {
  return TEAM.find((m) => m.slug === slug);
}

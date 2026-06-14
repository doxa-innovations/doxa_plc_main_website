import type { TeamMember } from "./types";

const CDN = "https://cdn.doxaplc.com/doxa-public";

/**
 * The founding team. Real names and photos are the single most powerful trust
 * signal for international clients — these drive /team, the About team grid,
 * and Person JSON-LD. (social URLs TODO: confirm before launch.)
 */
export const TEAM: TeamMember[] = [
  {
    slug: "ephrem-kebede",
    name: "Ephrem Kebede",
    role: "Co-Founder & Manager",
    expertise: ["Full-Stack Engineering", "Systems Architecture", "DevOps"],
    bio: "Full-Stack Engineer and Systems Architect with 5+ years building with Next.js, Laravel, and containerized microservices. Ephrem oversees infrastructure strategy and DevOps, making sure what we ship is reliable and built to last.",
    photo: `${CDN}/EphremBW.png`,
    social: [],
  },
  {
    slug: "gedion-girma",
    name: "Gedion Girma",
    role: "Co-Founder & Lead Developer",
    expertise: ["Full-Stack Engineering", "Project Execution", "Operations"],
    bio: "Full-Stack Engineer and Operations Strategist who bridges technology and project management. Gedion leads project execution and workflow optimization, keeping delivery on track and clients informed.",
    photo: `${CDN}/Gedion.avif`,
    social: [],
  },
  {
    slug: "cherinet-demeke",
    name: "Cherinet Demeke",
    role: "Co-Founder & Vice Manager",
    expertise: ["UI/UX Design", "Front-End Development", "Brand Strategy"],
    bio: "UI/UX Designer and Front-End Developer who leads our visual identity and design systems. With a background in design systems, media production, and brand strategy, Cherinet makes sure every product looks as good as it works.",
    photo: `${CDN}/Cheri.avif`,
    social: [],
  },
];

export function getTeamMemberBySlug(slug: string): TeamMember | undefined {
  return TEAM.find((m) => m.slug === slug);
}

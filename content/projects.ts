import type { Project } from "./types";

const CDN = "https://cdn.doxaplc.com/doxa-public";

// NOTE: Scholten Pattern Works has no screenshot on the CDN yet, logo/cover
// fall back to the company mark as a labeled placeholder. Replace with real
// screenshots before launch (see pre-launch checklist).
const PLACEHOLDER_IMAGE = `${CDN}/logo.png`;

/**
 * Portfolio projects, restructured from the legacy FileDatabase plus the two
 * additions called for in the plan doc (Scholten Pattern Works, MySeed). The
 * placeholder entry was dropped. Each item drives the /works grid, its
 * /works/[slug] case study, the home Featured Work block, and CreativeWork
 * JSON-LD.
 */
export const PROJECTS: Project[] = [
  {
    slug: "kla-construction-equipment",
    title: "Custom E-Commerce Platform",
    client: "KLA Construction Equipment",
    country: "United States",
    countryCode: "US",
    industry: "Construction Equipment Retail",
    summary:
      "A custom e-commerce platform that replaced eBay, syncing live inventory through the eBay API so customers can buy direct at exclusive discounts.",
    problem:
      "KLA sold through eBay and wanted to own their storefront, control the buying experience, and offer direct, discounted purchasing without losing inventory sync.",
    whatWeBuilt:
      "A custom e-commerce platform replacing eBay, with eBay API integration to keep inventory in sync. Customers buy direct with exclusive discounts, and KLA manages everything from one admin.",
    techStack: ["React", "Laravel", "MySQL", "Redis", "Tailwind CSS"],
    liveUrl: "https://klaconstructionequipment.com",
    logo: `${CDN}/kla.svg`,
    coverImage: `${CDN}/kla_cover.png`,
    featured: true,
    status: "live",
    order: 1,
  },
  {
    slug: "zoa-international",
    title: "Disability Program Database System",
    client: "ZOA International",
    country: "Netherlands",
    countryCode: "NL",
    industry: "International Humanitarian Aid",
    summary:
      "An offline-first database system and public website with a REST API for tracking programs for people with disabilities in Ethiopia.",
    problem:
      "ZOA needed to track programs for people with disabilities across low-bandwidth Ethiopian field sites, detect cross-site duplicates without exposing personal data, and hand the system over for long-term local ownership.",
    whatWeBuilt:
      "An offline-first Progressive Web App for low-bandwidth environments, with rule-based duplicate detection that flags duplicates without exposing PII, bilingual Amharic/English interfaces, role-based access with 2FA, encrypted storage and audit trails, and containerized deployment on ZOA's VPS with automated backups and a clear handover plan.",
    techStack: ["React", "PWA", "Laravel", "MySQL", "Docker", "REST APIs"],
    liveUrl: "https://www.zoa-international.com/ethiopia",
    logo: `${CDN}/ZOA.svg`,
    coverImage: `${CDN}/zoa_web.avif`,
    featured: true,
    status: "live",
    order: 2,
  },
  {
    slug: "scholten-pattern-works",
    title: "Brand & Informational Platform",
    client: "Scholten Pattern Works",
    country: "United States",
    countryCode: "US",
    industry: "Industrial Manufacturing",
    summary:
      "A bespoke informational platform with end-to-end branding and a custom CMS for a Wisconsin manufacturer.",
    problem:
      "Scholten needed a credible online presence and a cohesive brand identity to match the precision of their manufacturing work.",
    whatWeBuilt:
      "A full bespoke informational platform, end-to-end branding (logo, colors, typography), and a custom CMS so the team can keep content current themselves.",
    techStack: ["Laravel", "Livewire", "Tailwind CSS"],
    liveUrl: "https://spw.doxaplc.com",
    logo: PLACEHOLDER_IMAGE,
    coverImage: PLACEHOLDER_IMAGE,
    featured: false,
    status: "live",
    order: 3,
  },
  {
    slug: "myseed-school-of-insight",
    title: "Exam-Prep Learning Platform",
    client: "MySeed School of Insight",
    country: "Ethiopia",
    countryCode: "ET",
    industry: "Education / Exam Prep",
    summary:
      "A full educational platform with video streaming for grade-12 national exam preparation.",
    problem:
      "MySeed needed to deliver exam-prep lessons as streaming video to students across Ethiopia, reliably and affordably.",
    whatWeBuilt:
      "A full educational platform with secure video streaming via Cloudflare Stream, structured courses for grade-12 exam preparation, and a GraphQL-powered content backend.",
    techStack: ["Next.js", "Laravel", "GraphQL", "Cloudflare Stream", "Tailwind CSS"],
    liveUrl: "https://myseed.et",
    logo: `${CDN}/myseed.png`,
    coverImage: `${CDN}/myseed.png`,
    featured: true,
    status: "live",
    order: 4,
  },
  {
    slug: "maor-lutheran-seminary",
    title: "Seminary Website",
    client: "Maor Lutheran Theological Seminary",
    country: "Ethiopia",
    countryCode: "ET",
    industry: "Theological Education",
    summary:
      "A modern, responsive institutional website for the Lutheran Church of Ethiopia's seminary.",
    problem:
      "MLTS needed a professional online home to present its programs and its grounding in Holy Scripture and the Lutheran Confessions.",
    whatWeBuilt:
      "A modern, responsive institutional website with a Filament-powered admin so staff can manage content, presenting the seminary that equips pastors, teachers, and evangelists.",
    techStack: ["React", "Laravel", "Filament", "Tailwind CSS"],
    liveUrl: "https://mlts.lcechurch.org",
    logo: `${CDN}/maor.png`,
    coverImage: `${CDN}/mlts_cover.avif`,
    featured: false,
    status: "live",
    order: 5,
  },
  {
    slug: "classic-noodle-burger",
    title: "Restaurant Website",
    client: "Classic Noodle & Burger",
    country: "Ethiopia",
    countryCode: "ET",
    industry: "Food & Beverage",
    summary:
      "A restaurant website with a dynamic menu-management backend for a Bishoftu eatery.",
    problem:
      "Classic Noodle & Burger wanted an inviting online presence and an easy way to keep their menu current.",
    whatWeBuilt:
      "A stylish restaurant website with a dynamic menu-management backend, bringing the Bishoftu fusion of noodles and burgers online for every occasion.",
    techStack: ["React", "Laravel", "MySQL", "Tailwind CSS"],
    liveUrl: "https://classicnoodle.com",
    logo: `${CDN}/classic_logo.png`,
    coverImage: `${CDN}/classic.avif`,
    featured: false,
    status: "live",
    order: 6,
  },
  {
    slug: "zoe-plant-delivery",
    title: "Plant Delivery Storefront",
    client: "Zoe Delivery",
    country: "Ethiopia",
    countryCode: "ET",
    industry: "E-Commerce / Retail",
    summary:
      "An online storefront with product catalog, delivery options, and content management for a plant-delivery service.",
    problem:
      "Zoe Delivery needed to sell and deliver plants and pots online, attract customers, and manage their own catalog and content.",
    whatWeBuilt:
      "A stylish storefront with a strong CMS backend, product catalog, and delivery options that gets plants from the nearest florist to the customer's doorstep seamlessly.",
    techStack: ["React", "Laravel", "Tailwind CSS"],
    liveUrl: "https://zoedelivery.com",
    logo: `${CDN}/Zoe.png`,
    coverImage: `${CDN}/zoePage.avif`,
    featured: false,
    status: "live",
    order: 7,
  },
  {
    slug: "yeneta-master-sis",
    title: "Multi-Campus Student Information System",
    client: "Yeneta Master",
    country: "Ethiopia",
    countryCode: "ET",
    industry: "Education Administration",
    summary:
      "A multi-campus student information system connecting teachers, parents, and schools.",
    problem:
      "Schools needed one system to manage students, teachers, and staff, tracking attendance, grades, and discipline while letting parents follow their children's progress.",
    whatWeBuilt:
      "A student information system built for parallel workloads, letting administrators track attendance, grades, and discipline, teachers manage their students, and parents see progress, across multiple campuses.",
    techStack: ["React", "Laravel", "Inertia.js", "PostgreSQL", "Redis"],
    liveUrl: "https://yenetamaster.net",
    logo: `${CDN}/yenetaMaster.png`,
    coverImage: `${CDN}/YMPage.png`,
    featured: false,
    status: "in-development",
    order: 8,
  },
  {
    slug: "doxa-ledger",
    title: "Accounting Ledger Software",
    client: "Doxa Innovations",
    country: "Ethiopia",
    countryCode: "ET",
    industry: "Accounting / FinTech",
    summary:
      "A simple, modern accounting ledger that helps small businesses manage their finances.",
    problem:
      "Small businesses needed an accounting tool that was genuinely simple to use, without enterprise complexity.",
    whatWeBuilt:
      "A clean, modern accounting ledger built with Laravel and Tailwind that helps businesses manage their finances without a learning curve.",
    techStack: ["Laravel", "Tailwind CSS"],
    liveUrl: "https://demoledger.doxaplc.com",
    logo: `${CDN}/logo.png`,
    coverImage: `${CDN}/ledger.png`,
    featured: false,
    status: "live",
    order: 9,
  },
  {
    slug: "lce-church",
    title: "Church Website",
    client: "Lutheran Church of Ethiopia",
    country: "Ethiopia",
    countryCode: "ET",
    industry: "Religious Organization",
    summary:
      "A website presenting the beliefs and teachings of a confessional Lutheran church in Bishoftu.",
    problem:
      "The LCE wanted to present its basic beliefs and teachings clearly to its community and visitors.",
    whatWeBuilt:
      "A clean website for a confessional Lutheran church in Bishoftu, built to communicate the church's beliefs and teachings with a Filament-powered content backend.",
    techStack: ["Vue", "Laravel", "Filament", "Tailwind CSS"],
    liveUrl: "https://lcechurch.org",
    logo: `${CDN}/lce.png`,
    coverImage: `${CDN}/lce_cover.avif`,
    featured: false,
    status: "live",
    order: 10,
  },
];

export const sortedProjects = [...PROJECTS].sort((a, b) => a.order - b.order);

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function allProjectSlugs(): string[] {
  return PROJECTS.map((p) => p.slug);
}

export const featuredProjects = sortedProjects.filter((p) => p.featured);

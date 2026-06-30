import type { Project } from "./types";

const CDN = "https://cdn.doxaplc.com/doxa-public";

// Shared placeholder for assets we still lack (currently Scholten's logo).
const PLACEHOLDER_IMAGE = `${CDN}/logo.png`;

/**
 * Portfolio projects. Each item drives the /works grid, its detailed
 * /works/[slug] case study (need -> approach -> solution -> testimonial), the
 * home Featured Work block, and CreativeWork JSON-LD.
 *
 * `approach` content is grounded in each project's real problem/solution and is
 * safe to refine. `testimonial` is added per project as clients provide quotes.
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
    approach: [
      {
        title: "Audited the eBay setup",
        description:
          "We mapped KLA's existing eBay storefront and inventory flow to understand exactly what had to move off the platform without breaking sales.",
      },
      {
        title: "Designed for live sync",
        description:
          "We planned a custom store with eBay API integration so inventory stays accurate in both places, and direct, discounted checkout for buyers.",
      },
      {
        title: "Built and unified the admin",
        description:
          "We delivered the platform with a single admin so KLA runs the whole catalog, orders, and pricing from one place.",
      },
    ],
    whatWeBuilt:
      "A custom e-commerce platform replacing eBay, with eBay API integration to keep inventory in sync. Customers buy direct with exclusive discounts, and KLA manages everything from one admin.",
    techStack: ["React", "Laravel", "MySQL", "Redis", "Tailwind CSS"],
    liveUrl: "https://klaconstructionequipment.com",
    logo: `${CDN}/kla.svg`,
    coverImage: "/work/kla.png",
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
    approach: [
      {
        title: "Studied the field context",
        description:
          "We worked through the RFP and the realities of OPD field sites: low bandwidth, cross-site duplicates, and strict data privacy.",
      },
      {
        title: "Designed offline-first and private",
        description:
          "We architected an offline-first PWA with rule-based duplicate detection that flags duplicates without exposing personal data, plus role-based access with 2FA.",
      },
      {
        title: "Deployed and handed over",
        description:
          "We deployed on ZOA's VPS with encrypted storage, audit trails, automated backups, and a clear handover plan for long-term local ownership.",
      },
    ],
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
    approach: [
      {
        title: "Understood the craft",
        description:
          "We sat with Scholten to understand their manufacturing work and the brand they wanted to project to customers.",
      },
      {
        title: "Built the identity",
        description:
          "We created an end-to-end identity, logo, colors, and typography, and a content structure the team could own.",
      },
      {
        title: "Shipped a manageable platform",
        description:
          "We delivered a bespoke informational platform with a custom CMS so they keep content current without a developer.",
      },
    ],
    whatWeBuilt:
      "A full bespoke informational platform, end-to-end branding (logo, colors, typography), and a custom CMS so the team can keep content current themselves.",
    techStack: ["Laravel", "Livewire", "Tailwind CSS"],
    liveUrl: "https://spw.doxaplc.com",
    logo: PLACEHOLDER_IMAGE,
    coverImage: "/work/scholten.jpeg",
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
    approach: [
      {
        title: "Mapped the learning journey",
        description:
          "We mapped the grade-12 exam-prep journey and the need to stream lessons reliably to students across Ethiopia.",
      },
      {
        title: "Designed for reliable video",
        description:
          "We chose secure video delivery on Cloudflare Stream with a GraphQL-powered course backend to keep it fast and affordable.",
      },
      {
        title: "Built the full platform",
        description:
          "We delivered structured courses so students can learn and MySeed can publish and manage content at scale.",
      },
    ],
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
    approach: [
      {
        title: "Captured the mission",
        description:
          "We worked with MLTS to capture their programs and their grounding in Scripture and the Lutheran Confessions.",
      },
      {
        title: "Planned a clear structure",
        description:
          "We designed an information architecture staff could manage themselves, with room to grow.",
      },
      {
        title: "Built with an easy admin",
        description:
          "We delivered a modern, responsive site with a Filament admin for ongoing content updates.",
      },
    ],
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
    approach: [
      {
        title: "Understood the experience",
        description:
          "We understood the Bishoftu dining experience Classic wanted to bring online and the dishes to feature.",
      },
      {
        title: "Designed an easy backend",
        description:
          "We designed an inviting site with a menu-management backend the team could update themselves.",
      },
      {
        title: "Launched it",
        description:
          "We built it so the menu stays current without touching code, ready for every occasion.",
      },
    ],
    whatWeBuilt:
      "A stylish restaurant website with a dynamic menu-management backend, bringing the Bishoftu fusion of noodles and burgers online for every occasion.",
    techStack: ["React", "Laravel", "MySQL", "Tailwind CSS"],
    liveUrl: "https://classicnoodle.com",
    logo: `${CDN}/classic_logo.png`,
    coverImage: "/work/classic.png",
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
    approach: [
      {
        title: "Mapped the catalog and delivery",
        description:
          "We mapped Zoe's plant catalog, delivery options, and the content they needed to manage day to day.",
      },
      {
        title: "Designed a stylish storefront",
        description:
          "We designed an attractive storefront on a strong CMS foundation so the team stays in control.",
      },
      {
        title: "Built seamless delivery",
        description:
          "We built browsing and delivery that gets plants from the nearest florist to the customer's doorstep.",
      },
    ],
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
    approach: [
      {
        title: "Studied school operations",
        description:
          "We studied how schools track students, teachers, attendance, grades, and discipline across multiple campuses.",
      },
      {
        title: "Designed for many roles",
        description:
          "We designed a system built for parallel workloads with distinct views for administrators, teachers, and parents.",
      },
      {
        title: "Built the multi-campus SIS",
        description:
          "We built it so each role sees exactly what they need, across every campus.",
      },
    ],
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
    approach: [
      {
        title: "Looked at real bookkeeping",
        description:
          "We looked at how small businesses actually keep their books and where existing tools overcomplicate it.",
      },
      {
        title: "Designed for the essentials",
        description:
          "We designed a clean, modern ledger focused on the essentials, with approvals and clear cash visibility.",
      },
      {
        title: "Built it to feel simple",
        description:
          "We built it to be genuinely easy to use, so finances are manageable without a learning curve.",
      },
    ],
    whatWeBuilt:
      "A clean, modern accounting ledger built with Laravel and Tailwind that helps businesses manage their finances without a learning curve.",
    techStack: ["Laravel", "Tailwind CSS"],
    liveUrl: "https://demoledger.doxaplc.com",
    logo: `${CDN}/logo.png`,
    coverImage: "/work/ledger.png",
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
    approach: [
      {
        title: "Listened to the church",
        description:
          "We worked with the LCE to express their confessional beliefs and teachings clearly and faithfully.",
      },
      {
        title: "Planned a clear structure",
        description:
          "We planned a clean structure with a content backend the church can manage on its own.",
      },
      {
        title: "Built a calm, clear site",
        description:
          "We built a site that communicates who they are, with a Filament-powered content backend.",
      },
    ],
    whatWeBuilt:
      "A clean website for a confessional Lutheran church in Bishoftu, built to communicate the church's beliefs and teachings with a Filament-powered content backend.",
    techStack: ["Vue", "Laravel", "Filament", "Tailwind CSS"],
    liveUrl: "https://lcechurch.org",
    logo: `${CDN}/lce.png`,
    coverImage: "/work/lce.png",
    featured: false,
    status: "live",
    order: 10,
  },
  {
    slug: "doxa-socials",
    title: "Link-in-Bio Platform",
    client: "Doxa Socials",
    country: "Ethiopia",
    countryCode: "ET",
    industry: "SaaS / Marketing",
    summary:
      "One scannable QR and a single page for every social link, fully editable any time.",
    problem:
      "People and brands juggle a dozen links across platforms and need one place, and one QR, that always points to the right things.",
    approach: [
      {
        title: "Saw the scattered links",
        description:
          "We saw how people and brands scatter links across platforms and wanted one place that stays current.",
      },
      {
        title: "Designed one editable page",
        description:
          "We designed a single, editable page sitting behind one QR code, simple to update any time.",
      },
      {
        title: "Built it to stay flexible",
        description:
          "We built it so you can change what's behind the QR whenever you want, with no reprinting.",
      },
    ],
    whatWeBuilt:
      "A link-in-bio platform: a personal page that gathers all your social and contact links behind a single QR code you can update whenever you want.",
    techStack: ["Next.js", "Laravel", "Tailwind CSS", "PostgreSQL"],
    liveUrl: "https://socials.doxaplc.com",
    logo: `${CDN}/logo.png`,
    coverImage: "/work/socials.png",
    featured: false,
    status: "live",
    order: 11,
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

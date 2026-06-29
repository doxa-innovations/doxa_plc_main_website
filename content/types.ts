/**
 * Shared content types, the single source of truth consumed by both the
 * rendered UI and the JSON-LD structured-data builders. Keep UI copy and
 * schema assertions reading from the SAME objects so they never drift.
 */

export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface Registration {
  commercialRegNo: string;
  /** Trade license number, verifiable on the Ethiopian Ministry of Trade. */
  licenseNo: string;
  tin: string;
  vat: string;
  /** ISO date (Gregorian), e.g. "2024-12-01" */
  foundingDate: string;
  foundingYear: number;
  licensedActivities: string[];
}

export interface Address {
  street: string;
  city: string;
  region: string;
  country: string;
  /** ISO 3166-1 alpha-2 */
  countryCode: string;
  geo: { latitude: number; longitude: number };
}

export interface SiteConfig {
  name: string;
  legalName: string;
  /** Absolute site origin, no trailing slash. */
  url: string;
  tagline: string;
  /** GEO/SEO anchor sentence, factual, entity-dense. */
  description: string;
  email: string;
  phone: string;
  /** Secondary phone number. */
  phone2: string;
  whatsapp: string;
  /** Telegram username (without @). */
  telegram: string;
  address: Address;
  registration: Registration;
  social: SocialLink[];
  /** Public Google Drive company-profile folder (trust signal). */
  driveProfileUrl: string;
  /** Ethiopian Ministry of Trade business-license verification URL. */
  etradeVerifyUrl: string;
  /** Public Google Drive folder holding client recommendation letters. */
  recommendationsUrl: string;
  mainNav: NavLink[];
  footerNav: {
    services: NavLink[];
    company: NavLink[];
    legal: NavLink[];
  };
}

export type Money = { amount: number; currency: "USD" | "EUR" };

export interface Service {
  slug: string;
  name: string;
  /** lucide-react icon name */
  icon: string;
  /** Topical image (stock placeholder until brand assets land). */
  image: string;
  summary: string;
  description: string;
  forWhom: string;
  deliverables: string[];
  techStack: string[];
  timeline: string;
  startingFrom: Money;
}

export type ProjectStatus = "live" | "in-development";

/** One step in how we approached understanding and solving a project. */
export interface ApproachStep {
  title: string;
  description: string;
}

/** A client quote shown on a project's case-study page. */
export interface ProjectTestimonial {
  quote: string;
  name: string;
  role: string;
}

export interface Project {
  slug: string;
  title: string;
  client: string;
  country: string;
  /** ISO 3166-1 alpha-2, for flag rendering */
  countryCode: string;
  industry: string;
  summary: string;
  /** The business need / challenge. */
  problem: string;
  /** The steps we took to understand and scope the work. */
  approach: ApproachStep[];
  /** The solution we delivered. */
  whatWeBuilt: string;
  /** Client quote (added as clients provide them). */
  testimonial?: ProjectTestimonial;
  techStack: string[];
  liveUrl: string | null;
  logo: string;
  coverImage: string;
  featured: boolean;
  status: ProjectStatus;
  order: number;
  /** Direct link to this project's recommendation letter, if it has its own. */
  recommendationUrl?: string;
}

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  expertise: string[];
  bio: string;
  photo: string;
  social: SocialLink[];
}

export interface PricingTier {
  name: string;
  bestFor: string;
  includes: string[];
  priceFrom: string;
  timeline: string;
  payment: string;
  highlighted: boolean;
}

export interface AddOn {
  name: string;
  detail: string;
  priceFrom: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface PaymentMilestone {
  label: string;
  percent: number;
  unlocks: string;
}

export interface ProcessStage {
  number: number;
  title: string;
  description: string;
  /** Topical image (stock placeholder until brand assets land). */
  image: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  country: string;
}

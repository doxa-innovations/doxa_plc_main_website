import type { AddOn, PricingTier } from "./types";

/**
 * Pricing tiers. These are starting points and guides, every project is
 * scoped individually. The middle tier (Growth) is visually highlighted.
 *
 * This file is now the SEED for the CMS rather than what the site renders.
 * The pricing page reads from the database so the team can change a number
 * without a deploy; these values are what the database starts out holding.
 *
 * Amounts are numbers, not display strings. Formatting lives in lib/pricing.ts
 * so that "From $1,700" is produced in exactly one place.
 */
export const PRICING_TIERS: PricingTier[] = [
  {
    name: "Starter",
    bestFor: "Small businesses, early-stage startups, and simple presence sites",
    includes: ["Website", "Hosting setup", "Domain setup"],
    mode: "from",
    amountUsd: 1700,
    amountEtb: 30000,
    timeline: "2 to 3 weeks",
    payment: "30 / 40 / 30 milestones",
    highlighted: false,
  },
  {
    name: "Growth",
    bestFor: "Growing businesses that need a full digital system",
    includes: ["Branding", "Website", "Basic mobile app", "CMS"],
    mode: "from",
    amountUsd: 4500,
    amountEtb: 60000,
    timeline: "5 to 7 weeks",
    payment: "30 / 40 / 30 milestones",
    highlighted: true,
  },
  {
    name: "Custom",
    bestFor: "Complex, multi-feature custom software projects",
    includes: [
      "Fully tailored web, mobile & cloud",
      "Integrations & automation",
      "Dedicated scoping",
    ],
    mode: "quote",
    amountUsd: null,
    amountEtb: null,
    timeline: "Defined per project",
    payment: "Custom milestone schedule",
    highlighted: false,
  },
];

export const ADD_ONS: AddOn[] = [
  {
    name: "Monthly Maintenance",
    detail: "Hosting oversight, uptime monitoring, and content updates",
    amountUsd: 100,
    interval: "month",
  },
  {
    name: "Social Media Management",
    detail: "Content calendar, posting, and engagement",
    amountUsd: 500,
    interval: "month",
  },
  {
    name: "SEO Optimization",
    detail: "Technical SEO, content strategy, and monthly reporting",
    amountUsd: 300,
    interval: "month",
  },
  {
    name: "Priority Support",
    detail: "24-hour response SLA and a dedicated contact",
    amountUsd: 200,
    interval: "month",
  },
];

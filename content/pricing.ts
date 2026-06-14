import type { AddOn, PricingTier } from "./types";

/**
 * Pricing tiers. These are starting points and guides — every project is
 * scoped individually. The middle tier (Growth) is visually highlighted.
 */
export const PRICING_TIERS: PricingTier[] = [
  {
    name: "Starter",
    bestFor: "Small businesses, early-stage startups, and simple presence sites",
    includes: ["Website", "Hosting setup", "Domain setup"],
    priceFrom: "From $1,700",
    timeline: "3–5 weeks",
    payment: "30 / 40 / 30 milestones",
    highlighted: false,
  },
  {
    name: "Growth",
    bestFor: "Growing businesses that need a full digital system",
    includes: [
      "Branding",
      "Website",
      "Mobile app (3 months)",
      "CMS",
    ],
    priceFrom: "From $4,500",
    timeline: "6–12 weeks",
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
    priceFrom: "On request",
    timeline: "Defined per project",
    payment: "Custom milestone schedule",
    highlighted: false,
  },
];

export const ADD_ONS: AddOn[] = [
  {
    name: "Monthly Maintenance",
    detail: "Hosting oversight, uptime monitoring, and content updates",
    priceFrom: "From $100/month",
  },
  {
    name: "Social Media Management",
    detail: "Content calendar, posting, and engagement",
    priceFrom: "From $500/month",
  },
  {
    name: "SEO Optimization",
    detail: "Technical SEO, content strategy, and monthly reporting",
    priceFrom: "From $300/month",
  },
  {
    name: "Priority Support",
    detail: "24-hour response SLA and a dedicated contact",
    priceFrom: "From $200/month",
  },
];

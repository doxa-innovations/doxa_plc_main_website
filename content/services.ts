import type { Service } from "./types";

/**
 * SEED DATA. The site reads services from the database via `getServices()` in
 * lib/content.ts; this array is what `lib/seed.ts` writes when a service is
 * missing, and what `npm run seed:content` overwrites them with.
 *
 * The lineup is fixed at these six. `slug` picks the illustration in
 * ServiceArt and is the /services#… anchor; `icon` is a lucide name resolved
 * by components/Icon.tsx. Neither is editable in /olympus, so adding a seventh
 * service here means adding its drawing and its icon mapping too.
 *
 * `startingFrom` anchors both the page copy and the Service/Offer JSON-LD so
 * prices never drift between the two.
 */
export const SERVICES: Service[] = [
  {
    slug: "website-development",
    name: "Website Development",
    icon: "Globe",
    summary:
      "Fast, accessible business websites, portfolios, and landing pages built to convert and to rank.",
    description:
      "Static and dynamic business websites that are responsive, accessible, and Core Web Vitals optimized. We integrate a headless or Payload CMS when content changes often, and build in Next.js, React, or plain HTML/CSS depending on what your project actually needs.",
    forWhom:
      "Small businesses, startups, and professionals who need a credible, high-performance web presence.",
    deliverables: [
      "Responsive, accessible, SEO-ready build",
      "CMS integration (headless or Payload CMS)",
      "Core Web Vitals performance tuning",
      "Hosting & domain setup",
    ],
    techStack: ["Next.js", "React", "Tailwind CSS"],
    timeline: "3 to 6 weeks",
    startingFrom: { amount: 1500, currency: "USD" },
    etStartingFrom: 20000,
    billing: "project",
    showInFooter: true,
  },
  {
    slug: "e-commerce",
    name: "E-Commerce Stores",
    icon: "ShoppingCart",
    summary:
      "Shopify builds or fully custom online stores with payments, inventory, and order management.",
    description:
      "We set up, configure, and theme Shopify stores, or build a fully custom storefront on Laravel + React when you need more control. Payment gateways (Stripe, PayPal, and regional options), product catalogs, inventory, and order management included.",
    forWhom:
      "Retailers and brands selling online who need a store that scales with them.",
    deliverables: [
      "Shopify setup & custom theme, or custom-built store",
      "Payment gateway integration",
      "Product catalog, inventory & order management",
      "Admin training & handover",
    ],
    techStack: ["Laravel", "React", "Shopify", "Stripe"],
    timeline: "4 to 8 weeks",
    startingFrom: { amount: 2500, currency: "USD" },
    etStartingFrom: 79999,
    billing: "project",
    showInFooter: true,
  },
  {
    slug: "custom-software",
    name: "Custom Software & Tools",
    icon: "Wrench",
    summary:
      "Internal dashboards, booking systems, CRMs, LMS platforms, and automation built around your workflow.",
    description:
      "Bespoke business software: internal dashboards, booking and reservation systems, CRM and client-management tools, API integrations and automation, and learning management systems. Built on a robust, maintainable stack designed for parallel workloads.",
    forWhom:
      "Operations-heavy businesses that have outgrown spreadsheets and off-the-shelf tools.",
    deliverables: [
      "Dashboards, booking systems, CRMs, or LMS",
      "API integrations & automation",
      "Role-based access & audit trails",
      "Documentation & maintenance plan",
    ],
    techStack: ["Laravel", "Next.js", "FilamentPHP", "PostgreSQL", "Redis"],
    timeline: "Defined per project",
    startingFrom: { amount: 3000, currency: "USD" },
    etStartingFrom: 119999,
    billing: "project",
    showInFooter: true,
  },
  {
    slug: "branding",
    name: "Branding & Identity",
    icon: "Palette",
    summary:
      "Logo design, color systems, typography, and brand guidelines that make you look established.",
    description:
      "A complete visual identity: multiple logo concepts with full vector delivery, a color palette and typography system, a brand guidelines document, and a social media kit so your brand is consistent everywhere.",
    forWhom:
      "New ventures and businesses ready to look as professional as they operate.",
    deliverables: [
      "Logo design (multiple concepts, full vector)",
      "Color palette & typography system",
      "Brand guidelines document",
      "Social media kit",
    ],
    techStack: ["Figma", "Adobe Illustrator"],
    timeline: "1 to 3 weeks",
    startingFrom: { amount: 500, currency: "USD" },
    etStartingFrom: 19999,
    billing: "project",
    showInFooter: true,
  },
  {
    slug: "mobile",
    name: "Mobile Applications",
    icon: "Smartphone",
    summary:
      "Cross-platform iOS + Android apps with React Native, customer, driver, and companion apps.",
    description:
      "Cross-platform mobile apps built once for iOS and Android with React Native: customer-facing apps, driver/delivery apps, and companion apps with push notifications, maps, and real-time updates.",
    forWhom:
      "Businesses that need to reach customers or coordinate teams on mobile.",
    deliverables: [
      "Cross-platform iOS + Android app",
      "Push notifications, maps & real-time updates",
      "App Store & Play Store submission support",
      "Post-launch support window",
    ],
    techStack: ["React Native", "Expo", "Laravel"],
    timeline: "Defined per project",
    startingFrom: { amount: 5000, currency: "USD" },
    etStartingFrom: 199999,
    billing: "project",
    showInFooter: true,
  },
  {
    slug: "maintenance",
    name: "Maintenance & Support",
    icon: "LifeBuoy",
    summary:
      "Ongoing hosting, security updates, uptime monitoring, and content updates on a monthly retainer.",
    description:
      "A monthly retainer that keeps your product healthy: hosting management, security updates, uptime monitoring, and content updates or small feature additions as you grow.",
    forWhom:
      "Anyone running a live product who wants it monitored and maintained.",
    deliverables: [
      "Hosting management & uptime monitoring",
      "Security updates & patches",
      "Content updates & feature additions",
      "Priority bug fixes",
    ],
    techStack: ["Docker", "Cloudflare", "Linux VPS"],
    timeline: "Monthly retainer",
    startingFrom: { amount: 100, currency: "USD" },
    etStartingFrom: "custom",
    billing: "monthly",
    // The footer's Services column lists the five things you buy, not the
    // thing you buy afterwards.
    showInFooter: false,
  },
];

import type { Service } from "./types";

/**
 * Services offered, in display order. `icon` is a lucide-react icon name
 * resolved by the UI. `startingFrom` anchors both the page copy and the
 * Service/Offer JSON-LD so prices never drift between the two.
 */
export const SERVICES: Service[] = [
  {
    slug: "website-development",
    name: "Website Development",
    icon: "Globe",
    image: "/work/classic.png",
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
  },
  {
    slug: "e-commerce",
    name: "E-Commerce Stores",
    icon: "ShoppingCart",
    image: "/work/ecommerce.png",
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
  },
  {
    slug: "custom-software",
    name: "Custom Software & Tools",
    icon: "Wrench",
    image: "/work/ledger.png",
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
  },
  {
    slug: "branding",
    name: "Branding & Identity",
    icon: "Palette",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=70",
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
  },
  {
    slug: "mobile",
    name: "Mobile Applications",
    icon: "Smartphone",
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=70",
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
  },
  {
    slug: "maintenance",
    name: "Maintenance & Support",
    icon: "LifeBuoy",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=70",
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
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

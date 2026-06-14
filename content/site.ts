import type { SiteConfig } from "./types";

/**
 * Canonical company + site configuration. All legal/registration numbers are
 * real and independently verifiable — they are a hard trust signal and are
 * mirrored into Organization/LocalBusiness JSON-LD.
 */
export const SITE: SiteConfig = {
  name: "Doxa Innovations",
  legalName: "Doxa Innovations Software Development PLC",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://doxaplc.com").replace(
    /\/$/,
    "",
  ),
  tagline: "Software Excellence, Business Success.",
  description:
    "Doxa Innovations is a legally registered Ethiopian software company building websites, e-commerce stores, and custom software tools for small and medium businesses in the US, EU, Asia, and beyond — at 40–70% below typical Western agency rates.",
  email: "company@doxaplc.com",
  phone: "+251 961 412 909",
  whatsapp: "+251961412909",
  address: {
    street: "Infront of Polytechnic College, 2nd Floor, Mama's Building",
    city: "Bishoftu",
    region: "Oromia",
    country: "Ethiopia",
    countryCode: "ET",
    geo: { latitude: 8.7522, longitude: 38.9969 },
  },
  registration: {
    commercialRegNo: "ORO/BT/office/2/0007630/2017",
    tin: "0093503857",
    vat: "33111390004",
    foundingDate: "2017-04-18",
    foundingYear: 2017,
    licensedActivities: [
      "Creative Media",
      "Design",
      "Database Management",
      "Digital Data Processing",
    ],
  },
  // TODO: confirm public profile/social URLs before launch.
  social: [],
  driveProfileUrl: "",
  mainNav: [
    { label: "Services", href: "/services" },
    { label: "Works", href: "/works" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "About", href: "/about" },
    { label: "Pricing", href: "/pricing" },
    { label: "Team", href: "/team" },
  ],
  footerNav: {
    services: [
      { label: "Website Development", href: "/services#website-development" },
      { label: "E-Commerce", href: "/services#e-commerce" },
      { label: "Custom Software", href: "/services#custom-software" },
      { label: "Branding & Identity", href: "/services#branding" },
      { label: "Mobile Applications", href: "/services#mobile" },
    ],
    company: [
      { label: "About", href: "/about" },
      { label: "Team", href: "/team" },
      { label: "Works", href: "/works" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Contact", href: "/contact" },
    ],
    legal: [
      { label: "Legal & Trust", href: "/legal" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
};

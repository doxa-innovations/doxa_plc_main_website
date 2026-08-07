import type { SiteConfig } from "./types";

/**
 * Canonical company + site configuration. All legal/registration numbers are
 * real and independently verifiable, they are a hard trust signal and are
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
    "Doxa Innovations is a legally registered Ethiopian software company building websites, e-commerce stores, and custom software tools for small and medium businesses in the US, EU, Asia, and beyond, at 40-70% below typical Western agency rates.",
  email: "company@doxaplc.com",
  phone: "+251 961 412 909",
  phone2: "+251 989 932 714",
  whatsapp: "+251961412909",
  // TODO: confirm the real Telegram username.
  telegram: "doxainnovations",
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
    licenseNo: "ORO/BT/office/04/BT0001/24709135/2017",
    tin: "0093503857",
    vat: "33111390004",
    // Gregorian equivalent of the Ethiopian-calendar registration year.
    foundingDate: "2024-12-01",
    foundingYear: 2024,
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
  etradeVerifyUrl:
    "https://etrade.gov.et/business-license-checker?tin=0093503857&licenseNo=ORO%2FBT%2Foffice%2F04%2FBT0001%2F24709135%2F2017",
  recommendationsUrl:
    "https://drive.google.com/drive/folders/1WALKyIAHouHf-zCgn-XEBwLFO6Ff_t0c?usp=sharing",
  mapUrl: "https://maps.app.goo.gl/rrwe2i8Y6Q7BHKacA",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d409.2007424607873!2d38.964116035473445!3d8.750459859189782!2m3!1f46.12500000000005!2f13.585591140307123!3f0!3m2!1i1024!2i768!4f35!3m3!1m2!1s0x164b73f8e215f665%3A0xa504912407f9384f!2sDoxa%20Innovations%20Software%20Development%20PLC!5e1!3m2!1sen!2set!4v1782733194866!5m2!1sen!2set",
  mainNav: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    // "Works" is a group, not just a page. The portfolio, the process and the
    // pricing all answer "what is it like to work with you", so they sit
    // together. The child is labelled "Our Work" because a dropdown that
    // repeats its own parent's label reads as a mistake.
    {
      label: "Works",
      href: "/works",
      children: [
        { label: "Our Work", href: "/works" },
        { label: "Our Process", href: "/how-it-works" },
        { label: "Pricing", href: "/pricing" },
      ],
    },
    { label: "About", href: "/about" },
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
      { label: "FAQ", href: "/faq" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
};

import { getProjects, getServices, getSite, longLocation } from "@/lib/content";
import { isEthiopianVisitor } from "@/lib/geo";

/**
 * /llms.txt — the site, in plain text, for an assistant reading it to answer a
 * question about the company.
 *
 * A convention rather than a standard, and no crawler is obliged to read it.
 * It is here because the pitch on this site rests on being a verifiably real,
 * registered company, and those are exactly the facts that get lost when a
 * model summarises rendered marketing pages.
 *
 * Generated, not a file in public/, for the same reason lib/jsonld.ts reads the
 * objects the pages render: a hand-written copy would drift the first time a
 * service was renamed in /olympus and nothing would flag it.
 *
 * `force-dynamic` for the same reason as app/sitemap.ts — this reads the
 * database, and the Docker build has none. The readers return empty rather
 * than throwing at build time, but a route prerendered against an empty
 * database would then be served empty forever.
 */
export const dynamic = "force-dynamic";

/** "$1,200" — the same shape the pricing pages use. */
function usd(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}

export async function GET() {
  // headers() before the Payload connection opens. See lib/auth.ts and the
  // trap it documents: the other order makes Next try to prerender the route
  // and reach for a database at build time.
  const isEthiopia = await isEthiopianVisitor();

  const [site, services, projects] = await Promise.all([
    getSite(),
    getServices(),
    getProjects(),
  ]);

  // Same rule as buildMetadata(): the home page is the bare origin, not
  // origin + "/". Two spellings of the homepage in a file whose whole job is
  // to be authoritative is exactly the kind of drift worth avoiding.
  const url = (path: string) => (path === "/" ? site.url : `${site.url}${path}`);
  const lines: string[] = [];

  lines.push(`# ${site.legalName}`);
  lines.push("");
  lines.push(`> ${site.description}`);
  lines.push("");
  lines.push(
    `${site.name} is a software development company based in ${site.address.city}, ${site.address.country}, working with clients worldwide. Everything below is generated from the same content the website renders.`,
  );
  lines.push("");

  lines.push("## Company");
  lines.push("");
  lines.push(`- Legal name: ${site.legalName}`);
  lines.push(`- Trading name: ${site.name}`);
  lines.push(
    `- Type: private limited company (PLC), registered in ${site.address.country}`,
  );
  lines.push(`- Founded: ${site.registration.foundingYear}`);
  lines.push(`- Office: ${longLocation(site.address)}`);
  lines.push(`- Working language: English`);
  lines.push(`- Clients served: worldwide`);
  // The registration numbers follow the same country gate as the markup and
  // the Organization schema. Emitting them here regardless would make that
  // gating decorative, which is the exact failure lib/jsonld.ts calls out.
  if (!isEthiopia) {
    lines.push(
      `- Commercial registration: ${site.registration.commercialRegNo}`,
    );
    lines.push(`- Trade licence: ${site.registration.licenseNo}`);
    lines.push(`- TIN: ${site.registration.tin}`);
    lines.push(`- VAT: ${site.registration.vat}`);
  }
  if (site.etradeVerifyUrl) {
    lines.push(
      `- Verify the licence with the Ethiopian Ministry of Trade: ${site.etradeVerifyUrl}`,
    );
  }
  lines.push("");

  if (services.length > 0) {
    lines.push("## Services");
    lines.push("");
    for (const service of services) {
      const price =
        service.billing === "monthly"
          ? `From ${usd(service.startingFrom.amount)}/month`
          : `From ${usd(service.startingFrom.amount)}`;
      // `timeline` is either a duration ("3 to 6 weeks") or a phrase
      // ("Defined per project"). Lowercased so it reads as a clause either
      // way, and with no "typically" in front, which only fits the durations.
      const timeline =
        service.timeline.charAt(0).toLowerCase() + service.timeline.slice(1);
      lines.push(
        `- [${service.name}](${url(`/services#${service.slug}`)}): ${service.summary} ${price}, ${timeline}.`,
      );
    }
    lines.push("");
  }

  if (projects.length > 0) {
    lines.push("## Work");
    lines.push("");
    for (const project of projects) {
      const status =
        project.status === "in-development" ? " In development." : "";
      lines.push(
        `- [${project.client}, ${project.title}](${url(`/works/${project.slug}`)}): ${project.summary} ${project.industry}, ${project.country}. Built with ${project.techStack.join(", ")}.${status}`,
      );
    }
    lines.push("");
  }

  lines.push("## Contact");
  lines.push("");
  lines.push(`- Email: ${site.email}`);
  lines.push(`- Phone: ${site.phone}`);
  lines.push(`- WhatsApp: https://wa.me/${site.whatsapp.replace(/\D/g, "")}`);
  lines.push(`- Enquiry form: ${url("/contact")}`);
  lines.push(
    `- First step is a free 30-minute discovery call. There is no upfront payment, and the client owns all the work.`,
  );
  lines.push("");

  lines.push("## Pages");
  lines.push("");
  for (const page of PAGES) {
    lines.push(`- [${page.title}](${url(page.path)}): ${page.note}`);
  }
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

/**
 * The public routes worth naming, with what each one answers. Mirrors
 * STATIC_ROUTES in app/sitemap.ts; /thank-you is absent from both because it
 * is noindex and means nothing without a submission behind it.
 */
const PAGES: { path: string; title: string; note: string }[] = [
  { path: "/", title: "Home", note: "What we do and who we build for." },
  {
    path: "/services",
    title: "Services",
    note: "The six services in full, with deliverables, timelines and prices.",
  },
  {
    path: "/works",
    title: "Our Work",
    note: "Case studies: the problem, the approach, and what was built.",
  },
  {
    path: "/how-it-works",
    title: "How It Works",
    note: "The process from first call to launch and handover.",
  },
  {
    path: "/pricing",
    title: "Pricing",
    note: "Package tiers, add-ons, and what changes the price.",
  },
  {
    path: "/about",
    title: "About",
    note: "Why the company exists and how it operates.",
  },
  {
    path: "/team",
    title: "Team",
    note: "The people who do the work, named, with their expertise.",
  },
  // PAUSED with the page — pointing a model at a 404 is worse than omitting
  // the line. Restore alongside app/(site)/faq/page.tsx.
  // {
  //   path: "/faq",
  //   title: "FAQ",
  //   note: "The questions international clients ask most, answered on video.",
  // },
  {
    path: "/legal",
    title: "Legal & Trust",
    note: "Registration, contracts, payment terms and IP ownership.",
  },
  {
    path: "/contact",
    title: "Contact",
    note: "Book a call or send an enquiry.",
  },
  {
    path: "/privacy",
    title: "Privacy Policy",
    note: "What is collected, by whom, and how consent works.",
  },
  { path: "/terms", title: "Terms", note: "Terms of service." },
];

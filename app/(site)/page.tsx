import Link from "next/link";
import {
  ShieldCheck,
  Wallet,
  Handshake,
  Video,
  ArrowRight,
  Check,
  ScrollText,
  FileCheck2,
} from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import { isEthiopianVisitor } from "@/lib/geo";
import {
  WALKTHROUGH_VIDEO,
  WALKTHROUGH_POSTER,
  WALKTHROUGH_CAPTIONS,
} from "@/content/media";
import {
  getProjects,
  getServices,
  getSite,
  getTestimonials,
} from "@/lib/content";
import { turnstileSiteKey } from "@/lib/turnstile";
import { JsonLd } from "@/components/seo/JsonLd";
import { graph, itemListSchema } from "@/lib/jsonld";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { Hero } from "@/components/sections/Hero";
import { ProcessStaircase } from "@/components/sections/ProcessStaircase";
import type { ShowcaseItem } from "@/components/sections/HeroShowcase";
import { ClientLogos } from "@/components/marketing/ClientLogos";
import { ServiceCard } from "@/components/marketing/ServiceCard";
import { ProjectCard } from "@/components/marketing/ProjectCard";
import { TrustSignals } from "@/components/marketing/TrustSignals";
import { TestimonialCarousel } from "@/components/marketing/TestimonialCarousel";
import { LeadWizard } from "@/components/marketing/LeadWizard";
import { OfficeVideo } from "@/components/marketing/OfficeVideo";
import { Button } from "@/components/ui/button";

export const metadata = buildMetadata({ path: "/" });

/**
 * The hero deck, left to right.
 *
 * Lives here rather than inside Hero because Hero is a client component and
 * cannot query the CMS. A string is a project slug, resolved against the
 * published projects; an object is a screenshot supplied directly.
 */
const HERO_SHOWCASE: (string | ShowcaseItem)[] = [
  "kla-construction-equipment",
  // Screenshot-only: shipped work that has no case study written up yet, so
  // there is no CMS project to resolve. Listed inline rather than inventing a
  // half-empty project record that would also surface on /works.
  {
    slug: "fida",
    client: "Fida",
    title: "Food, parcel and essentials delivery in Bishoftu",
    coverImage: "/work/fida.png",
  },
  "lce-church",
  "classic-noodle-burger",
  {
    slug: "dubs",
    client: "DUBS",
    title: "Disc golf club site, Vollrath Park, Sheboygan WI",
    coverImage: "/work/dubs.png",
  },
];

/**
 * Which card is centred on load. The deck rotates from there.
 *
 * A slug rather than a position, because `showcase` below drops any entry whose
 * project is unpublished or renamed. A numeric index survives that silently and
 * starts a different card centred; a slug that no longer resolves just falls
 * back to the first card.
 */
const HERO_INITIAL_SLUG = "classic-noodle-burger";

const MICRO_TRUST = [
  { icon: ShieldCheck, label: "Legally registered PLC", sub: "TIN & VAT on file" },
  { icon: FileCheck2, label: "You own 100% of the code", sub: "transferred on final payment" },
  { icon: ScrollText, label: "No upfront payment", sub: "30 / 40 / 30 by milestone" },
];

const STEPS = [
  { n: 1, title: "Free discovery call", body: "We talk and listen. No sales pitch, no commitment." },
  { n: 2, title: "Proposal & contract", body: "A clear proposal and a legal digital contract, signed together." },
  { n: 3, title: "Build & review", body: "We build in stages. You approve before we move forward." },
  { n: 4, title: "Launch & support", body: "We deploy, hand over everything, and stay available." },
];

function BentoCell({
  icon: Icon,
  title,
  body,
  stat,
  className,
  emphasized,
}: {
  icon: typeof Wallet;
  title: string;
  body: string;
  stat?: string;
  className?: string;
  emphasized?: boolean;
}) {
  return (
    <div
      className={`card-lift relative flex flex-col overflow-hidden rounded-[1.4rem] border border-line bg-panel p-7 ${className ?? ""}`}
    >
      {emphasized && (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-pj-primary/20 blur-[80px]"
        />
      )}
      <span className="relative inline-flex size-11 items-center justify-center rounded-xl border border-line bg-pj-primary/15 text-brand shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
        <Icon className="size-5" strokeWidth={1.5} aria-hidden />
      </span>
      {stat && (
        <p className="relative mt-5 font-display text-3xl font-semibold text-ink">
          {stat}
        </p>
      )}
      <h3 className="relative mt-3 font-display text-lg font-semibold text-ink">
        {title}
      </h3>
      <p className="relative mt-1.5 text-sm text-ink-muted">{body}</p>
    </div>
  );
}

export default async function HomePage() {
  const [isEthiopia, projects, services, testimonials, site] =
    await Promise.all([
      isEthiopianVisitor(),
      getProjects(),
      getServices(),
      getTestimonials(),
      getSite(),
    ]);

  const featured = projects.filter((p) => p.featured);
  // Keep the declared order. Strings resolve against the CMS and drop out if
  // the project is unpublished or renamed; inline entries are used as-is.
  const showcase = HERO_SHOWCASE.map((entry) =>
    typeof entry === "string"
      ? projects.find((p) => p.slug === entry)
      : entry,
  ).filter((p): p is NonNullable<typeof p> => Boolean(p));

  // -1 (the slug resolved to nothing) becomes 0, so the deck always has a card
  // at the front rather than starting one index before the first.
  const heroInitial = Math.max(
    0,
    showcase.findIndex((p) => p.slug === HERO_INITIAL_SLUG),
  );

  return (
    <>
      <Hero showcase={showcase} initialIndex={heroInitial} />

      {/* Micro-trust strip */}
      <section className="border-y border-line bg-deep/60">
        <Container>
          {/* Mobile: a single, barely-there line so it never competes for attention */}
          <p className="py-2.5 text-center text-[0.6rem] leading-relaxed text-ink-muted/60 sm:hidden">
            {MICRO_TRUST.map((t) => t.label).join("  ·  ")}
          </p>
          {/* sm and up: the full credential strip */}
          <div className="hidden gap-px sm:grid sm:grid-cols-3">
            {MICRO_TRUST.map((t) => (
              <div key={t.label} className="flex items-center gap-3 py-6">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-line bg-pj-primary/15 text-brand">
                  <t.icon className="size-4.5" strokeWidth={1.5} aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{t.label}</p>
                  <p className="text-xs text-ink-muted">{t.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <ClientLogos />

      {/* Services */}
      <Section variant="muted" frame>
        <Reveal>
          <SectionHeading
            title="Software and digital products, end to end"
            lead="From a landing page to a multi-campus platform, we build it, ship it, and maintain it."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </Reveal>
        <div className="mt-10 text-center">
          <Button asChild variant="outline">
            <Link href="/services">
              Explore all services
              <ArrowRight className="size-4" strokeWidth={1.75} />
            </Link>
          </Button>
        </div>
      </Section>

      {/* Process, glowing numbered flow */}
      <Section variant="surface">
        <Reveal>
          <SectionHeading
            title="A process with no surprises"
            lead="We lead with conversation, not invoices. Here's the path from hello to launch."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <ProcessStaircase steps={STEPS} />
        </Reveal>

        <div className="mt-12 text-center">
          <Button asChild variant="outline">
            <Link href="/how-it-works">
              See the full process
              <ArrowRight className="size-4" strokeWidth={1.75} />
            </Link>
          </Button>
        </div>
      </Section>

      {/* Gallery */}
      {/* z-[60] so the floating mini player is not painted over by the
          bands below it — Section is `isolate`, which would otherwise trap
          the player inside this one. */}
      <Section variant="deep" className="relative z-[60]">
        <Reveal>
          <SectionHeading
            title="A look inside Doxa"
            lead="Real people, a real office, real work. A glimpse of how and where we build."
          />
        </Reveal>
        {/* Not wrapped in <Reveal>: the floating mini-player uses position:fixed,
            which a transformed scroll-reveal ancestor would break. */}
        <div className="mt-12">
          <OfficeVideo
            src={WALKTHROUGH_VIDEO}
            poster={WALKTHROUGH_POSTER}
            captions={WALKTHROUGH_CAPTIONS}
            title="A walkthrough of the Doxa Innovations office in Bishoftu"
          />
        </div>
      </Section>

      {/* Start a project, the stepped version of the contact form.
          Sits straight after the office walkthrough: they have just seen the
          room and the people, which is the moment the ask costs least. */}
      <Section variant="muted" frame>
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div>
              <SectionHeading
                eyebrow="Start a project"
                title="Tell us what you're building"
                lead="Four short questions. No call to book, no form to download, and a real person replies within one business day."
                align="left"
              />
              <ul className="mt-8 space-y-4">
                {[
                  {
                    title: "We read it, not a bot",
                    detail:
                      "Every enquiry lands with the two founders directly.",
                  },
                  {
                    title: "A reply within one business day",
                    detail:
                      "With honest questions, and a rough shape of the work.",
                  },
                  {
                    title: "A video call before any invoice",
                    detail: "Nothing is owed until scope is agreed in writing.",
                  },
                ].map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-line bg-pj-primary/15 text-brand">
                      <Check className="size-3.5" strokeWidth={2.5} aria-hidden />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink">
                        {item.title}
                      </p>
                      <p className="text-sm text-ink-muted">{item.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-sm text-ink-muted">
                Would rather just write to us?{" "}
                <Link
                  href="/contact"
                  className="text-brand underline underline-offset-4 hover:text-glow"
                >
                  Use the contact page
                </Link>
                .
              </p>
            </div>
          </Reveal>

          {/* Not wrapped in <Reveal>: it introduces a transform, which becomes
              the containing block for the Turnstile challenge iframe and can
              pin it to the wrong place on screen. */}
          <LeadWizard
            turnstileSiteKey={turnstileSiteKey()}
            fallbackEmail={site.email}
          />
        </div>
      </Section>

      {/* Why Doxa, asymmetric bento */}
      <Section variant="surface" frame grid>
        <Reveal>
          <SectionHeading
            eyebrow="Why Doxa"
            title="Engineered to earn your trust"
            lead="Working with an overseas team carries real fears. We resolve each one, with evidence, not promises."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            <BentoCell
              className="lg:col-span-2"
              emphasized
              icon={Wallet}
              stat="40 to 70% less"
              title="Affordable without compromise"
              body="Our pricing is a result of how we operate. A small senior team, a delivery process refined over dozens of projects, and disciplined scoping remove the overhead that inflates agency rates, so your budget goes to engineering rather than layers of management."
            />
            <BentoCell
              icon={ShieldCheck}
              title="Legally verified"
              body="A registered PLC with a tax ID, VAT number, and a verifiable legal identity. We sign proper digital contracts."
            />
            <BentoCell
              icon={Handshake}
              title="No payment upfront"
              body="We start with a conversation. Payments happen at agreed milestones, protected by contract."
            />
            <BentoCell
              className="lg:col-span-2"
              emphasized
              icon={Video}
              title="Video call first"
              body="Every engagement opens with a video call. We talk through your project, answer your questions, and share our registration documents on request."
            />
          </div>
        </Reveal>
      </Section>

      {/* Featured work */}
      <Section variant="muted" frame>
        <Reveal>
          <SectionHeading
            eyebrow="Selected work"
            title="Real, live projects, on three continents"
            lead="Every project below is a production system you can open right now."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </Reveal>
        <div className="mt-10 text-center">
          <Button asChild variant="outline">
            <Link href="/works">
              View all projects
              <ArrowRight className="size-4" strokeWidth={1.75} />
            </Link>
          </Button>
        </div>
      </Section>

      {/* Trust panel, editorial split — verifiable registration proof aimed at
          international clients; hidden from Ethiopian visitors. */}
      {!isEthiopia && (
        <Section variant="surface">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal>
              <div className="text-center sm:text-left">
                <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] text-ink sm:text-4xl">
                  We show our faces, and our paperwork.
                </h2>
                <p className="mx-auto mt-4 max-w-md text-lg text-ink-muted sm:mx-0">
                  Doxa Innovations is a registered private limited company in
                  Ethiopia. Here&apos;s the proof, verify any of it independently.
                </p>
                <Button asChild variant="outline" className="mt-6">
                  <Link href="/legal">
                    Read our legal & trust page
                    <ArrowRight className="size-4" strokeWidth={1.75} />
                  </Link>
                </Button>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <TrustSignals />
            </Reveal>
          </div>
        </Section>
      )}

      {/* Testimonials, the last thing before the footer.
          Rendered only when there are some: an empty scrolling row, or worse a
          heading with nothing under it, is a bigger tell than no section at
          all. See content/testimonials.ts on why there are none by default. */}
      {testimonials.length > 0 && (
        <Section variant="muted">
          <Reveal>
            <SectionHeading
              title="In their words"
              lead="The people we built for, on what it was like."
            />
          </Reveal>
          <div className="mt-12">
            <TestimonialCarousel testimonials={testimonials} />
          </div>
        </Section>
      )}

      {/* The home page renders services and work but described neither: the
          only structured data reaching it was the site-wide graph inherited
          from (site)/layout.tsx, which says nothing about this page.
          Both lists are built from the same arrays the sections above render.

          The testimonials are deliberately NOT expressed as an AggregateRating
          on the Organization. A rating you publish about yourself is ignored
          by Google at best and a structured-data policy violation at worst. */}
      <JsonLd
        schema={graph(
          itemListSchema(
            "Services",
            services.map((s) => ({
              name: s.name,
              url: `${site.url}/services#${s.slug}`,
            })),
          ),
          itemListSchema(
            "Selected work",
            featured.map((p) => ({
              name: `${p.client}, ${p.title}`,
              url: `${site.url}/works/${p.slug}`,
            })),
          ),
        )}
      />
    </>
  );
}

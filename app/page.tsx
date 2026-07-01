import Link from "next/link";
import {
  ShieldCheck,
  Wallet,
  Handshake,
  Video,
  ArrowRight,
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
import { SERVICES } from "@/content/services";
import { featuredProjects } from "@/content/projects";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { Hero } from "@/components/sections/Hero";
import { ClientLogos } from "@/components/marketing/ClientLogos";
import { ServiceCard } from "@/components/marketing/ServiceCard";
import { ProjectCard } from "@/components/marketing/ProjectCard";
import { TrustSignals } from "@/components/marketing/TrustSignals";
import { CtaBand } from "@/components/marketing/CtaBand";
import { OfficeVideo } from "@/components/marketing/OfficeVideo";
import { Button } from "@/components/ui/button";

export const metadata = buildMetadata({ path: "/" });

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
      className={`relative flex flex-col overflow-hidden rounded-[1.4rem] border border-line bg-panel p-7 ${className ?? ""}`}
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
  const isEthiopia = await isEthiopianVisitor();
  return (
    <>
      <Hero />

      {/* Micro-trust strip */}
      <section className="border-y border-line bg-deep">
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
              body="Operating from Ethiopia, one US dollar goes further, and that saving passes directly to you. Same quality, a fraction of the cost. This isn't cheap labor; it's optimized operations."
            />
            <BentoCell
              icon={ShieldCheck}
              title="Legally verified"
              body="A registered PLC with a tax ID, VAT number, and a verifiable legal identity. We sign proper digital contracts. We don't disappear."
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
              title="Video call first, we show our faces"
              body="Before any money is discussed, we get on a video call. You see our faces, we see yours, and we'll share government-issued ID and registration documents on request. That's how trust starts."
            />
          </div>
        </Reveal>
      </Section>

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
            {SERVICES.map((service) => (
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
          <div className="relative mt-14">
            {/* Connector runs only from the first node to the last (node centers
                sit at ~12.5% and ~87.5% across the four equal columns). */}
            <span
              aria-hidden
              className="absolute left-[12.5%] right-[12.5%] top-5 hidden h-px bg-gradient-to-r from-pj-secondary/50 via-pj-primary/40 to-pj-secondary/50 md:block"
            />
            <ol className="grid gap-10 md:grid-cols-4 md:gap-6">
              {STEPS.map((s) => (
                <li key={s.n} className="relative text-center">
                  <span className="relative z-10 inline-flex size-10 items-center justify-center rounded-full border border-line bg-surface font-display text-base font-semibold text-brand shadow-[0_0_30px_-6px_rgba(178,119,211,0.8)]">
                    {s.n}
                  </span>
                  <h3 className="mt-5 font-display text-base font-semibold text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-ink-muted">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
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
      <Section variant="deep">
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
            {featuredProjects.map((project) => (
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

      <CtaBand />
    </>
  );
}

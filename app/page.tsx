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
import { ImageShowcase } from "@/components/marketing/ImageShowcase";
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
      className={`relative flex flex-col overflow-hidden rounded-[1.4rem] border border-white/10 bg-white/[0.02] p-7 ${className ?? ""}`}
    >
      {emphasized && (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-pj-primary/20 blur-[80px]"
        />
      )}
      <span className="relative inline-flex size-11 items-center justify-center rounded-xl border border-white/10 bg-pj-primary/15 text-pj-secondary shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
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

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Micro-trust strip */}
      <section className="border-y border-white/[0.06] bg-deep">
        <Container className="grid gap-px sm:grid-cols-3">
          {MICRO_TRUST.map((t) => (
            <div key={t.label} className="flex items-center gap-3 py-6">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-pj-primary/15 text-pj-secondary">
                <t.icon className="size-4.5" strokeWidth={1.5} aria-hidden />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{t.label}</p>
                <p className="text-xs text-ink-muted">{t.sub}</p>
              </div>
            </div>
          ))}
        </Container>
      </section>

      <ClientLogos />

      {/* Why Doxa, asymmetric bento */}
      <Section variant="surface">
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
      <Section variant="muted">
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
            <span
              aria-hidden
              className="absolute left-0 right-0 top-5 hidden h-px bg-gradient-to-r from-transparent via-pj-primary/40 to-transparent md:block"
            />
            <ol className="grid gap-10 md:grid-cols-4 md:gap-6">
              {STEPS.map((s) => (
                <li key={s.n} className="relative">
                  <span className="relative z-10 inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-surface font-display text-base font-semibold text-pj-secondary shadow-[0_0_30px_-6px_rgba(178,119,211,0.8)]">
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
        <Reveal>
          <div className="mt-12">
            <ImageShowcase />
          </div>
        </Reveal>
      </Section>

      {/* Featured work */}
      <Section variant="muted">
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

      {/* Trust panel, editorial split */}
      <Section variant="surface">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] text-ink sm:text-4xl">
                We show our faces, and our paperwork.
              </h2>
              <p className="mt-4 max-w-md text-lg text-ink-muted">
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

      <CtaBand />
    </>
  );
}

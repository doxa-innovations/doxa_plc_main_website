import Link from "next/link";
import {
  ShieldCheck,
  Wallet,
  Handshake,
  Video,
  ArrowRight,
} from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import { SITE } from "@/content/site";
import { SERVICES } from "@/content/services";
import { featuredProjects } from "@/content/projects";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/SectionHeading";
import { ClientLogos } from "@/components/marketing/ClientLogos";
import { ServiceCard } from "@/components/marketing/ServiceCard";
import { ProjectCard } from "@/components/marketing/ProjectCard";
import { TrustSignals } from "@/components/marketing/TrustSignals";
import { CtaBand } from "@/components/marketing/CtaBand";

export const metadata = buildMetadata({ path: "/" });

const VALUES = [
  {
    icon: Wallet,
    title: "Affordable Without Compromise",
    body: "Operating from Ethiopia, one US dollar goes further — and that saving passes directly to you. Same quality. A fraction of the cost.",
  },
  {
    icon: ShieldCheck,
    title: "Legally Verified",
    body: "We're a registered PLC with a tax ID, VAT number, and a verifiable legal identity. We sign proper digital contracts. We don't disappear.",
  },
  {
    icon: Handshake,
    title: "No Payment Upfront",
    body: "We start with a conversation. Payments happen at agreed milestones, protected by contract. Zero full-payment demands before work begins.",
  },
  {
    icon: Video,
    title: "Video Call First",
    body: "Before any money is discussed, we get on a video call. You see our faces, we see yours. That's how trust starts.",
  },
];

const STEPS = [
  {
    n: 1,
    title: "Free Discovery Call",
    body: "We talk. We listen. No sales pitch.",
  },
  {
    n: 2,
    title: "Proposal & Contract",
    body: "A clear proposal and a legal digital contract, signed together.",
  },
  {
    n: 3,
    title: "Build & Review",
    body: "We build in stages. You review and approve before we move forward.",
  },
  {
    n: 4,
    title: "Launch & Support",
    body: "We deploy your product and stay available for post-launch support.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-surface">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute -left-24 top-10 size-72 rounded-full bg-pj-primary/15 blur-3xl animate-blob" />
          <div className="absolute -right-16 top-24 size-80 rounded-full bg-pj-secondary/15 blur-3xl animate-blob [animation-delay:3s]" />
        </div>
        <Container className="flex flex-col items-center gap-6 pb-20 pt-32 text-center sm:pt-36">
          <span className="rounded-full border border-pj-primary/20 bg-pj-primary/[0.06] px-4 py-1.5 text-xs font-medium text-pj-primary sm:text-sm">
            Legally Registered PLC · TIN {SITE.registration.tin} · Est.{" "}
            {SITE.registration.foundingYear} · {SITE.address.city}, Ethiopia
          </span>
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Your Software. Built Right. Delivered Affordably.
          </h1>
          <p className="max-w-2xl text-lg text-ink/70">
            Doxa Innovations is a legally registered Ethiopian software company
            building websites, e-commerce stores, and custom tools for global
            small businesses — at 40–70% below typical Western agency rates.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/contact">Let&apos;s Talk — Free Discovery Call</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/works">See Our Work</Link>
            </Button>
          </div>
        </Container>
      </section>

      <ClientLogos />

      {/* Why Doxa */}
      <Section variant="surface">
        <SectionHeading
          eyebrow="Why Doxa"
          title="Built to earn your trust"
          lead="The fears of working with an overseas team are real. Here's how we resolve each one."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="rounded-xl border border-border bg-surface p-6"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-lg bg-pj-primary/10 text-pj-primary">
                <v.icon className="size-5" aria-hidden />
              </span>
              <h3 className="mt-4 text-base font-bold text-ink">{v.title}</h3>
              <p className="mt-1.5 text-sm text-ink/70">{v.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Services preview */}
      <Section variant="muted">
        <SectionHeading
          eyebrow="What We Do"
          title="Software and digital products, end to end"
          lead="From a landing page to a multi-campus platform — we build it, ship it, and maintain it."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button asChild variant="outline">
            <Link href="/services">
              Explore all services
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </Section>

      {/* How it works preview */}
      <Section variant="surface">
        <SectionHeading
          eyebrow="How It Works"
          title="A process with no surprises"
          lead="We lead with conversation, not invoices. Here's the path from hello to launch."
        />
        <ol className="mt-12 grid gap-6 md:grid-cols-4">
          {STEPS.map((s) => (
            <li
              key={s.n}
              className="relative rounded-xl border border-border bg-surface p-6"
            >
              <span className="inline-flex size-9 items-center justify-center rounded-full bg-pj-primary font-bold text-pj-white">
                {s.n}
              </span>
              <h3 className="mt-4 text-base font-bold text-ink">{s.title}</h3>
              <p className="mt-1.5 text-sm text-ink/70">{s.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 text-center">
          <Button asChild variant="outline">
            <Link href="/how-it-works">
              See the full process
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </Section>

      {/* Featured work */}
      <Section variant="muted">
        <SectionHeading
          eyebrow="Featured Work"
          title="Real, live projects — on three continents"
          lead="Every project below is a production system you can visit right now."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button asChild variant="outline">
            <Link href="/works">
              View all projects
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </Section>

      {/* Trust signals */}
      <Section variant="surface">
        <SectionHeading
          align="left"
          eyebrow="Trust, Verified"
          title="We show our faces — and our paperwork"
          lead="Doxa Innovations is a registered private limited company. Here's the proof."
          className="mx-0"
        />
        <div className="mt-10">
          <TrustSignals />
        </div>
      </Section>

      <CtaBand />
    </>
  );
}

import Link from "next/link";
import { Sparkles, Eye, HeartHandshake, MapPin, ArrowUpRight } from "lucide-react";
// getSite() returns the full SiteConfig with contact details overlaid from the
// CMS; everything not editable (including mapEmbedUrl) falls through unchanged.
import { getSite, getTeam, longLocation } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { GridField, FrameMarks } from "@/components/visual/Decor";
import { ReachMap } from "@/components/visual/ReachMap";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { FoundersBlock } from "@/components/marketing/FoundersBlock";
import { LegalDetails } from "@/components/marketing/LegalDetails";
import { Button } from "@/components/ui/button";
import { isEthiopianVisitor } from "@/lib/geo";

export const metadata = buildMetadata({
  title: "About Doxa Innovations",
  description:
    "Doxa Innovations is a registered Ethiopian software company building websites, e-commerce, and custom software for businesses worldwide. Meet the team and verify our legal standing.",
  path: "/about",
});

const VALUES = [
  {
    icon: Sparkles,
    title: "Creativity",
    body: "We design and build with craft, not templates, products that look as considered as they are reliable.",
  },
  {
    icon: Eye,
    title: "Transparency",
    body: "Open process, clear contracts, and verifiable legal standing. You always know who you're working with.",
  },
  {
    icon: HeartHandshake,
    title: "Faithfulness",
    body: "We do what we say. We stay through launch and beyond. We don't disappear mid-project.",
  },
];

export default async function AboutPage() {
  const [isEthiopia, team, SITE] = await Promise.all([
    isEthiopianVisitor(),
    getTeam(),
    getSite(),
  ]);
  // Same explicit flag the /team page splits on.
  const founders = team.filter((m) => m.founder);

  return (
    <>
      <PageHeader
        eyebrow="About"
        title="A software company you can actually get to know"
        lead="Where we are, what drives us, and why we can deliver enterprise-grade work at prices that make sense for your budget."
      />

      {/* Company story */}
      <Section variant="surface">
        <Reveal>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <SectionHeading
                align="left"
                title="From Ethiopia to a global software partner"
                className="mx-auto sm:mx-0"
              />
              <div className="mt-6 space-y-4 text-center text-lg text-ink-muted sm:text-left">
                <p>
                  Doxa Innovations is a registered Ethiopian software company. We
                  build websites, e-commerce stores, mobile apps, and custom
                  tools for businesses worldwide, with clients from the US and
                  the Netherlands to institutions across East Africa.
                </p>
                <p>
                  How we work hasn&apos;t changed: creativity, transparency, and
                  faithfulness in every engagement.
                </p>
              </div>
            </div>
            {/* Destinations are the countries we have actually delivered for,
                read off content/projects.ts — not decorative pins. */}
            <div className="relative overflow-hidden rounded-[1.5rem] border border-line bg-deep p-4 sm:p-6">
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 size-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pj-primary/20 blur-[110px]"
              />
              <ReachMap className="relative w-full" />
            </div>
          </div>
        </Reveal>
      </Section>

      {/* Mission & values */}
      <Section variant="surface" frame grid>
        <SectionHeading title="Three values, in everything we ship" />
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="rounded-[1.4rem] border border-line bg-panel p-6"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-xl border border-line bg-pj-primary/15 text-brand shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                <v.icon className="size-5" aria-hidden />
              </span>
              <h3 className="mt-4 text-base font-bold text-ink">{v.title}</h3>
              <p className="mt-1.5 text-sm text-ink/70">{v.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* The name — uses the preserved "special theme" deep-glow band, so it
          reads as a pause between the values and the people. */}
      <section className="special-theme py-20 sm:py-28">
        <GridField />
        <FrameMarks variant="plus" />
        <Container className="relative">
          <Reveal>
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="text-center sm:text-left">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                  <span
                    aria-hidden
                    className="size-1.5 rounded-full bg-pj-secondary"
                  />
                  Doxa
                </p>
                <h2 className="mt-4 text-balance font-display text-3xl font-semibold tracking-[-0.03em] text-ink sm:text-4xl lg:text-5xl">
                  Who we are
                </h2>
                <div className="mt-6 space-y-4 text-lg text-ink-muted">
                  <p>
                    Doxa is the Greek word{" "}
                    <span lang="el" className="text-ink">
                      δόξα
                    </span>{" "}
                    — glory: the weight and honour a thing carries when it is
                    done properly.
                  </p>
                  <p>
                    We chose it because it names a standard rather than a
                    service. The crown in our mark is the same idea in one
                    shape: build work worth putting your name to, and let the
                    result speak for itself.
                  </p>
                </div>
              </div>

              {/* The mark as emblem: halo, orbit rings, and the crown lit from
                  within. The SVG's fill is a baked #7851A9, so it needs the
                  brightness lift to carry at this size. */}
              <div
                aria-hidden
                className="relative mx-auto grid aspect-square w-full max-w-sm place-items-center"
              >
                <div className="absolute size-[65%] rounded-full bg-pj-primary/30 blur-[90px]" />
                {[46, 64, 82].map((pct) => (
                  <span
                    key={pct}
                    className="absolute rounded-full border border-grid-strong"
                    style={{ width: `${pct}%`, height: `${pct}%` }}
                  />
                ))}
                <img
                  src="/logo.svg"
                  alt=""
                  className="relative w-[34%] brightness-125 drop-shadow-[0_0_60px_rgba(178,119,211,0.65)]"
                />
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Founders — the condensed card. The full team lives on /team, so this
          page previews the people who answer for the company and links on. */}
      <Section variant="muted" frame>
        <SectionHeading
          title="Our Founders"
          lead="The people who answer for the company."
        />
        <div className="mt-12">
          <FoundersBlock members={founders} compact />
        </div>
        <div className="mt-10 text-center">
          <Button asChild variant="outline">
            <Link href="/team">Meet the whole team</Link>
          </Button>
        </div>
      </Section>

      {/* Legal transparency */}
      <Section variant="surface">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            align="left"
            title="Our Credentials"
            lead="A registered private limited company in Ethiopia. Verifiable, on the record."
            className="mx-auto sm:mx-0"
          />
          <div className="mt-8">
            <LegalDetails showVerification={!isEthiopia} />
          </div>
        </div>
      </Section>

      {/* Visit us */}
      <Section variant="muted" frame>
        <Reveal>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <SectionHeading
                align="left"
                title="Visit us in Bishoftu"
                lead="We're a real team in a real office. Come by, or open the map to find us."
                className="mx-auto sm:mx-0"
              />
              <p className="mt-5 flex items-start justify-center gap-2 text-center text-ink-muted sm:justify-start sm:text-left">
                <MapPin
                  className="mt-0.5 size-5 shrink-0 text-brand"
                  strokeWidth={1.5}
                  aria-hidden
                />
                {longLocation(SITE.address)}
              </p>
              <div className="mt-6 text-center sm:text-left">
                <Button asChild>
                  <a
                    href={SITE.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open in Google Maps
                    <ArrowUpRight className="size-4" strokeWidth={2} />
                  </a>
                </Button>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-line shadow-[0_40px_90px_-50px_rgba(124,60,180,0.7)] ring-1 ring-pj-primary/20">
              <iframe
                src={SITE.mapEmbedUrl}
                title="Doxa Innovations office location on Google Maps"
                className="absolute inset-0 h-full w-full"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}

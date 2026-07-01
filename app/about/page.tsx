import Image from "next/image";
import Link from "next/link";
import { Sparkles, Eye, HeartHandshake, MapPin, ArrowUpRight } from "lucide-react";
import { SITE } from "@/content/site";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { TeamGrid } from "@/components/marketing/TeamGrid";
import { LegalDetails } from "@/components/marketing/LegalDetails";
import { CtaBand } from "@/components/marketing/CtaBand";
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
  const isEthiopia = await isEthiopianVisitor();
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="A software company you can actually get to know"
        lead="Where we are, what drives us, and why we can deliver enterprise-grade work at prices that make sense for your budget."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]}
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
            {/* TODO: replace with a real photo of the Bishoftu studio. */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-line bg-surface-muted">
              <Image
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=70"
                alt="Inside the Doxa studio (placeholder)"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                unoptimized
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep/60 to-transparent" />
            </div>
          </div>
        </Reveal>
      </Section>

      {/* Bishoftu advantage */}
      <Section variant="muted" frame>
        <Reveal>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            {/* TODO: replace with a real photo of the Bishoftu team/office. */}
            <div className="relative order-last aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-line bg-surface-muted lg:order-first">
              <Image
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=70"
                alt="Doxa engineers and designers at work (placeholder)"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                unoptimized
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep/60 to-transparent" />
            </div>
            <div>
              <SectionHeading
                align="left"
                title="Lower cost. Same quality."
                className="mx-auto sm:mx-0"
              />
              <div className="mt-6 space-y-4 text-center text-lg text-ink-muted sm:text-left">
                <p>
                  Operating from Bishoftu isn&apos;t a discount, it&apos;s
                  optimized operations. One US dollar funds significantly more
                  professional work here than it does in Boston or Berlin, and
                  that benefit is passed directly to you.
                </p>
                <p>
                  Our engineers and designers are trained, experienced
                  professionals working in a fully equipped office. You get the
                  same standards a Western agency would deliver, at 40 to 70%
                  less.
                </p>
              </div>
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

      {/* Team */}
      <Section variant="muted" frame>
        <SectionHeading
          title="Real people, real faces"
          lead="The single most powerful trust signal we can offer: the people who'll actually build your product."
        />
        <div className="mt-12">
          <TeamGrid />
        </div>
        <div className="mt-10 text-center">
          <Button asChild variant="outline">
            <Link href="/team">Read full team bios</Link>
          </Button>
        </div>
      </Section>

      {/* Legal transparency */}
      <Section variant="surface">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            align="left"
            title="Our registration, in the open"
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
                {SITE.address.street}, {SITE.address.city},{" "}
                {SITE.address.region}, {SITE.address.country}
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

      <CtaBand />
    </>
  );
}

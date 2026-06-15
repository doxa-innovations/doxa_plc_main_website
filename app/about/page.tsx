import Image from "next/image";
import Link from "next/link";
import { Sparkles, Eye, HeartHandshake } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { TeamGrid } from "@/components/marketing/TeamGrid";
import { LegalDetails } from "@/components/marketing/LegalDetails";
import { CtaBand } from "@/components/marketing/CtaBand";
import { Button } from "@/components/ui/button";

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

export default function AboutPage() {
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
                className="mx-0"
              />
              <div className="mt-6 space-y-4 text-lg text-ink-muted">
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
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-white/10 bg-surface-muted">
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
      <Section variant="muted">
        <Reveal>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            {/* TODO: replace with a real photo of the Bishoftu team/office. */}
            <div className="relative order-last aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-white/10 bg-surface-muted lg:order-first">
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
                className="mx-0"
              />
              <div className="mt-6 space-y-4 text-lg text-ink-muted">
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
      <Section variant="surface">
        <SectionHeading title="Three values, in everything we ship" />
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="rounded-[1.4rem] border border-white/10 bg-white/[0.02] p-6"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-xl border border-white/10 bg-pj-primary/15 text-pj-secondary shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                <v.icon className="size-5" aria-hidden />
              </span>
              <h3 className="mt-4 text-base font-bold text-ink">{v.title}</h3>
              <p className="mt-1.5 text-sm text-ink/70">{v.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Team */}
      <Section variant="muted">
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
            className="mx-0"
          />
          <div className="mt-8">
            <LegalDetails />
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}

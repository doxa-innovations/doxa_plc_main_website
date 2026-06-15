import Link from "next/link";
import { Check, Info } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import { PRICING_TIERS, ADD_ONS } from "@/content/pricing";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CtaBand } from "@/components/marketing/CtaBand";

export const metadata = buildMetadata({
  title: "Pricing",
  description:
    "Transparent starting prices and tiers — Starter, Growth, and Custom — plus add-ons for maintenance, SEO, social, and priority support. Every project is scoped individually, with no quote before a free discovery call.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="Clear starting points, no surprises"
        lead="These are guides, not quotes. Every project is scoped individually — we find the right scope for your budget, not the biggest invoice."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Pricing", path: "/pricing" },
        ]}
      />

      {/* Tiers */}
      <Section variant="surface">
        <div className="grid items-start gap-6 lg:grid-cols-3">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "flex h-full flex-col rounded-[1.6rem] border bg-white/[0.02] p-7 transition-[transform,border-color] duration-300 hover:-translate-y-0.5",
                tier.highlighted
                  ? "border-pj-secondary/50 bg-pj-primary/[0.07] shadow-[0_40px_100px_-50px_rgba(178,119,211,0.95)] ring-1 ring-pj-secondary/40"
                  : "border-white/10 hover:border-white/20",
              )}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-ink">{tier.name}</h2>
                {tier.highlighted && (
                  <Badge className="bg-pj-primary text-pj-white">
                    Most Popular
                  </Badge>
                )}
              </div>
              <p className="mt-2 min-h-10 text-sm text-ink/70">{tier.bestFor}</p>
              <p className="mt-5 text-3xl font-extrabold text-ink">
                {tier.priceFrom}
              </p>
              <div className="mt-4 space-y-1 text-sm text-ink/60">
                <dl className="flex justify-between">
                  <dt>Timeline</dt>
                  <dd className="font-medium text-ink/80">{tier.timeline}</dd>
                </dl>
                <dl className="flex justify-between">
                  <dt>Payment</dt>
                  <dd className="font-medium text-ink/80">{tier.payment}</dd>
                </dl>
              </div>
              <ul className="mt-6 flex-1 space-y-2.5">
                {tier.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-ink/80">
                    <Check className="mt-0.5 size-4 shrink-0 text-pj-secondary" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className="mt-7 w-full"
                variant={tier.highlighted ? "default" : "outline"}
              >
                <Link href="/contact">
                  {tier.priceFrom === "On request"
                    ? "Book a scoping call"
                    : "Get started"}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </Section>

      {/* Add-ons */}
      <Section variant="muted">
        <SectionHeading
          eyebrow="Add-Ons"
          title="Ongoing services, when you need them"
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ADD_ONS.map((addon) => (
            <div
              key={addon.name}
              className="rounded-[1.25rem] border border-white/10 bg-white/[0.02] p-6"
            >
              <h3 className="text-base font-bold text-ink">{addon.name}</h3>
              <p className="mt-1 text-sm font-semibold text-pj-secondary">
                {addon.priceFrom}
              </p>
              <p className="mt-2 text-sm text-ink/70">{addon.detail}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 flex max-w-3xl gap-3 rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-5">
          <Info className="mt-0.5 size-5 shrink-0 text-pj-secondary" aria-hidden />
          <p className="text-sm text-ink/80">
            All prices are starting points and guides. Every project is scoped
            individually, and no quote is given without a discovery conversation.
            Our goal is to find the right scope for your budget — not to upsell
            you.
          </p>
        </div>
      </Section>

      <CtaBand
        title="Not sure which tier fits?"
        body="Tell us about your project on a free call and we'll recommend the right scope — honestly."
      />
    </>
  );
}

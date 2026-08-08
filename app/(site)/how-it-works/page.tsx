import Image from "next/image";
import { buildMetadata } from "@/lib/metadata";
import { PROCESS_STAGES } from "@/content/process";
import { FAQS } from "@/content/faq";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/SectionHeading";
import { ProcessSteps, ProcessStep } from "@/components/marketing/ProcessSteps";
import { PaymentTimeline } from "@/components/marketing/PaymentTimeline";
import { FaqSection } from "@/components/marketing/FaqSection";

export const metadata = buildMetadata({
  title: "How It Works",
  description:
    "Exactly what working with Doxa looks like, from a free discovery call to a signed digital contract, staged delivery, and full handover. No upfront payment, no surprises.",
  path: "/how-it-works",
});

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader
        eyebrow="How It Works"
        title="A process built to eliminate uncertainty"
        lead="No vague marketing language, just the real, sequential steps of working with Doxa, so you always know what comes next."
      />

      {/* Process stepper: alternating image/text rows with a wavy spine.
          This page ramps from near-white here to the full violet canvas at the
          FAQ; the ink flips once, inside the content-free bridge below. */}
      <Section variant="surface" frame grid>
        <SectionHeading title="Six stages, start to finish" />
        <div className="relative mt-16">
          {/* Squiggly connector (decorative, desktop) */}
          <svg
            aria-hidden
            preserveAspectRatio="none"
            viewBox="0 0 100 1200"
            className="absolute left-1/2 top-0 hidden h-full w-24 -translate-x-1/2 md:block"
          >
            <path
              d="M50 0 C 88 100, 12 200, 50 300 S 88 500, 50 600 S 12 800, 50 900 S 88 1100, 50 1200"
              fill="none"
              stroke="url(#spine)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="spine" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#b277d3" stopOpacity="0" />
                <stop offset="50%" stopColor="#b277d3" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#7851a9" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          <ProcessSteps>
            <ol className="space-y-14 md:space-y-24">
              {PROCESS_STAGES.map((stage, i) => {
                const flip = i % 2 === 1;
                return (
                  <li key={stage.number}>
                    <ProcessStep index={i}>
                      <div className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
                        <div
                          className={cn(
                            "relative aspect-[16/10] overflow-hidden rounded-[1.4rem] border border-line bg-surface-muted",
                            flip && "md:order-2",
                          )}
                        >
                          <Image
                            src={stage.image}
                            alt={stage.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 45vw"
                            unoptimized
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-deep/70 to-transparent" />
                        </div>
                        <div className={cn("text-center md:text-left", flip && "md:order-1")}>
                          <span className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-pj-primary font-display text-lg font-semibold text-pj-white shadow-[0_0_30px_-6px_rgba(178,119,211,0.9)]">
                            {stage.number}
                          </span>
                          <h3 className="mt-4 font-display text-xl font-semibold text-ink">
                            {stage.title}
                          </h3>
                          <p className="mt-2 text-ink-muted">{stage.description}</p>
                        </div>
                      </div>
                    </ProcessStep>
                  </li>
                );
              })}
            </ol>
          </ProcessSteps>
        </div>
      </Section>

      {/* Payment timeline — one step further along the ramp */}
      <Section variant="muted" frame>
        <SectionHeading
          title="The 30 / 40 / 30 milestone model"
          lead="No full upfront payment, ever. You pay in stages, and each payment unlocks the next."
        />
        <div className="mx-auto mt-10 max-w-3xl">
          <PaymentTimeline />
          <p className="mt-4 text-center text-xs text-ink-muted">
            Exact milestones are set per project in your signed contract. The
            percentages above are our standard model and can be tailored to your
            scope.
          </p>
        </div>
      </Section>

      {/* FAQ — full violet canvas, the page's resting state */}
      <Section variant="surface">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            title="Your questions, answered"
            lead="The things international clients ask us most often."
          />
          <div className="mt-10">
            <FaqSection items={FAQS} />
          </div>
        </div>
      </Section>
    </>
  );
}

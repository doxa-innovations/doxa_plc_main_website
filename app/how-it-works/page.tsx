import { buildMetadata } from "@/lib/metadata";
import { PROCESS_STAGES } from "@/content/process";
import { FAQS } from "@/content/faq";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/SectionHeading";
import { PaymentTimeline } from "@/components/marketing/PaymentTimeline";
import { FaqSection } from "@/components/marketing/FaqSection";
import { CtaBand } from "@/components/marketing/CtaBand";

export const metadata = buildMetadata({
  title: "How It Works",
  description:
    "Exactly what working with Doxa looks like — from a free discovery call to a signed digital contract, staged delivery, and full handover. No upfront payment, no surprises.",
  path: "/how-it-works",
});

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader
        eyebrow="How It Works"
        title="A process built to eliminate uncertainty"
        lead="No vague marketing language — just the real, sequential steps of working with Doxa, so you always know what comes next."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "How It Works", path: "/how-it-works" },
        ]}
      />

      {/* Process stepper */}
      <Section variant="surface">
        <SectionHeading
          align="left"
          eyebrow="The Engagement"
          title="Six stages, start to finish"
          className="mx-0"
        />
        <ol className="mt-12 space-y-0">
          {PROCESS_STAGES.map((stage, i) => (
            <li key={stage.number} className="relative flex gap-5 pb-10 last:pb-0">
              {i < PROCESS_STAGES.length - 1 && (
                <span
                  aria-hidden
                  className="absolute left-5 top-12 h-[calc(100%-2rem)] w-px bg-border"
                />
              )}
              <span className="relative z-10 inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-pj-primary font-bold text-pj-white">
                {stage.number}
              </span>
              <div className="pt-1">
                <h3 className="text-lg font-bold text-ink">{stage.title}</h3>
                <p className="mt-1.5 max-w-2xl text-ink/70">
                  {stage.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* Payment timeline */}
      <Section variant="muted">
        <SectionHeading
          eyebrow="Payment"
          title="The 30 / 40 / 30 milestone model"
          lead="No full upfront payment, ever. You pay in stages, and each payment unlocks the next."
        />
        <div className="mx-auto mt-10 max-w-3xl">
          <PaymentTimeline />
        </div>
      </Section>

      {/* FAQ */}
      <Section variant="surface">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            eyebrow="FAQ"
            title="Your questions, answered"
            lead="The things international clients ask us most often."
          />
          <div className="mt-10">
            <FaqSection items={FAQS} />
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}

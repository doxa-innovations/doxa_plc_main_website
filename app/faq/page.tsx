import { buildMetadata } from "@/lib/metadata";
import { FAQ_VIDEOS } from "@/content/faqVideos";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/Reveal";
import { VideoEmbed } from "@/components/VideoEmbed";
import { CtaBand } from "@/components/marketing/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqPageSchema, graph } from "@/lib/jsonld";

export const metadata = buildMetadata({
  title: "FAQ",
  description:
    "Answers to the questions international clients ask most, on video: how we work, how we stay affordable, how you can verify we're a real registered company, and what protects your money.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title="The honest answers, on video"
        lead="We filmed short answers to the questions every international client asks. Watch the ones that matter to you."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "FAQ", path: "/faq" },
        ]}
      />

      <Section variant="surface">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {FAQ_VIDEOS.map((item, i) => (
            <Reveal key={item.question}>
              <div className="flex h-full flex-col rounded-[1.5rem] border border-white/10 bg-white/[0.02] p-5">
                <VideoEmbed
                  orientation="portrait"
                  src={item.videoSrc}
                  title={`Q${i + 1}`}
                  className="mx-auto w-full max-w-[230px]"
                />
                <h2 className="mt-5 font-display text-lg font-semibold text-ink">
                  {item.question}
                </h2>
                <p className="mt-2 text-sm text-ink-muted">{item.answer}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBand
        title="Still have a question?"
        body="Ask us anything on a free call. No obligation, no upfront payment, no pressure."
      />

      <JsonLd schema={graph(faqPageSchema(FAQ_VIDEOS))} />
    </>
  );
}

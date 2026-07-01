import { buildMetadata } from "@/lib/metadata";
import { FAQ_VIDEOS } from "@/content/faqVideos";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { FaqVideos } from "@/components/marketing/FaqVideos";
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

      <Section variant="muted" frame>
        <FaqVideos items={FAQ_VIDEOS} />
      </Section>

      <CtaBand
        title="Still have a question?"
        body="Ask us anything on a free call. No obligation, no upfront payment, no pressure."
      />

      <JsonLd schema={graph(faqPageSchema(FAQ_VIDEOS))} />
    </>
  );
}

import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/metadata";
// PAUSED — restore these with the page body below.
// import { FAQ_VIDEOS } from "@/content/faqVideos";
// import { PageHeader } from "@/components/layout/PageHeader";
// import { Section } from "@/components/layout/Section";
// import { FaqVideos } from "@/components/marketing/FaqVideos";
// import { JsonLd } from "@/components/seo/JsonLd";
// import { faqPageSchema, graph } from "@/lib/jsonld";

/**
 * SWITCHED OFF until the FAQ clips are filmed. Nothing here is deleted.
 *
 * The page's whole premise is "the honest answers, on video" — it is four
 * video tiles and nothing else. The clips do not exist yet, so every tile in
 * content/faqVideos.ts points at the office walkthrough as a placeholder, and
 * the page would promise four answers and play the same unrelated video four
 * times. That is worse than the page being absent.
 *
 * `notFound()` rather than a deleted file or a redirect, deliberately:
 *   - the real page is preserved directly below, so bringing it back is
 *     deleting a call and uncommenting a block;
 *   - a 404 is the honest status for a page with no content behind it. A
 *     redirect to /how-it-works would tell Google the two pages are the same
 *     thing and fold any FAQ ranking into it, which is hard to undo later.
 *
 * Switched off with it, and to be restored at the same time:
 *   - the footer's "FAQ" link          (content/site.ts, footerNav.legal)
 *   - the sitemap entry                (app/sitemap.ts, STATIC_ROUTES)
 *   - the llms.txt entry               (app/llms.txt/route.ts)
 *   - the FAQ band on the thank-you page (app/(site)/thank-you/page.tsx)
 *
 * The FAQ text answers are NOT affected. They live in content/faq.ts, render
 * on /how-it-works, and still emit FAQPage structured data from there — so the
 * questions themselves stay answered and indexable while this is off.
 */
export const metadata = buildMetadata({
  title: "FAQ",
  description:
    "Answers to the questions international clients ask most, on video: how we work, how we stay affordable, how you can verify we're a real registered company, and what protects your money.",
  path: "/faq",
  noIndex: true,
});

export default function FaqPage() {
  notFound();
}

/*
export default function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title="The honest answers, on video"
        lead="We filmed short answers to the questions every international client asks. Watch the ones that matter to you."
      />

      <Section variant="muted" frame>
        <FaqVideos items={FAQ_VIDEOS} />
      </Section>

      <JsonLd schema={graph(faqPageSchema(FAQ_VIDEOS))} />
    </>
  );
}
*/

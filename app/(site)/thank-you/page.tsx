import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import { FAQ_VIDEOS } from "@/content/faqVideos";
import {
  WALKTHROUGH_VIDEO,
  WALKTHROUGH_POSTER,
  WALKTHROUGH_CAPTIONS,
} from "@/content/media";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { OfficeVideo } from "@/components/marketing/OfficeVideo";
import { FaqVideos } from "@/components/marketing/FaqVideos";
import { Button } from "@/components/ui/button";

export const metadata = buildMetadata({
  title: "Thank You",
  description: "Thank you for reaching out to Doxa Innovations.",
  path: "/thank-you",
  noIndex: true,
});

export default function ThankYouPage() {
  return (
    <>
      {/* Intro — clean, no background decoration */}
      <section className="relative overflow-hidden bg-surface pb-10 pt-36">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 size-[44rem] -translate-x-1/2 rounded-full bg-pj-primary/20 blur-[130px]"
        />
        <Container className="relative max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3.5 py-1.5 text-xs font-medium text-brand">
            <span className="size-1.5 rounded-full bg-pj-secondary" />
            Message received
          </p>
          <h1 className="mt-6 text-balance font-display text-4xl font-semibold tracking-[-0.03em] text-ink sm:text-5xl">
            Thank you for reaching out.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-lg text-ink-muted">
            We&apos;re glad you did. A real person on our team will read your
            message and reply within 24 hours on business days.
          </p>
        </Container>
      </section>

      {/* Walkthrough video — press the expand control for a large (full-screen) view */}
      <Container className="pb-10">
        <div className="mx-auto max-w-4xl">
          <OfficeVideo
            src={WALKTHROUGH_VIDEO}
            poster={WALKTHROUGH_POSTER}
            captions={WALKTHROUGH_CAPTIONS}
            title="A walkthrough of Doxa Innovations"
          />
        </div>
      </Container>

      {/* Appreciation note */}
      <Container className="pb-14">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] text-ink sm:text-3xl">
            Thank you, sincerely.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-lg text-ink-muted">
            We appreciate you trusting us with your project, and we&apos;d love
            the chance to keep building together. Whatever you need next, we&apos;re
            ready when you are.
          </p>
        </div>
      </Container>

      {/* FAQ videos — same component as the FAQ page */}
      <section className="bg-surface pb-16 sm:pb-20">
        <Container>
          <SectionHeading
            title="Frequently asked questions"
            lead="A few quick answers, on video, while you wait to hear from us."
          />
          <div className="mt-12">
            <FaqVideos items={FAQ_VIDEOS} />
          </div>
        </Container>
      </section>

      {/* Onward */}
      <Container className="pb-24">
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/works">
              See our work
              <ArrowRight className="size-4" strokeWidth={1.75} />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Go back home</Link>
          </Button>
        </div>
      </Container>
    </>
  );
}

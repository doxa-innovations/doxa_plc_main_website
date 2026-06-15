import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { VideoEmbed } from "@/components/VideoEmbed";
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
      <section className="relative overflow-hidden bg-surface pb-12 pt-36">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 size-[44rem] -translate-x-1/2 rounded-full bg-pj-primary/20 blur-[130px]"
        />
        <Container className="relative max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-pj-secondary">
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

      <Container className="pb-8">
        <div className="mx-auto max-w-3xl">
          <VideoEmbed orientation="landscape" title="A quick hello from the team" />
        </div>
      </Container>

      <Section variant="surface" className="pt-6">
        <div className="mx-auto max-w-3xl">
          <div className="flex gap-3 rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-5">
            <Clock className="mt-0.5 size-5 shrink-0 text-pj-secondary" aria-hidden />
            <div className="text-sm text-ink/80">
              <span className="font-semibold text-ink">What happens next:</span>{" "}
              we&apos;ll reply by email to set up a free discovery call. No
              upfront payment, no pressure. For anything urgent, WhatsApp or
              Telegram is the fastest way to reach us.
            </div>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild variant="outline">
              <Link href="/works">
                See our work
                <ArrowRight className="size-4" strokeWidth={1.75} />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}

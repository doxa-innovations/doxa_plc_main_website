import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/Container";

/**
 * High-contrast closing call-to-action, a dramatic deep-glow moment. The
 * primary label stays consistent across the site ("Start a project") to keep
 * one label per CTA intent.
 */
export function CtaBand({
  title = "Ready to build something great?",
  body = "We don't pitch you, we listen. Book a free discovery call and let's figure out what you actually need. No upfront payment, no pressure.",
  primaryLabel = "Start a project",
  primaryHref = "/contact",
}: {
  title?: string;
  body?: string;
  primaryLabel?: string;
  primaryHref?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-deep py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 size-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pj-primary/25 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.4] [background:radial-gradient(60%_60%_at_50%_50%,rgba(178,119,211,0.12),transparent)]"
      />
      <Container className="relative text-center">
        <h2 className="mx-auto max-w-2xl text-balance font-display text-3xl font-semibold tracking-[-0.03em] text-ink sm:text-5xl">
          {title}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-pretty text-lg text-ink-muted">
          {body}
        </p>
        <div className="mt-9 flex justify-center">
          <Link
            href={primaryHref}
            className="group inline-flex items-center gap-2 rounded-full bg-primary py-3.5 pl-6 pr-3 text-base font-medium text-primary-foreground shadow-[0_18px_50px_-14px_rgba(178,119,211,0.95)] transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98]"
          >
            {primaryLabel}
            <span className="grid size-8 place-items-center rounded-full bg-white/15 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowUpRight className="size-4" strokeWidth={2} />
            </span>
          </Link>
        </div>
      </Container>
    </section>
  );
}

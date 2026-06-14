import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/button";

/**
 * High-contrast closing call-to-action band on the brand accent background.
 * Reused at the bottom of most pages.
 */
export function CtaBand({
  title = "Ready to build something great?",
  body = "We don't pitch you. We listen to you. Book a free discovery call and let's figure out what you actually need.",
  primaryLabel = "Schedule a Free Call",
  primaryHref = "/contact",
}: {
  title?: string;
  body?: string;
  primaryLabel?: string;
  primaryHref?: string;
}) {
  return (
    <Section variant="accent" className="text-center">
      <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-pj-white sm:text-4xl">
        {title}
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-lg text-pj-white/75">{body}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button
          asChild
          size="lg"
          className="bg-pj-white text-pj-accent hover:bg-pj-white/90"
        >
          <Link href={primaryHref}>{primaryLabel}</Link>
        </Button>
      </div>
    </Section>
  );
}

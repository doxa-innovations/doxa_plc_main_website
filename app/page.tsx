import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { buildMetadata } from "@/lib/metadata";
import { SITE } from "@/content/site";

export const metadata = buildMetadata({ path: "/" });

// Phase 0 placeholder. The full homepage (hero, trust bar, why-doxa, services
// preview, process, featured work, trust signals, testimonials, CTA) lands in
// Phase 1.
export default function HomePage() {
  return (
    <section className="bg-surface">
      <Container className="flex min-h-[70vh] flex-col items-center justify-center gap-6 py-32 text-center">
        <span className="rounded-full bg-pj-primary/10 px-4 py-1.5 text-sm font-medium text-pj-primary">
          Legally Registered PLC · TIN {SITE.registration.tin} · Est.{" "}
          {SITE.registration.foundingYear} · Bishoftu, Ethiopia
        </span>
        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-ink sm:text-5xl lg:text-6xl">
          Your Software. Built Right. Delivered Affordably.
        </h1>
        <p className="max-w-2xl text-lg text-ink/70">{SITE.description}</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/contact">Let&apos;s Talk — Free Discovery Call</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/works">See Our Work</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}

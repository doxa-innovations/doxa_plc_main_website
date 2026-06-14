import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center gap-5 py-32 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-pj-primary">
        404
      </p>
      <h1 className="max-w-xl text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        We couldn&apos;t find that page
      </h1>
      <p className="max-w-md text-ink/70">
        The link may be broken or the page may have moved. Let&apos;s get you
        back on track.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/works">See our work</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/contact">Contact us</Link>
        </Button>
      </div>
    </Container>
  );
}

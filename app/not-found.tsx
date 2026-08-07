import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { RouteLoaderProvider } from "@/components/loading/RouteLoaderProvider";

/**
 * The global 404, for URLs that match no route at all.
 *
 * This one sits at the app root rather than inside `(site)`, because an
 * unmatched URL belongs to no route group and so never reaches the site
 * layout. It therefore renders the navbar and footer itself. A visitor who
 * mistyped a path is exactly the person who most needs navigation — and, for
 * the same reason, its own copy of the route-transition curtain, which the
 * site layout would otherwise have provided.
 */
export default function NotFound() {
  return (
    <RouteLoaderProvider>
      {/* Outside the (site) group, so this page mounts the canvas itself. */}
      <div className="aurora-canvas isolate">
        <Navbar />
      <main>
        <Container className="flex min-h-[70vh] flex-col items-center justify-center gap-5 py-32 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">
            404
          </p>
          <h1 className="max-w-xl text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            We couldn&apos;t find that page
          </h1>
          <p className="max-w-md text-ink/70">
            The link may be broken or the page may have moved. Let&apos;s get
            you back on track.
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
      </main>
        <Footer />
      </div>
    </RouteLoaderProvider>
  );
}

import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { FrameMarks, GridField } from "@/components/visual/Decor";
import { getCurrentUser } from "@/lib/auth";

import { LoginForm } from "./LoginForm";

/**
 * The way in.
 *
 * `robots: noindex` here plus the `X-Robots-Tag` header on /olympus/:path* in
 * next.config.ts. The route is deliberately absent from robots.txt and the
 * sitemap, since listing it there is how you publish the location of the door
 * you were trying to keep quiet.
 *
 * The obscure path is convenience, not security. Everything behind it is
 * server-side auth gated, rate limited, and lockout protected.
 */
export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false, nocache: true },
};

// Never prerendered: it reads the session to bounce an already-signed-in user,
// and the Docker build has no database to read it from.
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  // Already signed in? Skip the form.
  if (await getCurrentUser()) redirect("/olympus");

  return (
    <div className="relative isolate flex min-h-[100dvh] items-center overflow-hidden bg-surface pb-20 pt-32 sm:pt-36">
      <GridField />
      <FrameMarks variant="plus" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 size-[44rem] -translate-x-1/2 rounded-full bg-pj-primary/15 blur-[120px]"
      />

      <Container className="relative">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 text-center">
            <img
              src="/logo.svg"
              alt=""
              aria-hidden
              className="mx-auto size-10 drop-shadow-[0_0_10px_rgba(178,119,211,0.5)]"
            />
            <h1 className="mt-5 font-display text-3xl font-semibold tracking-[-0.03em] text-ink">
              Olympus
            </h1>
            <p className="mt-2 text-sm text-ink-muted">
              Sign in to manage the site.
            </p>
          </div>

          {/* Same panel treatment as the contact form: a white card on the
              violet field. The `light` class flips the semantic tokens. */}
          <div className="light rounded-[1.6rem] border border-line bg-surface p-6 shadow-[0_40px_90px_-50px_rgba(124,60,180,0.6)] sm:p-8">
            <LoginForm />
          </div>
        </div>
      </Container>
    </div>
  );
}

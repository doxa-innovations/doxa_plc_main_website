import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { FrameMarks, GridField } from "@/components/visual/Decor";
import { getCurrentUser } from "@/lib/auth";
import { getGoogleConfig, GOOGLE_START_URL } from "@/lib/google-auth";

import { LoginForm } from "./LoginForm";

/**
 * Set by the Google callback. The only distinction made is "wrong account",
 * so picking the wrong one in Google's chooser is obvious. Every other failure
 * shares one message; the specific reason goes to the server log.
 */
const GOOGLE_ERRORS: Record<string, string> = {
  google: "Google sign-in didn't work. Try again.",
  "google-account":
    "That Google account can't sign in here. Choose the Doxa account.",
};

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

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  // Already signed in? Skip the form.
  if (await getCurrentUser()) redirect("/olympus");

  const { error } = await searchParams;
  const googleError = error ? GOOGLE_ERRORS[error] : undefined;
  const googleEnabled = getGoogleConfig() !== null;

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
            {googleError && (
              <p role="alert" className="mb-5 text-sm text-destructive">
                {googleError}
              </p>
            )}

            {googleEnabled && (
              <>
                {/* A plain <a>, not next/link: this must be a full navigation
                    to a route handler that redirects off-site, and it must
                    never be prefetched. Absolute, so the flow always starts
                    on the host Google will call back to. */}
                <Button asChild variant="outline" size="lg" className="w-full">
                  <a href={GOOGLE_START_URL}>
                    <GoogleMark />
                    Continue with Google
                  </a>
                </Button>

                <div
                  className="my-6 flex items-center gap-3 text-xs text-ink-muted"
                  aria-hidden
                >
                  <span className="h-px flex-1 bg-line" />
                  or
                  <span className="h-px flex-1 bg-line" />
                </div>
              </>
            )}

            <LoginForm />
          </div>
        </div>
      </Container>
    </div>
  );
}

/** Google's four-colour "G", which their sign-in branding guidelines require. */
function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className="size-5">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.3-.4-3.5z"
      />
    </svg>
  );
}

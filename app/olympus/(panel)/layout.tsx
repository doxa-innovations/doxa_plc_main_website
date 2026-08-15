import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";

import { logoutAction } from "../actions";
import { OlympusNav } from "./OlympusNav";

export const metadata: Metadata = {
  title: { default: "Olympus", template: "%s · Olympus" },
  robots: { index: false, follow: false, nocache: true },
};

// Authenticated, per-request, and never cached or prerendered.
export const dynamic = "force-dynamic";

/**
 * The signed-in shell.
 *
 * `requireUser()` is called exactly once here, not per page and not per
 * component. With Payload sessions enabled each call costs a database round
 * trip to verify the token and load the user, so calling it in three
 * components would triple the queries for one boolean.
 *
 * This is a route group so /olympus/login can stay outside it. Login must not
 * sit behind requireUser(), which would redirect it to itself forever.
 *
 * Deliberately no blueprint decor, no glow fields, no scroll reveals. That is
 * marketing-band language and it competes with the numbers. Density goes up,
 * motion goes down.
 */
export default async function OlympusLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireUser();
  const name =
    (typeof user === "object" && user && "name" in user
      ? (user.name as string | null)
      : null) || user.email;

  return (
    <div className="min-h-[100dvh] bg-surface">
      <div className="mx-auto flex w-full max-w-[88rem] flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:gap-8 lg:px-8 lg:py-8">
        <aside className="lg:w-56 lg:shrink-0">
          <div className="flex items-center justify-between gap-4 lg:block">
            <Link
              href="/olympus"
              className="inline-flex items-center gap-2.5 font-display text-base font-semibold tracking-tight text-ink"
            >
              <img src="/logo.svg" alt="" aria-hidden className="size-6" />
              Olympus
            </Link>

            <div className="lg:mt-6">
              <OlympusNav />
            </div>
          </div>

          <div className="mt-6 hidden border-t border-line pt-4 lg:block">
            <p className="truncate text-xs text-ink-muted" title={user.email}>
              {name}
            </p>
            <form action={logoutAction} className="mt-2">
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="px-0 text-ink-muted hover:bg-transparent hover:text-ink"
              >
                Sign out
              </Button>
            </form>
          </div>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>

      {/* Mobile: sign out lives at the bottom rather than crowding the header. */}
      <div className="border-t border-line px-4 py-4 lg:hidden">
        <form action={logoutAction} className="flex items-center justify-between">
          <span className="truncate text-xs text-ink-muted">{name}</span>
          <Button type="submit" variant="outline" size="sm">
            Sign out
          </Button>
        </form>
      </div>
    </div>
  );
}

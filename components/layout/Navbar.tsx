"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { SITE } from "@/content/site";
import type { NavLink } from "@/content/types";

const EASE = [0.16, 1, 0.3, 1] as const;

function Wordmark({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className="flex items-center gap-2.5 font-display text-base font-semibold tracking-tight text-ink sm:text-lg"
    >
      {/* No plate. The SVG's fill is a baked #7851A9, so it leans on the
          brightness lift and glow to separate from the navbar surface. */}
      <img
        src="/logo.svg"
        alt="Doxa Innovations logo"
        className="size-9 shrink-0 brightness-125 drop-shadow-[0_0_10px_rgba(178,119,211,0.6)]"
      />
      Doxa Innovations
    </Link>
  );
}

/**
 * A top-level nav entry that owns a sub-menu.
 *
 * Opens on hover and on click, so it works with a mouse, a keyboard and a
 * touch screen. The parent is a button rather than a link: on touch there is
 * no hover, so a link would navigate away before the menu could be read. Its
 * destination is still reachable — it is the first child.
 */
function NavGroup({ link, active }: { link: NavLink; active: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);

  // No "close on pathname change" effect: every item closes the menu in its
  // own onClick, and outside-click / Escape cover the rest.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-200",
          active ? "bg-panel-strong text-ink" : "text-ink-muted hover:text-ink",
        )}
      >
        {link.label}
        <ChevronDown
          aria-hidden
          strokeWidth={2}
          className={cn(
            "size-3.5 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: EASE }}
            // `pt-2` rather than `mt-2`: the gap below the button has to stay
            // part of the hoverable area, or crossing it closes the menu.
            className="absolute left-1/2 top-full z-10 w-56 -translate-x-1/2 pt-2"
          >
            <div
              role="menu"
              className="overflow-hidden rounded-2xl border border-line bg-deep/95 p-1.5 shadow-[0_24px_60px_-24px_rgba(124,60,180,0.9)] backdrop-blur-xl"
            >
              {link.children?.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-xl px-3 py-2 text-sm font-medium transition-colors duration-150",
                    pathname === child.href
                      ? "bg-panel-strong text-ink"
                      : "text-ink-muted hover:bg-panel hover:text-ink",
                  )}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile overlay is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  // A group reads as active when any page inside it is open, so "Works" stays
  // lit on /pricing and /how-it-works too.
  const isGroupActive = (link: NavLink) =>
    isActive(link.href) || !!link.children?.some((c) => isActive(c.href));

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 pt-4 sm:px-6">
        {/* The island */}
        <div
          className={cn(
            "flex w-full items-center justify-between gap-2 rounded-full border px-3 py-2 pl-5 transition-[background-color,border-color,box-shadow] duration-300",
            scrolled || open
              ? "border-line bg-deep/80 shadow-[0_18px_50px_-24px_rgba(124,60,180,0.8)] backdrop-blur-xl"
              : "border-line bg-panel backdrop-blur-md",
          )}
        >
          <Wordmark onClick={() => setOpen(false)} />

          <nav className="hidden items-center gap-1 lg:flex">
            {SITE.mainNav.map((link) =>
              link.children?.length ? (
                <NavGroup
                  key={link.href}
                  link={link}
                  active={isGroupActive(link)}
                />
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-200",
                    isActive(link.href)
                      ? "bg-panel-strong text-ink"
                      : "text-ink-muted hover:text-ink",
                  )}
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/contact"
              className="group hidden items-center gap-2 rounded-full bg-primary py-2 pl-4 pr-2 text-sm font-medium text-primary-foreground shadow-[0_10px_30px_-10px_rgba(138,95,192,0.9)] transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:shadow-[0_16px_44px_-12px_rgba(178,119,211,1)] active:scale-[0.98] sm:inline-flex"
            >
              Contact us
              <span className="grid size-6 place-items-center rounded-full bg-white/15 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight className="size-3.5" strokeWidth={2} />
              </span>
            </Link>

            {/* Hamburger → X */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="grid size-10 place-items-center rounded-full border border-line bg-panel lg:hidden"
            >
              <span className="relative block h-4 w-5">
                <span
                  className={cn(
                    "absolute left-0 top-1/2 block h-0.5 w-5 origin-center rounded-full bg-ink transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
                    open ? "rotate-45" : "-translate-y-[5px]",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 top-1/2 block h-0.5 w-5 origin-center rounded-full bg-ink transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
                    open ? "-rotate-45" : "translate-y-[5px]",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 top-0 z-40 flex flex-col bg-deep/95 backdrop-blur-2xl lg:hidden"
          >
            <nav className="mt-24 flex flex-col gap-1 px-6">
              {SITE.mainNav.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                >
                  {link.children?.length ? (
                    // Listed inline rather than collapsed: there is room on a
                    // full-screen menu, and an accordion would cost a tap to
                    // reveal three items.
                    <div className="border-b border-line py-4">
                      <p className="font-display text-2xl font-medium text-ink">
                        {link.label}
                      </p>
                      <div className="mt-1 flex flex-col">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setOpen(false)}
                            className="py-2 pl-4 text-lg font-medium text-ink-muted"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block border-b border-line py-4 font-display text-2xl font-medium text-ink"
                    >
                      {link.label}
                    </Link>
                  )}
                </motion.div>
              ))}
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="mt-8"
              >
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-base font-medium text-primary-foreground"
                >
                  Contact us
                  <ArrowUpRight className="size-4" strokeWidth={2} />
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

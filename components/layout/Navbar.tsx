"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { SITE } from "@/content/site";

function Wordmark({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className="flex items-center gap-2.5 font-display text-base font-semibold tracking-tight text-ink sm:text-lg"
    >
      <img
        src="/logo.svg"
        alt="Doxa Innovations logo"
        className="size-7 shrink-0 drop-shadow-[0_0_10px_rgba(178,119,211,0.5)]"
      />
      Doxa Innovations
    </Link>
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

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 pt-4 sm:px-6">
        {/* The island */}
        <div
          className={cn(
            "flex w-full items-center justify-between gap-2 rounded-full border px-3 py-2 pl-5 transition-[background-color,border-color,box-shadow] duration-300",
            scrolled || open
              ? "border-white/10 bg-deep/80 shadow-[0_18px_50px_-24px_rgba(124,60,180,0.8)] backdrop-blur-xl"
              : "border-white/[0.06] bg-white/[0.02] backdrop-blur-md",
          )}
        >
          <Wordmark onClick={() => setOpen(false)} />

          <nav className="hidden items-center gap-1 lg:flex">
            {SITE.mainNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-200",
                  isActive(link.href)
                    ? "bg-white/[0.07] text-ink"
                    : "text-ink-muted hover:text-ink",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/contact"
              className="group hidden items-center gap-2 rounded-full bg-primary py-2 pl-4 pr-2 text-sm font-medium text-primary-foreground shadow-[0_10px_30px_-10px_rgba(138,95,192,0.9)] transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:shadow-[0_16px_44px_-12px_rgba(178,119,211,1)] active:scale-[0.98] sm:inline-flex"
            >
              Start a project
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
              className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/[0.03] lg:hidden"
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
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-white/[0.06] py-4 font-display text-2xl font-medium text-ink"
                  >
                    {link.label}
                  </Link>
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
                  Start a project
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

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE } from "@/content/site";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function Wordmark() {
  return (
    <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
      <span className="text-lg text-pj-primary">Doxa</span>
      <span className="text-lg text-ink">Innovations</span>
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-border bg-surface/90 backdrop-blur supports-[backdrop-filter]:bg-surface/75"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Wordmark />

        <ul className="hidden items-center gap-1 lg:flex">
          {SITE.mainNav.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-pj-primary",
                  isActive(link.href)
                    ? "text-pj-primary"
                    : "text-ink/80",
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Button asChild className="hidden sm:inline-flex">
            <Link href="/contact">Book a Call</Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="text-left">{SITE.name}</SheetTitle>
              </SheetHeader>
              <ul className="mt-2 flex flex-col gap-1 px-4">
                {SITE.mainNav.map((link) => (
                  <li key={link.href}>
                    <SheetClose asChild>
                      <Link
                        href={link.href}
                        className={cn(
                          "block rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-surface-muted",
                          isActive(link.href) && "text-pj-primary",
                        )}
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  </li>
                ))}
                <li className="mt-3 px-3">
                  <SheetClose asChild>
                    <Button asChild className="w-full">
                      <Link href="/contact">Book a Call</Link>
                    </Button>
                  </SheetClose>
                </li>
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}

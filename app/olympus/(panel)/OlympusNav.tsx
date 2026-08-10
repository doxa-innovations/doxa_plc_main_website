"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Briefcase,
  Inbox,
  Layers,
  MapPin,
  Quote,
  Tags,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/olympus", label: "Overview", icon: BarChart3 },
  { href: "/olympus/leads", label: "Leads", icon: Inbox },
  { href: "/olympus/content/team", label: "Team", icon: Users },
  { href: "/olympus/content/services", label: "Services", icon: Layers },
  { href: "/olympus/content/works", label: "Works", icon: Briefcase },
  { href: "/olympus/content/pricing", label: "Pricing", icon: Tags },
  {
    href: "/olympus/content/testimonials",
    label: "Testimonials",
    icon: Quote,
  },
  { href: "/olympus/content/contact", label: "Contact", icon: MapPin },
];

export function OlympusNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 lg:flex-col">
      {LINKS.map(({ href, label, icon: Icon }) => {
        // Exact match for the index so it does not stay lit on every child.
        const active =
          href === "/olympus" ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-ink-muted hover:bg-sidebar-accent/50 hover:text-ink",
            )}
          >
            <Icon className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

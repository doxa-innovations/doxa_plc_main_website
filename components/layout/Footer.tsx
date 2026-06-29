import Link from "next/link";
import { Mail, MessageCircle, MapPin, Phone, ArrowUpRight } from "lucide-react";
import { SITE } from "@/content/site";
import { Container } from "./Container";

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-pj-secondary">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-ink-muted transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const { registration: reg } = SITE;
  const whatsappUrl = `https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}`;

  return (
    <footer className="relative overflow-hidden bg-deep text-ink">
      {/* Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 size-[60rem] -translate-x-1/2 rounded-full bg-pj-primary/20 blur-[120px]"
      />

      <Container className="relative pt-20">
        {/* Top: closing prompt */}
        <div className="flex flex-col gap-6 border-b border-white/[0.08] pb-12 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-xl font-display text-3xl font-semibold tracking-[-0.03em] text-ink sm:text-4xl">
            Let&apos;s build something worth shipping.
          </h2>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 self-start rounded-full bg-primary py-3 pl-5 pr-2.5 text-sm font-medium text-primary-foreground shadow-[0_14px_40px_-12px_rgba(178,119,211,0.9)] transition-transform duration-200 active:scale-[0.98]"
          >
            Start a project
            <span className="grid size-7 place-items-center rounded-full bg-white/15 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowUpRight className="size-4" strokeWidth={2} />
            </span>
          </Link>
        </div>

        {/* Columns */}
        <div className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5 font-display text-lg font-semibold">
              <img src="/logo.svg" alt="" aria-hidden className="size-7" />
              Doxa Innovations
            </div>
            <p className="mt-4 max-w-xs text-sm text-ink-muted">{SITE.tagline}</p>
            <ul className="mt-6 space-y-3 text-sm text-ink-muted">
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="inline-flex items-center gap-2 hover:text-ink"
                >
                  <Mail className="size-4 text-pj-secondary" strokeWidth={1.5} />
                  {SITE.email}
                </a>
              </li>
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-ink"
                >
                  <MessageCircle
                    className="size-4 text-pj-secondary"
                    strokeWidth={1.5}
                  />
                  {SITE.phone}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${SITE.phone2.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2 hover:text-ink"
                >
                  <Phone className="size-4 text-pj-secondary" strokeWidth={1.5} />
                  {SITE.phone2}
                </a>
              </li>
              <li>
                <a
                  href={SITE.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-2 hover:text-ink"
                >
                  <MapPin
                    className="mt-0.5 size-4 shrink-0 text-pj-secondary"
                    strokeWidth={1.5}
                  />
                  {SITE.address.city}, {SITE.address.region},{" "}
                  {SITE.address.country}
                </a>
              </li>
            </ul>
          </div>

          <FooterColumn title="Services" links={SITE.footerNav.services} />
          <FooterColumn title="Company" links={SITE.footerNav.company} />
          <FooterColumn title="Legal" links={SITE.footerNav.legal} />
        </div>

        {/* Registration + copyright */}
        <div className="flex flex-col gap-2 border-t border-white/[0.08] py-8 text-xs text-ink-muted/80">
          <p>
            {SITE.legalName} · Commercial Reg. {reg.commercialRegNo} · TIN{" "}
            {reg.tin} · VAT {reg.vat} · Established {reg.foundingYear}
          </p>
          <p>
            © {reg.foundingYear} {SITE.legalName}. All rights reserved.
          </p>
        </div>
      </Container>

      {/* Oversized watermark wordmark */}
      <div
        aria-hidden
        className="pointer-events-none relative -mb-[4vw] select-none overflow-hidden"
      >
        <p className="text-center font-display text-[26vw] font-semibold leading-[0.8] tracking-[-0.04em] text-white/[0.14] [mask-image:linear-gradient(to_bottom,black,transparent)]">
          DOXA
        </p>
      </div>
    </footer>
  );
}

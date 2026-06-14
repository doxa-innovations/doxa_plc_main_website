import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
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
      <h3 className="text-sm font-semibold text-pj-white">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-pj-white/70 transition-colors hover:text-pj-white"
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

  return (
    <footer className="bg-pj-accent text-pj-white">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-bold">
              <span className="text-pj-secondary">Doxa</span>
              <span>Innovations</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-pj-white/70">
              {SITE.tagline}
            </p>
            <ul className="mt-5 space-y-2 text-sm text-pj-white/70">
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0" aria-hidden />
                <a href={`mailto:${SITE.email}`} className="hover:text-pj-white">
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0" aria-hidden />
                <a
                  href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                  className="hover:text-pj-white"
                >
                  {SITE.phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
                <span>
                  {SITE.address.city}, {SITE.address.region},{" "}
                  {SITE.address.country}
                </span>
              </li>
            </ul>
          </div>

          <FooterColumn title="Services" links={SITE.footerNav.services} />
          <FooterColumn title="Company" links={SITE.footerNav.company} />
          <FooterColumn title="Legal" links={SITE.footerNav.legal} />
        </div>

        <div className="mt-12 border-t border-pj-white/15 pt-8">
          <p className="text-xs leading-relaxed text-pj-white/60">
            {SITE.legalName} · Commercial Reg. {reg.commercialRegNo} · TIN{" "}
            {reg.tin} · VAT {reg.vat} · Established {reg.foundingYear}
          </p>
          <p className="mt-2 text-xs text-pj-white/60">
            © {reg.foundingYear}–present {SITE.legalName}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}

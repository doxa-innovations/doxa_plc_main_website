import {
  BadgeCheck,
  FileText,
  MapPin,
  Receipt,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { SITE } from "@/content/site";

/** Verifiable legal/registration facts, a glass credential panel on dark. */
export function TrustSignals() {
  const { registration: reg, address } = SITE;

  const facts: {
    icon: LucideIcon;
    label: string;
    value: string;
    href?: string;
  }[] = [
    {
      icon: ShieldCheck,
      label: "Company Registration",
      value: reg.commercialRegNo,
    },
    {
      icon: Receipt,
      label: "Taxpayer ID (TIN)",
      value: `${reg.tin}, verifiable with the Ethiopian Revenue Authority`,
    },
    { icon: FileText, label: "VAT Registration", value: reg.vat },
    {
      icon: MapPin,
      label: "Physical Office",
      value: `${address.street}, ${address.city}, ${address.region}`,
      href: SITE.mapUrl,
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-line bg-panel p-8 shadow-[0_40px_90px_-50px_rgba(124,60,180,0.7)] sm:p-10">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-pj-primary/20 blur-[90px]"
      />
      <div className="relative flex items-center gap-2 text-brand">
        <BadgeCheck className="size-5" strokeWidth={1.5} aria-hidden />
        <h3 className="font-display text-lg font-semibold">
          Verifiable legal standing
        </h3>
      </div>
      <p className="relative mt-2 max-w-2xl text-sm text-ink-muted">
        Every detail below can be checked independently. We provide
        government-issued ID on the first video call.
      </p>
      <div className="relative mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
        {facts.map((f) => (
          <div key={f.label} className="flex gap-3">
            <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-line bg-pj-primary/15 text-brand">
              <f.icon className="size-4.5" strokeWidth={1.5} aria-hidden />
            </span>
            <dl>
              <dt className="text-sm font-semibold text-ink">{f.label}</dt>
              <dd className="text-sm text-ink-muted">
                {f.href ? (
                  <a
                    href={f.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-ink"
                  >
                    {f.value}
                  </a>
                ) : (
                  f.value
                )}
              </dd>
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}

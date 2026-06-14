import { BadgeCheck, FileText, MapPin, Receipt, ShieldCheck } from "lucide-react";
import { SITE } from "@/content/site";

/** Verifiable legal/registration facts — a hard trust signal, not a claim. */
export function TrustSignals() {
  const { registration: reg, address } = SITE;

  const facts = [
    {
      icon: ShieldCheck,
      label: "Company Registration",
      value: reg.commercialRegNo,
    },
    {
      icon: Receipt,
      label: "Taxpayer ID (TIN)",
      value: `${reg.tin} — verifiable with the Ethiopian Revenue Authority`,
    },
    { icon: FileText, label: "VAT Registration", value: reg.vat },
    {
      icon: MapPin,
      label: "Physical Office",
      value: `${address.street}, ${address.city}, ${address.region}`,
    },
  ];

  return (
    <div className="rounded-2xl border border-border bg-surface-muted p-8 sm:p-10">
      <div className="flex items-center gap-2 text-pj-primary">
        <BadgeCheck className="size-5" aria-hidden />
        <h3 className="text-lg font-bold">Verifiable Legal Standing</h3>
      </div>
      <p className="mt-2 max-w-2xl text-sm text-ink/70">
        Every detail below can be checked independently. We provide
        government-issued ID on the first video call.
      </p>
      <div className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
        {facts.map((f) => (
          <div key={f.label} className="flex gap-3">
            <f.icon className="mt-0.5 size-5 shrink-0 text-pj-primary" aria-hidden />
            <dl>
              <dt className="text-sm font-semibold text-ink">{f.label}</dt>
              <dd className="text-sm text-ink/70">{f.value}</dd>
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}

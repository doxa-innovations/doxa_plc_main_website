import { FolderOpen } from "lucide-react";
import { SITE } from "@/content/site";
import { Button } from "@/components/ui/button";

/** Full legal-transparency block — reused on /about and /legal. */
export function LegalDetails() {
  const { registration: reg, address } = SITE;

  const rows: { label: string; value: string }[] = [
    { label: "Company Name", value: SITE.legalName },
    { label: "Legal Form", value: "Private Limited Company (PLC), Ethiopia" },
    { label: "Commercial Registration No.", value: reg.commercialRegNo },
    { label: "Taxpayer ID (TIN)", value: reg.tin },
    { label: "VAT Registration No.", value: reg.vat },
    { label: "Licensed Activities", value: reg.licensedActivities.join(", ") },
    {
      label: "Established",
      value: `April 18, ${reg.foundingYear} — over ${new Date().getFullYear() - reg.foundingYear} years of formal operation`,
    },
    {
      label: "Registered Address",
      value: `${address.street}, ${address.city}, ${address.region}, ${address.country}`,
    },
  ];

  return (
    <div className="rounded-2xl border border-border bg-surface p-8 sm:p-10">
      <dl className="divide-y divide-border">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid gap-1 py-4 first:pt-0 last:pb-0 sm:grid-cols-3 sm:gap-4"
          >
            <dt className="text-sm font-semibold text-ink">{row.label}</dt>
            <dd className="text-sm text-ink/70 sm:col-span-2">{row.value}</dd>
          </div>
        ))}
      </dl>
      {SITE.driveProfileUrl && (
        <Button asChild variant="outline" className="mt-8">
          <a
            href={SITE.driveProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FolderOpen className="size-4" />
            See our company profile & documents
          </a>
        </Button>
      )}
    </div>
  );
}

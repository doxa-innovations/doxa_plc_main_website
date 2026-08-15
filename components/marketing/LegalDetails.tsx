import { FolderOpen } from "lucide-react";
import { getSite, longLocation } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { QrVerify } from "@/components/QrVerify";

/**
 * Full legal-transparency block, reused on /about and /legal. When
 * `showVerification` is false (Ethiopian visitors) the sensitive registration
 * numbers (commercial registration, license, TIN, VAT) and the independent
 * verification QR are omitted; the company identity rows still show.
 */
export async function LegalDetails({
  showVerification = true,
}: {
  showVerification?: boolean;
}) {
  // The registered address must match what the footer and contact page show,
  // so it reads the CMS-backed config rather than the static module.
  const SITE = await getSite();
  const { registration: reg, address } = SITE;

  const rows: { label: string; value: string; href?: string }[] = [
    { label: "Company Name", value: SITE.legalName },
    { label: "Legal Form", value: "Private Limited Company (PLC), Ethiopia" },
    ...(showVerification
      ? [
          { label: "Commercial Registration No.", value: reg.commercialRegNo },
          { label: "Business License No.", value: reg.licenseNo },
          { label: "Taxpayer ID (TIN)", value: reg.tin },
          { label: "VAT Registration No.", value: reg.vat },
        ]
      : []),
    { label: "Licensed Activities", value: reg.licensedActivities.join(", ") },
    { label: "Established", value: "December 2024" },
    {
      label: "Registered Address",
      value: longLocation(address),
      href: SITE.mapUrl,
    },
  ];

  return (
    <div className="rounded-[1.5rem] border border-line bg-panel p-8 shadow-[0_40px_90px_-50px_rgba(124,60,180,0.6)] sm:p-10">
      <div className="divide-y divide-border">
        {rows.map((row) => (
          <dl
            key={row.label}
            className="grid gap-1 py-4 first:pt-0 last:pb-0 sm:grid-cols-3 sm:gap-4"
          >
            <dt className="text-sm font-semibold text-ink">{row.label}</dt>
            <dd className="text-sm text-ink/70 sm:col-span-2">
              {row.href ? (
                <a
                  href={row.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand"
                >
                  {row.value}
                </a>
              ) : (
                row.value
              )}
            </dd>
          </dl>
        ))}
      </div>
      {showVerification && (
        <div className="mt-8">
          <QrVerify />
        </div>
      )}
      {showVerification && SITE.driveProfileUrl && (
        <Button asChild variant="outline" className="mt-6">
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

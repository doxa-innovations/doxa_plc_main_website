import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { requireUser } from "@/lib/auth";
import { getPayloadClient } from "@/lib/payload";
import type { Lead, Visit } from "@/payload-types";
import { cn } from "@/lib/utils";

import { Card } from "../../_components/primitives";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Lead" };

function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

/** A definition row. Renders nothing when there is no value to show. */
function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value?: React.ReactNode;
  mono?: boolean;
}) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex gap-4 border-b border-line/60 py-2.5 last:border-0">
      <dt className="w-40 shrink-0 text-xs text-ink-muted">{label}</dt>
      <dd
        className={cn(
          "min-w-0 flex-1 break-words text-sm text-ink",
          mono && "font-mono text-xs",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

type Touch = NonNullable<Lead["firstTouch"]>;

function TouchPanel({ title, touch }: { title: string; touch?: Touch | null }) {
  if (!touch || !touch.channel) {
    return (
      <Card title={title}>
        <p className="text-sm text-ink-muted">
          No attribution recorded for this touch.
        </p>
      </Card>
    );
  }
  return (
    <Card title={title}>
      <dl>
        <Row label="Channel" value={touch.channel} />
        <Row label="Source" value={touch.utmSource} />
        <Row label="Medium" value={touch.utmMedium} />
        <Row label="Campaign" value={touch.utmCampaign} />
        <Row label="Term" value={touch.utmTerm} />
        <Row label="Content" value={touch.utmContent} />
        <Row label="Google click id" value={touch.gclid} mono />
        <Row label="Meta click id" value={touch.fbclid} mono />
        <Row label="Microsoft click id" value={touch.msclkid} mono />
        <Row label="TikTok click id" value={touch.ttclid} mono />
        <Row label="LinkedIn click id" value={touch.liFatId} mono />
        <Row label="Referrer" value={touch.referrerHost} />
        <Row label="Landing page" value={touch.landingPath} mono />
      </dl>
    </Card>
  );
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Guard BEFORE the query. See requireUser: the layout's check does not stop
  // this page rendering customer data into the redirect body.
  await requireUser();

  const { id } = await params;
  const payload = await getPayloadClient();

  let lead: Lead;
  try {
    lead = await payload.findByID({
      collection: "leads",
      id,
      depth: 0,
      overrideAccess: true,
    });
  } catch {
    notFound();
  }

  // The full journey, not only the two touches denormalized onto the lead.
  // Prefer the persistent id when there is one, since it spans days; fall back
  // to the rotating hash, which only covers the day they enquired.
  let journey: Visit[] = [];
  if (lead.visitorId || lead.visitorHash) {
    const visits = await payload.find({
      collection: "visits",
      where: lead.visitorId
        ? { visitorId: { equals: lead.visitorId } }
        : { visitorHash: { equals: lead.visitorHash } },
      sort: "createdAt",
      limit: 50,
      depth: 0,
      overrideAccess: true,
    });
    journey = visits.docs;
  }

  const delivered = lead.notificationSent && lead.confirmationSent;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/olympus/leads"
          className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4" strokeWidth={1.75} aria-hidden />
          All leads
        </Link>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
              {lead.name}
            </h1>
            <p className="mt-1 text-sm text-ink-muted">
              {formatDateTime(lead.createdAt)} UTC
            </p>
          </div>
          <a
            href={`mailto:${lead.email}?subject=${encodeURIComponent(`Re: your enquiry to Doxa Innovations`)}`}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform duration-200 active:scale-[0.98]"
          >
            Reply by email
          </a>
        </div>
      </div>

      {!delivered && (
        <div
          role="status"
          className="rounded-[1.25rem] border border-destructive/40 bg-destructive/10 p-4 text-sm"
        >
          <p className="font-medium text-ink">
            {!lead.notificationSent && !lead.confirmationSent
              ? "Neither email was delivered."
              : !lead.notificationSent
                ? "The internal notification was not delivered."
                : "The customer confirmation was not delivered."}
          </p>
          <p className="mt-1 text-ink-muted">
            The enquiry itself was stored safely. This person may not know their
            message arrived.
          </p>
          {lead.deliveryError && (
            <p className="mt-2 break-words font-mono text-xs text-ink-muted">
              {lead.deliveryError}
            </p>
          )}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Submission">
          <dl>
            <Row
              label="Email"
              value={
                <a
                  href={`mailto:${lead.email}`}
                  className="text-brand hover:underline"
                >
                  {lead.email}
                </a>
              }
            />
            <Row label="Company" value={lead.company} />
            <Row label="Country (stated)" value={lead.country} />
            <Row label="Country (detected)" value={lead.geoCountry} />
            <Row label="Project type" value={lead.projectType} />
            <Row label="Budget" value={lead.budget} />
            <Row
              label="Status"
              value={
                <span className="inline-flex rounded-full border border-line bg-panel px-2.5 py-0.5 text-xs capitalize">
                  {lead.status ?? "new"}
                </span>
              }
            />
          </dl>
        </Card>

        <Card title="Message">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink">
            {lead.message}
          </p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <TouchPanel title="First touch" touch={lead.firstTouch} />
        <TouchPanel title="Last touch, the visit that converted" touch={lead.lastTouch} />
      </div>

      <Card
        title="Visitor journey"
        subtitle={
          lead.visitorId
            ? "Tracked across sessions using the consented visitor cookie"
            : "Same-day sessions only. This visitor did not accept analytics cookies, so there is no cross-day identifier."
        }
      >
        {journey.length === 0 ? (
          <p className="text-sm text-ink-muted">
            No visits recorded. The enquiry may predate tracking, or the visitor
            blocked the beacon.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[40rem] text-sm">
              <thead>
                <tr className="border-b border-line text-left">
                  {["When", "Channel", "Campaign", "Landing page", "Device"].map(
                    (h) => (
                      <th
                        key={h}
                        scope="col"
                        className="whitespace-nowrap px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {journey.map((v) => (
                  <tr key={v.id} className="border-b border-line/60 last:border-0">
                    <td className="whitespace-nowrap px-3 py-2.5 text-ink-muted">
                      {formatDateTime(v.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-ink">
                      {v.channel ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-ink-muted">
                      {v.utmCampaign ?? "—"}
                    </td>
                    <td className="max-w-[18rem] truncate px-3 py-2.5 font-mono text-xs text-ink-muted">
                      {v.landingPath ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-ink-muted">
                      {v.deviceClass ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card title="Identifiers" subtitle="For debugging and data requests">
        <dl>
          <Row
            label="Visitor cookie"
            value={lead.visitorId ?? "None. Analytics cookies were declined."}
            mono={Boolean(lead.visitorId)}
          />
          <Row
            label="Daily hash"
            value={lead.visitorHash}
            mono
          />
          <Row label="Lead ID" value={String(lead.id)} mono />
          <Row
            label="Internal notification"
            value={lead.notificationSent ? "Delivered" : "Not delivered"}
          />
          <Row
            label="Customer confirmation"
            value={lead.confirmationSent ? "Delivered" : "Not delivered"}
          />
        </dl>
        <p className="mt-4 text-xs leading-relaxed text-ink-muted/80">
          The daily hash is a salted digest of IP and user agent that rotates at
          midnight UTC. It cannot be reversed into an IP address, and it is the
          only identifier held for visitors who declined cookies.
        </p>
      </Card>
    </div>
  );
}

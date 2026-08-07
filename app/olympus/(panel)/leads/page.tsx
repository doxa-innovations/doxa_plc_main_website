import type { Metadata } from "next";
import Link from "next/link";

import { requireUser } from "@/lib/auth";
import { getPayloadClient } from "@/lib/payload";
import { cn } from "@/lib/utils";

import { Card } from "../_components/primitives";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Leads" };

const PAGE_SIZE = 50;

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  // Guard BEFORE the query. See requireUser: the layout's check does not stop
  // this page rendering customer data into the redirect body.
  await requireUser();

  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "leads",
    sort: "-createdAt",
    limit: PAGE_SIZE,
    page,
    depth: 0,
    overrideAccess: true,
  });

  // A lead that reached nobody is the single most urgent thing on this screen,
  // so it is surfaced above the table rather than as a quiet column value.
  const undelivered = result.docs.filter(
    (l) => !l.notificationSent || !l.confirmationSent,
  ).length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
          Leads
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          {result.totalDocs.toLocaleString()} enquiries, newest first.
        </p>
      </header>

      {undelivered > 0 && (
        <div
          role="status"
          className="rounded-[1.25rem] border border-destructive/40 bg-destructive/10 p-4 text-sm text-ink"
        >
          <span className="font-medium">
            {undelivered} {undelivered === 1 ? "lead" : "leads"} on this page had
            an email that did not send.
          </span>{" "}
          <span className="text-ink-muted">
            The enquiry is stored safely, but check the SMTP configuration.
          </span>
        </div>
      )}

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[46rem] text-sm">
            <thead>
              <tr className="border-b border-line text-left">
                {[
                  "Received",
                  "Name",
                  "Company",
                  "Project",
                  "Budget",
                  "First touch",
                  "Last touch",
                  "Email",
                ].map((h) => (
                  <th
                    key={h}
                    scope="col"
                    className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.docs.map((lead) => {
                const delivered =
                  lead.notificationSent && lead.confirmationSent;
                // The whole row opens the lead. `relative` here is what the
                // stretched link below anchors to, and `focus-within` gives the
                // row the same highlight when the link is reached by keyboard
                // as it gets on hover.
                return (
                  <tr
                    key={lead.id}
                    className="relative cursor-pointer border-b border-line/60 transition-colors last:border-0 hover:bg-panel-strong/50 focus-within:bg-panel-strong/50"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-ink-muted">
                      {formatDate(lead.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      {/* A real anchor stretched over the row with ::after,
                          rather than an onClick on the <tr>. That keeps
                          keyboard focus, middle-click, open-in-new-tab and the
                          status-bar URL preview all working, none of which a
                          click handler on a row gives you. */}
                      <Link
                        href={`/olympus/leads/${lead.id}`}
                        className="rounded-sm font-medium text-ink underline-offset-4 after:absolute after:inset-0 after:content-[''] hover:text-brand hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50"
                      >
                        {lead.name}
                      </Link>
                      <span className="block text-xs text-ink-muted">
                        {lead.email}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink-muted">
                      {lead.company || "—"}
                    </td>
                    {/* Deliberately wrappable: nowrap on every cell pushes the
                        table past its container and clips the status column. */}
                    <td className="px-4 py-3 text-ink-muted">
                      {lead.projectType || "—"}
                    </td>
                    <td className="px-4 py-3 text-ink-muted">
                      {lead.budget || "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <TouchCell
                        channel={lead.firstTouch?.channel}
                        campaign={lead.firstTouch?.utmCampaign}
                      />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <TouchCell
                        channel={lead.lastTouch?.channel}
                        campaign={lead.lastTouch?.utmCampaign}
                      />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs",
                          delivered
                            ? "border-line bg-panel text-ink-muted"
                            : "border-destructive/40 bg-destructive/10 text-ink",
                        )}
                      >
                        {delivered
                          ? "Sent"
                          : !lead.notificationSent && !lead.confirmationSent
                            ? "Neither sent"
                            : !lead.notificationSent
                              ? "Notice failed"
                              : "Reply failed"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {result.docs.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-ink-muted">
            No enquiries yet.
          </p>
        )}
      </Card>

      {result.totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="flex items-center justify-between text-sm"
        >
          <span className="text-ink-muted">
            Page {result.page} of {result.totalPages}
          </span>
          <div className="flex gap-2">
            {result.hasPrevPage && (
              <a
                href={`/olympus/leads?page=${(result.page ?? 1) - 1}`}
                className="rounded-full border border-line px-3.5 py-1.5 text-ink-muted hover:text-ink"
              >
                Previous
              </a>
            )}
            {result.hasNextPage && (
              <a
                href={`/olympus/leads?page=${(result.page ?? 1) + 1}`}
                className="rounded-full border border-line px-3.5 py-1.5 text-ink-muted hover:text-ink"
              >
                Next
              </a>
            )}
          </div>
        </nav>
      )}
    </div>
  );
}

function TouchCell({
  channel,
  campaign,
}: {
  channel?: string | null;
  campaign?: string | null;
}) {
  if (!channel) return <span className="text-ink-muted">—</span>;
  return (
    <>
      <span className="text-ink">{channel}</span>
      {campaign && (
        <span className="block text-xs text-ink-muted">{campaign}</span>
      )}
    </>
  );
}

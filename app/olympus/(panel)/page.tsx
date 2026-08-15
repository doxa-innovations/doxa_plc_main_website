import {
  getCampaigns,
  getChannels,
  getCountries,
  getKpis,
  getSeries,
  isTimeframe,
  TIMEFRAMES,
  type TimeframeKey,
} from "@/lib/analytics";
import { requireUser } from "@/lib/auth";

import { TimeframeTabs } from "./_components/TimeframeTabs";
import { TrendChart } from "./_components/TrendChart";
import { BarList, Card, StatTile } from "./_components/primitives";

export const dynamic = "force-dynamic";

export default async function OverviewPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  // Guard BEFORE any query. The layout guards too, but layouts and pages
  // render concurrently, so the layout's redirect does not stop this page from
  // fetching and rendering into the redirect response body.
  await requireUser();

  const { range } = await searchParams;
  const timeframe: TimeframeKey = isTimeframe(range) ? range : "30d";

  const [kpis, series, channels, campaigns, countries] = await Promise.all([
    getKpis(timeframe),
    getSeries(timeframe),
    getChannels(timeframe),
    getCampaigns(timeframe),
    getCountries(timeframe),
  ]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
            Overview
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Where visitors come from, and which of them become enquiries.
          </p>
        </div>
        <TimeframeTabs active={timeframe} basePath="/olympus" />
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Visits" value={kpis.visits.toLocaleString()} />
        <StatTile
          label="Unique visitors"
          value={kpis.visitors.toLocaleString()}
          // Say what the number cannot know. Visitors who decline analytics are
          // identified by a hash that rotates at midnight UTC, so someone
          // returning on three days counts three times. Visits and Leads are
          // exact; this one is an upper bound.
          hint={
            timeframe === "7d"
              ? "Approximate over multiple days"
              : "Upper bound, see note below"
          }
        />
        <StatTile label="Leads" value={kpis.leads.toLocaleString()} />
        <StatTile
          label="Lead rate"
          value={`${kpis.leadRate.toFixed(kpis.leadRate < 10 ? 1 : 0)}%`}
          hint={`${kpis.leads} of ${kpis.visits} visits`}
        />
      </div>

      <Card
        title="Traffic and enquiries"
        subtitle={`${TIMEFRAMES[timeframe].label}, bucketed by ${series.granularity} in UTC`}
      >
        <TrendChart
          points={series.points}
          granularity={series.granularity}
        />
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card
          title="Channels"
          subtitle="Visits, and the leads each produced"
        >
          <BarList
            data={channels.map((c) => ({
              label: c.channel,
              value: c.visits,
              secondary: c.leads,
            }))}
            valueLabel="Visits"
          />
        </Card>

        <Card title="Countries" subtitle="From CDN geo headers">
          <BarList
            data={countries.map((c) => ({ label: c.label, value: c.visits }))}
            valueLabel="Visits"
            emptyMessage="No country data yet. This is populated by Cloudflare in production."
          />
        </Card>
      </div>

      <Card title="Campaigns" subtitle="Tagged traffic only">
        <BarList
          data={campaigns.map((c) => ({
            label: c.label,
            sublabel: c.sublabel,
            value: c.visits,
          }))}
          valueLabel="Visits"
          emptyMessage="No tagged campaigns yet. Add utm_campaign to your ad links to see them here."
        />
      </Card>

      <p className="text-xs leading-relaxed text-ink-muted/80">
        Visits and leads are exact counts. Unique visitors is an upper bound:
        anyone who has not accepted analytics cookies is identified by a hash
        that rotates at midnight UTC, so a repeat visitor is counted once per
        day. Everything is bucketed in UTC.
      </p>
    </div>
  );
}

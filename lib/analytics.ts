import "server-only";

import { getPayloadClient } from "@/lib/payload";

/**
 * Dashboard aggregation.
 *
 * Everything here is SQL. Loading rows into Node and reducing them would work
 * on today's traffic and quietly fall over later, and the queries below are
 * not complicated enough to justify that trade.
 *
 * All bucketing is UTC. A single consistent timezone matters more than the
 * "right" one, and mixing them is how two tiles start disagreeing.
 */

export const TIMEFRAMES = {
  "7d": { label: "7 days", days: 7 },
  "30d": { label: "30 days", days: 30 },
  lifetime: { label: "Lifetime", days: null },
} as const;

export type TimeframeKey = keyof typeof TIMEFRAMES;

export function isTimeframe(value: string | undefined): value is TimeframeKey {
  return value === "7d" || value === "30d" || value === "lifetime";
}

async function query<T extends Record<string, unknown>>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  const payload = await getPayloadClient();
  // The postgres adapter exposes the underlying pg.Pool.
  const pool = (payload.db as unknown as { pool: { query: (t: string, p?: unknown[]) => Promise<{ rows: T[] }> } }).pool;
  const result = await pool.query(text, params);
  return result.rows;
}

/** Inclusive lower bound, or null for lifetime. */
function since(timeframe: TimeframeKey): Date | null {
  const days = TIMEFRAMES[timeframe].days;
  if (days === null) return null;
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - (days - 1));
  return d;
}

export interface Kpis {
  visits: number;
  visitors: number;
  leads: number;
  /** Leads divided by visits, as a percentage. */
  leadRate: number;
}

export async function getKpis(timeframe: TimeframeKey): Promise<Kpis> {
  const from = since(timeframe);

  const [visitRow] = await query<{ visits: string; visitors: string }>(
    `SELECT count(*)::text AS visits,
            count(DISTINCT COALESCE(visitor_id, visitor_hash))::text AS visitors
       FROM visits
      WHERE ($1::timestamptz IS NULL OR created_at >= $1)`,
    [from],
  );

  const [leadRow] = await query<{ leads: string }>(
    `SELECT count(*)::text AS leads
       FROM leads
      WHERE ($1::timestamptz IS NULL OR created_at >= $1)`,
    [from],
  );

  const visits = Number(visitRow?.visits ?? 0);
  const leads = Number(leadRow?.leads ?? 0);

  return {
    visits,
    visitors: Number(visitRow?.visitors ?? 0),
    leads,
    leadRate: visits > 0 ? (leads / visits) * 100 : 0,
  };
}

export interface SeriesPoint {
  date: string;
  visits: number;
  leads: number;
}

/**
 * Visits and leads per bucket, with empty buckets filled in.
 *
 * `generate_series` rather than only returning days that have data: a line
 * chart that silently skips quiet days draws a flattering, wrong picture.
 */
export async function getSeries(
  timeframe: TimeframeKey,
): Promise<{ points: SeriesPoint[]; granularity: "day" | "week" }> {
  const from = since(timeframe);

  // Lifetime can span arbitrarily long, so fall back to weekly buckets once
  // daily points would be unreadable.
  let granularity: "day" | "week" = "day";
  if (from === null) {
    const [range] = await query<{ span: string | null }>(
      `SELECT EXTRACT(DAY FROM (now() - MIN(created_at)))::text AS span FROM visits`,
    );
    if (Number(range?.span ?? 0) > 120) granularity = "week";
  }

  const rows = await query<{ bucket: Date; visits: string; leads: string }>(
    `WITH bounds AS (
       SELECT COALESCE(
                $1::timestamptz,
                LEAST(
                  COALESCE((SELECT MIN(created_at) FROM visits), now()),
                  COALESCE((SELECT MIN(created_at) FROM leads), now())
                )
              ) AS start_at
     ),
     buckets AS (
       SELECT generate_series(
                date_trunc($2, (SELECT start_at FROM bounds) AT TIME ZONE 'UTC'),
                date_trunc($2, now() AT TIME ZONE 'UTC'),
                ('1 ' || $2)::interval
              ) AS bucket
     )
     SELECT b.bucket,
            COALESCE(v.n, 0)::text AS visits,
            COALESCE(l.n, 0)::text AS leads
       FROM buckets b
       LEFT JOIN (
         SELECT date_trunc($2, created_at AT TIME ZONE 'UTC') AS bucket, count(*) AS n
           FROM visits
          WHERE ($1::timestamptz IS NULL OR created_at >= $1)
          GROUP BY 1
       ) v ON v.bucket = b.bucket
       LEFT JOIN (
         SELECT date_trunc($2, created_at AT TIME ZONE 'UTC') AS bucket, count(*) AS n
           FROM leads
          WHERE ($1::timestamptz IS NULL OR created_at >= $1)
          GROUP BY 1
       ) l ON l.bucket = b.bucket
      ORDER BY b.bucket`,
    [from, granularity],
  );

  return {
    granularity,
    points: rows.map((r) => ({
      date: new Date(r.bucket).toISOString().slice(0, 10),
      visits: Number(r.visits),
      leads: Number(r.leads),
    })),
  };
}

export interface ChannelRow {
  channel: string;
  visits: number;
  leads: number;
}

/**
 * Visits and leads side by side per channel.
 *
 * A FULL OUTER JOIN so a channel that produced a lead but whose visit was
 * pruned still appears, and vice versa. Leads are attributed on last touch,
 * which is the session that actually produced the enquiry.
 */
export async function getChannels(
  timeframe: TimeframeKey,
): Promise<ChannelRow[]> {
  const from = since(timeframe);

  const rows = await query<{
    channel: string | null;
    visits: string;
    leads: string;
  }>(
    `SELECT COALESCE(v.channel, l.channel) AS channel,
            COALESCE(v.n, 0)::text AS visits,
            COALESCE(l.n, 0)::text AS leads
       FROM (
         SELECT COALESCE(channel::text, 'Unknown') AS channel, count(*) AS n
           FROM visits
          WHERE ($1::timestamptz IS NULL OR created_at >= $1)
          GROUP BY 1
       ) v
       FULL OUTER JOIN (
         SELECT COALESCE(last_touch_channel::text, 'Unknown') AS channel, count(*) AS n
           FROM leads
          WHERE ($1::timestamptz IS NULL OR created_at >= $1)
          GROUP BY 1
       ) l ON l.channel = v.channel
      ORDER BY 2 DESC NULLS LAST`,
    [from],
  );

  return rows.map((r) => ({
    channel: r.channel ?? "Unknown",
    visits: Number(r.visits),
    leads: Number(r.leads),
  }));
}

export interface BreakdownRow {
  label: string;
  sublabel?: string;
  visits: number;
}

export async function getCampaigns(
  timeframe: TimeframeKey,
): Promise<BreakdownRow[]> {
  const rows = await query<{
    campaign: string;
    source: string | null;
    n: string;
  }>(
    `SELECT utm_campaign AS campaign, utm_source AS source, count(*)::text AS n
       FROM visits
      WHERE utm_campaign IS NOT NULL
        AND ($1::timestamptz IS NULL OR created_at >= $1)
      GROUP BY 1, 2
      ORDER BY count(*) DESC
      LIMIT 8`,
    [since(timeframe)],
  );

  return rows.map((r) => ({
    label: r.campaign,
    sublabel: r.source ?? undefined,
    visits: Number(r.n),
  }));
}

export async function getCountries(
  timeframe: TimeframeKey,
): Promise<BreakdownRow[]> {
  const rows = await query<{ country: string | null; n: string }>(
    `SELECT country, count(*)::text AS n
       FROM visits
      WHERE ($1::timestamptz IS NULL OR created_at >= $1)
      GROUP BY 1
      ORDER BY count(*) DESC
      LIMIT 8`,
    [since(timeframe)],
  );

  return rows.map((r) => ({
    label: r.country ?? "Unknown",
    visits: Number(r.n),
  }));
}

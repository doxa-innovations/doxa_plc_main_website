"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { SeriesPoint } from "@/lib/analytics";

/**
 * Visits and leads over time, as SMALL MULTIPLES rather than one chart.
 *
 * Visits and leads differ by one to two orders of magnitude. Plotting both
 * against a single y-axis makes the leads line a flat worm along the floor;
 * plotting them against two y-axes is a dual-axis chart, which lets you imply
 * any correlation you like by choosing the scales. Two stacked panels sharing
 * an x-axis show both shapes honestly and let the eye compare timing.
 *
 * `syncId` ties the crosshair and tooltip together, so hovering a date reads
 * both panels at once, which is the comparison the split would otherwise cost.
 *
 * Colours: each panel is a single series, so identity comes from its heading,
 * not from a legend. Both hues were checked against the #14002e surface for
 * lightness band, chroma floor and contrast. They are NOT used as a
 * categorical pair anywhere (their mutual separation is below the ΔE 15 floor)
 * and they never sit adjacent.
 */

const VISITS = "#8a5fc0";
const LEADS = "#b277d3";

const AXIS = "#b8a8d8";
const GRID = "rgba(255,255,255,0.07)";

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

function ChartTooltip({
  active,
  payload,
  label,
  unit,
}: {
  active?: boolean;
  payload?: { value?: number }[];
  label?: string;
  unit: string;
}) {
  if (!active || !payload?.length) return null;
  const value = payload[0]?.value ?? 0;
  return (
    <div className="rounded-lg border border-line bg-deep/95 px-3 py-2 text-xs shadow-lg backdrop-blur-sm">
      <p className="text-ink-muted">{label ? formatDate(label) : ""}</p>
      <p className="mt-0.5 font-medium text-ink">
        {value.toLocaleString()} {unit}
      </p>
    </div>
  );
}

function Panel({
  data,
  dataKey,
  color,
  unit,
  showAxis,
  gradientId,
}: {
  data: SeriesPoint[];
  dataKey: "visits" | "leads";
  color: string;
  unit: string;
  showAxis: boolean;
  gradientId: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={showAxis ? 132 : 108}>
      <AreaChart
        data={data}
        syncId="olympus-trend"
        margin={{ top: 6, right: 6, bottom: showAxis ? 0 : 6, left: 0 }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        {/* Recessive grid: horizontal only, so it reads as a measuring aid
            rather than as a second layer of marks. */}
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis
          dataKey="date"
          hide={!showAxis}
          tickFormatter={formatDate}
          tick={{ fill: AXIS, fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          minTickGap={24}
        />
        <YAxis
          width={34}
          allowDecimals={false}
          // Pin the domain to the data and cap the tick count. Left to itself
          // Recharts picks "nice" round numbers, which on small integer counts
          // produces gaps like 0, 1, 2, 4 that read as a broken scale.
          domain={[0, "dataMax"]}
          tickCount={3}
          tick={{ fill: AXIS, fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          content={<ChartTooltip unit={unit} />}
          cursor={{ stroke: AXIS, strokeWidth: 1, strokeDasharray: "3 3" }}
        />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          // Dots appear on hover only; a marker on every point turns a trend
          // line into a bead necklace.
          dot={false}
          activeDot={{ r: 4, strokeWidth: 2, stroke: "#14002e" }}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function TrendChart({
  points,
  granularity,
}: {
  points: SeriesPoint[];
  granularity: "day" | "week";
}) {
  if (points.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-ink-muted">
        No traffic recorded yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-1 text-xs font-medium text-ink-muted">
          Visits per {granularity}
        </p>
        <Panel
          data={points}
          dataKey="visits"
          color={VISITS}
          unit="visits"
          showAxis={false}
          gradientId="olympus-visits"
        />
      </div>
      <div>
        <p className="mb-1 text-xs font-medium text-ink-muted">
          Leads per {granularity}
        </p>
        <Panel
          data={points}
          dataKey="leads"
          color={LEADS}
          unit="leads"
          showAxis
          gradientId="olympus-leads"
        />
      </div>
    </div>
  );
}

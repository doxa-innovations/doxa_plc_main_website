import { PAYMENT_MILESTONES } from "@/content/process";

/** Visual 30 / 40 / 30 milestone payment bar so clients see it clearly. */
export function PaymentTimeline() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <div className="flex overflow-hidden rounded-lg" aria-hidden>
        {PAYMENT_MILESTONES.map((m, i) => (
          <div
            key={m.label}
            style={{ flexBasis: `${m.percent}%` }}
            className={
              i % 2 === 0
                ? "bg-pj-primary py-3 text-center text-sm font-bold text-pj-white"
                : "bg-pj-secondary py-3 text-center text-sm font-bold text-pj-accent"
            }
          >
            {m.percent}%
          </div>
        ))}
      </div>
      <dl className="mt-6 grid gap-6 sm:grid-cols-3">
        {PAYMENT_MILESTONES.map((m) => (
          <div key={m.label}>
            <dt className="text-sm font-bold text-ink">
              {m.percent}% — {m.label}
            </dt>
            <dd className="mt-1 text-sm text-ink/70">{m.unlocks}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

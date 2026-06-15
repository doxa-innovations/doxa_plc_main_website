import { PAYMENT_MILESTONES } from "@/content/process";

/** Visual 30 / 40 / 30 milestone payment bar so clients see it clearly. */
export function PaymentTimeline() {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.02] p-6 shadow-[0_40px_90px_-50px_rgba(124,60,180,0.6)] sm:p-8">
      <div className="flex overflow-hidden rounded-xl" aria-hidden>
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
      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        {PAYMENT_MILESTONES.map((m) => (
          <dl key={m.label}>
            <dt className="text-sm font-bold text-ink">
              {m.percent}%, {m.label}
            </dt>
            <dd className="mt-1 text-sm text-ink-muted">{m.unlocks}</dd>
          </dl>
        ))}
      </div>
    </div>
  );
}

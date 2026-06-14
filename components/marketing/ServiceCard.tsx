import Link from "next/link";
import type { Service } from "@/content/types";
import { ServiceIcon } from "@/components/Icon";

/** Compact service card used in the home services preview. */
export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services#${service.slug}`}
      className="group flex flex-col rounded-xl border border-border bg-surface p-6 transition-colors hover:border-pj-primary/40 hover:bg-pj-primary/[0.03] focus-visible:outline-2 focus-visible:outline-pj-primary"
    >
      <span className="inline-flex size-11 items-center justify-center rounded-lg bg-pj-primary/10 text-pj-primary">
        <ServiceIcon name={service.icon} className="size-5" />
      </span>
      <h3 className="mt-4 text-base font-bold text-ink">{service.name}</h3>
      <p className="mt-1.5 text-sm text-ink/70">{service.summary}</p>
    </Link>
  );
}

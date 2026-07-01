import Link from "next/link";
import type { Service } from "@/content/types";
import { ServiceIcon } from "@/components/Icon";

/** Compact dark glass service tile. */
export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services#${service.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-[1.25rem] border border-line bg-panel p-6 transition-[transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 hover:border-line-strong focus-visible:outline-2 focus-visible:outline-pj-secondary light:shadow-[0_6px_24px_-14px_rgba(25,0,58,0.22)] light:hover:shadow-[0_16px_40px_-16px_rgba(25,0,58,0.3)]"
    >
      <span className="inline-flex size-11 items-center justify-center rounded-xl border border-line bg-pj-primary/15 text-brand shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
        <ServiceIcon name={service.icon} className="size-5" />
      </span>
      <h3 className="mt-4 font-display text-base font-semibold text-ink">
        {service.name}
      </h3>
      <p className="mt-1.5 text-sm text-ink-muted">{service.summary}</p>
    </Link>
  );
}

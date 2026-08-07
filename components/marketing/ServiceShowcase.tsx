import Image from "next/image";
import { Check, Clock, Tag } from "lucide-react";
import type { Service } from "@/content/types";
import { ServiceIcon } from "@/components/Icon";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * Full-bleed service card: the screenshot fills the tile and a violet overlay
 * lies across the whole of it, solid over the half that carries the text and
 * heavily transparent across the other half so the work stays visible.
 *
 * Everything is shown at rest. There is no expand-on-hover: the detail is the
 * point of the page, and hiding it behind a pointer meant it could not be
 * scanned, read on a touch screen, or seen at all in a screenshot. The only
 * thing hover does is push the image in very slightly.
 *
 * The content sits in normal flow rather than being pinned, so the tile is
 * sized by its own text and nothing can clip.
 *
 * `flip` alternates which side the text hangs off, so a column of these does
 * not march down the page identically.
 */
export function ServiceShowcase({
  service,
  price,
  flip = false,
}: {
  service: Service;
  /** Formatted by the page, which knows whether the visitor is in Ethiopia. */
  price: string;
  /** Put the text on the right instead of the left. */
  flip?: boolean;
}) {
  return (
    <article
      id={service.slug}
      className="group relative isolate min-h-[28rem] scroll-mt-24 overflow-hidden rounded-[1.6rem] border border-line shadow-[0_40px_90px_-50px_rgba(124,60,180,0.5)] md:min-h-[32rem]"
    >
      <Image
        src={service.image}
        alt={`${service.name} at Doxa`}
        fill
        sizes="(max-width: 1024px) 100vw, 1080px"
        unoptimized
        // Barely perceptible on purpose — enough to feel alive, not enough to
        // turn the screenshot into a crop of itself.
        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
      />

      {/* Frosted glass across the WHOLE tile rather than a solid half.
          The blur is what buys legibility: text sits on an even, low-frequency
          field instead of on top of arbitrary photo detail, so a much lighter
          tint carries it — and the screenshot stays visibly present everywhere
          instead of half of it being painted out.
          Uniform on purpose. A gradient here reintroduces exactly the
          half-colour/half-photo split this replaces. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-pj-accent/55 backdrop-blur-[14px] backdrop-saturate-[1.15]"
      />

      <div
        className={cn(
          "relative flex h-full p-7 sm:p-9",
          flip ? "justify-end" : "justify-start",
        )}
      >
        <div className="flex max-w-md flex-col justify-center">
          <span className="inline-flex size-12 items-center justify-center rounded-xl border border-line bg-pj-primary/20 text-brand shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            <ServiceIcon name={service.icon} className="size-6" />
          </span>

          <h2 className="mt-4 font-display text-2xl font-semibold tracking-[-0.02em] text-ink">
            {service.name}
          </h2>
          <p className="mt-2 text-ink-muted">{service.summary}</p>

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <p className="flex items-center gap-2 text-ink-muted">
              <Clock className="size-4 text-brand" aria-hidden />
              <span className="sr-only">Timeline: </span>
              {service.timeline}
            </p>
            <p className="flex items-center gap-2 font-semibold text-ink">
              <Tag className="size-4 text-brand" aria-hidden />
              <span className="sr-only">Starting price: </span>
              {price}
            </p>
          </div>

          <p className="mt-3 text-sm text-ink-muted">
            <span className="font-semibold text-ink">Best for: </span>
            {service.forWhom}
          </p>

          <p className="mt-4 text-sm text-ink-muted">{service.description}</p>

          <h3 className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
            What you get
          </h3>
          <ul className="mt-3 grid gap-2">
            {service.deliverables.map((d) => (
              <li
                key={d}
                className="flex items-start gap-2 text-sm text-ink-muted"
              >
                <Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
                {d}
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {service.techStack.map((t) => (
              <Badge key={t} variant="secondary" className="font-normal">
                {t}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

import Image from "next/image";
import { Check, Ban, Clock, Tag } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import { SERVICES } from "@/content/services";
import type { Service } from "@/content/types";
import { isEthiopianVisitor } from "@/lib/geo";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { ServiceIcon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { Badge } from "@/components/ui/badge";
import { JsonLd } from "@/components/seo/JsonLd";
import { graph, serviceSchema } from "@/lib/jsonld";

export const metadata = buildMetadata({
  title: "Services",
  description:
    "Website development, e-commerce stores, custom software, branding, mobile apps, and maintenance, what each service includes, who it's for, typical timelines, and honest starting prices.",
  path: "/services",
});

function priceText(service: Service, isEthiopia: boolean): string {
  if (isEthiopia) {
    return service.etStartingFrom === "custom"
      ? "Pricing: Custom"
      : `From ETB ${service.etStartingFrom.toLocaleString()}`;
  }
  const isMonthly = service.slug === "maintenance";
  return `From $${service.startingFrom.amount.toLocaleString()}${isMonthly ? "/mo" : ""}`;
}

export default async function ServicesPage() {
  const isEthiopia = await isEthiopianVisitor();
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Everything we do, explained without jargon"
        lead="Each service below covers what it is, who it's for, what you get, a realistic timeline, and an honest starting price."
      />

      <Section variant="surface" frame grid>
        <div className="space-y-8">
          {SERVICES.map((service) => (
            <Reveal key={service.slug}>
            <article
              id={service.slug}
              className="scroll-mt-24 overflow-hidden rounded-[1.6rem] border border-line bg-panel shadow-[0_40px_90px_-50px_rgba(124,60,180,0.5)]"
            >
              <div className="relative aspect-[21/9] w-full overflow-hidden">
                <Image
                  src={service.image}
                  alt={`${service.name} at Doxa`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1080px"
                  unoptimized
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep/85 via-deep/30 to-transparent" />
              </div>
              <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-3">
                <div>
                  <span className="inline-flex size-12 items-center justify-center rounded-xl border border-line bg-pj-primary/15 text-brand shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                    <ServiceIcon name={service.icon} className="size-6" />
                  </span>
                  <h2 className="mt-4 text-2xl font-bold text-ink">
                    {service.name}
                  </h2>
                  <p className="mt-2 text-ink/70">{service.summary}</p>
                  <div className="mt-5 space-y-2 text-sm">
                    <p className="flex items-center gap-2 text-ink/70">
                      <Clock className="size-4 text-brand" aria-hidden />
                      <span className="sr-only">Timeline: </span>
                      {service.timeline}
                    </p>
                    <p className="flex items-center gap-2 font-semibold text-ink">
                      <Tag className="size-4 text-brand" aria-hidden />
                      <span className="sr-only">Starting price: </span>
                      {priceText(service, isEthiopia)}
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <p className="text-ink/80">{service.description}</p>
                  <p className="mt-4 text-sm text-ink/60">
                    <span className="font-semibold text-ink">Best for: </span>
                    {service.forWhom}
                  </p>

                  <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-ink/50">
                    What you get
                  </h3>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {service.deliverables.map((d) => (
                      <li key={d} className="flex items-start gap-2 text-sm text-ink/70">
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
            </Reveal>
          ))}
        </div>
      </Section>

      {/* What we don't do */}
      <Section variant="muted" frame>
        <Container className="max-w-3xl">
          {/* Inverted against the violet band: white fill, violet ink. */}
          <div className="flex gap-4 rounded-[1.6rem] border border-line bg-panel p-8">
            <Ban className="mt-1 size-6 shrink-0 text-brand" aria-hidden />
            <div>
              <h2 className="text-lg font-bold text-ink">What we don&apos;t do</h2>
              <p className="mt-2 text-ink-muted">
                We focus on software and digital products. We don&apos;t offer
                physical printing, event photography, or video production
                services.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <JsonLd schema={graph(...SERVICES.map((s) => serviceSchema(s)))} />
    </>
  );
}

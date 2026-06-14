import { Check, Ban, Clock, Tag } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import { SERVICES } from "@/content/services";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { ServiceIcon } from "@/components/Icon";
import { Badge } from "@/components/ui/badge";
import { CtaBand } from "@/components/marketing/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { graph, serviceSchema } from "@/lib/jsonld";

export const metadata = buildMetadata({
  title: "Services",
  description:
    "Website development, e-commerce stores, custom software, branding, mobile apps, and maintenance — what each service includes, who it's for, typical timelines, and honest starting prices.",
  path: "/services",
});

function priceLabel(amount: number, isMonthly: boolean) {
  return `From $${amount.toLocaleString()}${isMonthly ? "/mo" : ""}`;
}

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Everything we do, explained without jargon"
        lead="Each service below covers what it is, who it's for, what you get, a realistic timeline, and an honest starting price."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ]}
      />

      <Section variant="surface">
        <div className="space-y-8">
          {SERVICES.map((service) => (
            <article
              key={service.slug}
              id={service.slug}
              className="scroll-mt-24 rounded-2xl border border-border bg-surface p-6 sm:p-8"
            >
              <div className="grid gap-8 lg:grid-cols-3">
                <div>
                  <span className="inline-flex size-12 items-center justify-center rounded-xl bg-pj-primary/10 text-pj-primary">
                    <ServiceIcon name={service.icon} className="size-6" />
                  </span>
                  <h2 className="mt-4 text-2xl font-bold text-ink">
                    {service.name}
                  </h2>
                  <p className="mt-2 text-ink/70">{service.summary}</p>
                  <dl className="mt-5 space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-ink/70">
                      <Clock className="size-4 text-pj-primary" aria-hidden />
                      <dt className="sr-only">Timeline</dt>
                      <dd>{service.timeline}</dd>
                    </div>
                    <div className="flex items-center gap-2 font-semibold text-ink">
                      <Tag className="size-4 text-pj-primary" aria-hidden />
                      <dt className="sr-only">Starting price</dt>
                      <dd>
                        {priceLabel(
                          service.startingFrom.amount,
                          service.slug === "maintenance",
                        )}
                      </dd>
                    </div>
                  </dl>
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
                        <Check className="mt-0.5 size-4 shrink-0 text-pj-primary" aria-hidden />
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
          ))}
        </div>
      </Section>

      {/* What we don't do */}
      <Section variant="muted">
        <Container className="max-w-3xl">
          <div className="flex gap-4 rounded-2xl border border-border bg-surface p-8">
            <Ban className="mt-1 size-6 shrink-0 text-pj-primary" aria-hidden />
            <div>
              <h2 className="text-lg font-bold text-ink">What we don&apos;t do</h2>
              <p className="mt-2 text-ink/70">
                We focus on software and digital products. We don&apos;t offer
                physical printing, event photography, or video production
                services — being honest about our scope is part of how we earn
                your trust.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <CtaBand />

      <JsonLd schema={graph(...SERVICES.map((s) => serviceSchema(s)))} />
    </>
  );
}

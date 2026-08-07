import { Ban } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import { SERVICES } from "@/content/services";
import type { Service } from "@/content/types";
import { isEthiopianVisitor } from "@/lib/geo";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/Reveal";
import { ServiceShowcase } from "@/components/marketing/ServiceShowcase";
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
          {SERVICES.map((service, i) => (
            <Reveal key={service.slug}>
              <ServiceShowcase
                service={service}
                price={priceText(service, isEthiopia)}
                flip={i % 2 === 1}
              />
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

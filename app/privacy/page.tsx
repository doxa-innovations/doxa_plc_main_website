import { buildMetadata } from "@/lib/metadata";
import { SITE } from "@/content/site";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/Reveal";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "How Doxa Innovations collects, uses, and protects your personal data. We never sell your data, and you can request access or deletion at any time.",
  path: "/privacy",
});

const SECTIONS: { heading: string; body: string[] }[] = [
  {
    heading: "What this policy covers",
    body: [
      "This policy explains what personal data Doxa Innovations Software Development PLC collects through this website, how we use it, and the choices you have. We keep data collection to the minimum needed to talk with you and deliver our work.",
    ],
  },
  {
    heading: "Information we collect",
    body: [
      "When you submit our contact form, we collect the details you provide: your name, email address, company, country, project type, budget range, and your message. We do not require any sensitive personal data to start a conversation.",
      "We may collect basic, aggregate analytics (such as page views) to understand how the site is used. This does not identify you personally.",
    ],
  },
  {
    heading: "How we use your information",
    body: [
      "We use your information only to respond to your inquiry, schedule a discovery call, prepare a proposal, and deliver and support the work you engage us for. We do not sell, rent, or trade your personal data to anyone, ever.",
    ],
  },
  {
    heading: "Who we share it with",
    body: [
      "We share data only with the service providers that help us operate, such as our email and hosting providers, and only to the extent needed to provide the service. They are bound to protect your data and may not use it for their own purposes.",
    ],
  },
  {
    heading: "Data retention and your rights",
    body: [
      "We keep your inquiry for as long as needed to serve you and meet our legal obligations, then delete it. You may request access to, correction of, or deletion of your personal data at any time.",
      `To exercise any of these rights, email us at ${SITE.email} and we will respond promptly.`,
    ],
  },
  {
    heading: "International data",
    body: [
      "Doxa Innovations operates from Ethiopia and works with clients in the US, EU, and beyond. Your data may be processed in these regions by us or our providers, always under appropriate safeguards.",
    ],
  },
  {
    heading: "Contact",
    body: [
      `Questions about this policy? Email ${SITE.email}. ${SITE.legalName}, ${SITE.address.city}, ${SITE.address.region}, ${SITE.address.country}.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Privacy"
        title="Privacy Policy"
        lead="Effective December 2024. We collect as little as possible, never sell your data, and delete it on request."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Privacy", path: "/privacy" },
        ]}
      />
      <Section variant="muted">
        <div className="mx-auto max-w-3xl space-y-10">
          {SECTIONS.map((s) => (
            <Reveal key={s.heading}>
              <div>
                <h2 className="font-display text-xl font-semibold text-ink">
                  {s.heading}
                </h2>
                {s.body.map((p, i) => (
                  <p key={i} className="mt-3 text-ink-muted">
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}

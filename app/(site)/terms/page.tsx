import { buildMetadata } from "@/lib/metadata";
import type { SiteConfig } from "@/content/types";
import { getSite, shortLocation } from "@/lib/content";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/Reveal";

export const metadata = buildMetadata({
  title: "Terms & Transparency",
  description:
    "How Doxa Innovations engages clients: proposals and contracts, milestone payments with no full upfront, full IP ownership on final payment, confidentiality, and support.",
  path: "/terms",
});

const sections = (SITE: SiteConfig): { heading: string; body: string[] }[] => [
  {
    heading: "How we engage",
    body: [
      "Every engagement starts with a free discovery call, followed by a written proposal covering scope, deliverables, timeline, and phased pricing. Work begins only after both sides sign an internationally accepted digital contract. The contract, not this page, governs the specifics of your project.",
    ],
  },
  {
    heading: "Payments and milestones",
    body: [
      "We never ask for full payment upfront. Our standard model is 30% to begin, 40% at mid-delivery, and 30% on final delivery, tailored per project in your contract.",
      "We accept PayPal and bank transfer to our US bank account, and invoice in US Dollars or Euros. We do not use Wise.",
    ],
  },
  {
    heading: "Intellectual property",
    body: [
      "You own everything. Upon final payment, 100% of the source code, design files, and assets we create for you transfer to you. We claim no ongoing rights over your product.",
    ],
  },
  {
    heading: "Confidentiality",
    body: [
      "We treat your business information, materials, and project details as confidential and share them only with the team members and providers who need them to deliver your work.",
    ],
  },
  {
    heading: "Revisions, warranty, and support",
    body: [
      "Revisions are built into each stage, and you approve work before we advance. After launch, we provide a 30-day bug-fix period at no additional cost, and optional monthly maintenance retainers for ongoing care.",
    ],
  },
  {
    heading: "Transparency and legal standing",
    body: [
      "Doxa Innovations is a registered private limited company in Ethiopia with a verifiable trade license, Taxpayer ID, and VAT registration. You can confirm our standing independently on the Ethiopian Ministry of Trade portal, linked from our Legal & Trust page.",
    ],
  },
  {
    heading: "Contact",
    body: [
      `Questions about these terms? Email ${SITE.email}. ${SITE.legalName}, ${shortLocation(SITE.address)}.`,
    ],
  },
];

export default async function TermsPage() {
  const SECTIONS = sections(await getSite());
  return (
    <>
      <PageHeader
        eyebrow="Terms"
        title="Terms & Transparency"
        lead="Effective December 2024. The plain-language version of how we work, what you own, and how you're protected."
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

import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { LegalDetails } from "@/components/marketing/LegalDetails";
import { CtaBand } from "@/components/marketing/CtaBand";
import { Reveal } from "@/components/Reveal";
import { isEthiopianVisitor } from "@/lib/geo";

export const metadata = buildMetadata({
  title: "Legal & Trust",
  description:
    "Doxa Innovations' legal registration, contract process, payment policy, and intellectual-property terms, all in the open. A registered Ethiopian PLC you can verify before you reach out.",
  path: "/legal",
});

const POLICIES = [
  {
    title: "What an Ethiopian PLC means for you",
    body: "Doxa Innovations is a Private Limited Company (PLC) registered in Ethiopia, a formal, tax-paying legal entity with commercial registration, a Taxpayer ID, and a VAT number. That means there is a real, accountable company behind every contract, not an anonymous freelancer.",
  },
  {
    title: "The contract process",
    body: "We use an internationally accepted digital contract (DocuSign or equivalent). It specifies the milestone payment schedule, the transfer of all deliverables to you on final payment, dispute-resolution terms, and our full legal details. You review and sign before any work, and any payment, begins.",
  },
  {
    title: "Payment policy",
    body: "There is never a full upfront payment. The typical model is 30% to begin, 40% at mid-delivery, and 30% on final delivery. We accept PayPal and bank transfer to our US bank account, and invoice in US Dollars or Euros per your preference. We do not use Wise.",
  },
  {
    title: "Intellectual property",
    body: "You own everything. Upon final payment, 100% of the source code, design files, and assets transfer to you, no exceptions, no code held hostage.",
  },
];

export default async function LegalPage() {
  const isEthiopia = await isEthiopianVisitor();
  return (
    <>
      <PageHeader
        eyebrow="Legal & Trust"
        title="Our legal standing, in the open"
        lead="Most agencies don't have a page like this. That's exactly why we do, read and verify everything before you even reach out."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Legal & Trust", path: "/legal" },
        ]}
      />

      <Section variant="muted" frame>
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold text-ink">Registration details</h2>
          <Reveal>
            <div className="mt-6">
              <LegalDetails showVerification={!isEthiopia} />
            </div>
          </Reveal>

          <div className="mt-12 space-y-8">
            {POLICIES.map((p) => (
              <Reveal key={p.title}>
                <div>
                  <h2 className="text-xl font-bold text-ink">{p.title}</h2>
                  <p className="mt-3 text-ink/70">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <CtaBand
        title="Questions about how we work?"
        body="Ask us anything on a free call, including a walkthrough of our registration documents."
        primaryLabel="Talk to Us"
      />
    </>
  );
}

import { buildMetadata } from "@/lib/metadata";
import type { SiteConfig } from "@/content/types";
import { getSite, shortLocation } from "@/lib/content";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/Reveal";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "How Doxa Innovations collects, uses, and protects your personal data. We never sell your data, and you can request access or deletion at any time.",
  path: "/privacy",
});

/**
 * This policy has to describe what the site ACTUALLY does, in the same plain
 * voice as the rest of the site. Measurement was added here deliberately, so
 * the honest thing is to say exactly how it works, including the parts that
 * run whether or not someone accepts cookies.
 *
 * Things that must be kept in step when either side changes:
 *  - the 14-month visit retention below matches RETENTION_DAYS in
 *    scripts/prune-visits.ts
 *  - the cookie names match lib/consent.ts
 *  - the third-party services named below match the tags actually published in
 *    the GTM container. This is the one that will drift, because the container
 *    is edited in a web UI with no review. Adding a tag there is a change to
 *    this policy and, if it collects something new, a CONSENT_POLICY_VERSION
 *    bump in lib/consent.ts — which re-asks every visitor.
 */
const sections = (SITE: SiteConfig): { heading: string; body: string[] }[] => [
  {
    heading: "What this policy covers",
    body: [
      "This policy explains what personal data Doxa Innovations Software Development PLC collects through this website, how we use it, and the choices you have. We keep data collection to the minimum needed to talk with you and deliver our work.",
    ],
  },
  {
    heading: "Information you give us",
    body: [
      "When you submit our contact form, we collect the details you provide: your name, email address, company, country, project type, budget range, and your message. We do not require any sensitive personal data to start a conversation.",
      "We store that enquiry so it cannot be lost, send a copy to our team, and send you a confirmation email so you know it arrived.",
    ],
  },
  {
    heading: "How we measure visits, and why it works without cookies",
    body: [
      "We want to know which channels bring people to this site, such as a search result, a link from another site, or an advert we paid for. To do that we record one row per visit containing the page you arrived on, the site that referred you, any campaign tags in the link, your country as reported by our content delivery network, and whether you are on a desktop or a phone.",
      "That measurement does not use cookies and stores nothing on your device. Instead of an identifier we keep a one-way cryptographic hash of your IP address and browser type, mixed with a secret and the current date. It cannot be reversed into an IP address, and because the date is part of it, it changes every midnight UTC and cannot be used to follow you from one day to the next. We do not store your IP address itself.",
      "Because nothing is read from or written to your device for this, it runs for every visitor, including those who decline cookies. We rely on our legitimate interest in understanding how people find our business.",
    ],
  },
  {
    heading: "Cookies, and what happens if you decline",
    body: [
      "Necessary cookies are always on. There are two: one remembers your cookie choice so we do not ask again, and one keeps our own staff signed in to the admin area. Neither is used to track you.",
      "Analytics cookies are optional and off unless you turn them on. If you accept, we set a first-party cookie containing a random identifier that lasts twelve months. It lets us recognise a returning visit across several days, rather than only within one session, so we can tell a repeat visitor from a new one. Accepting also turns on two outside services, described next.",
      "Google Analytics counts pages, sessions and the route people take through the site. Microsoft Clarity records how pages are actually used: it captures pointer movement, clicks, taps and scrolling, and replays them so we can see where a layout confuses people. It also builds heatmaps of where visitors click. We ask you to read that plainly: with Analytics accepted, your visit can be watched back as a recording. Clarity masks the text you type, so what you enter in the contact form is not captured, and it does not record any other browser tab or anything outside this site.",
      "Marketing cookies are optional and off unless you turn them on. They allow advertising services to measure whether an advert led to an enquiry. We use Google Consent Mode, so those services are told your choice before they are permitted to measure anything.",
      "Neither of those services runs before you accept. They are loaded through a tag manager that is told your choice first and holds them back until it is granted, and the same applies if you change your mind later.",
      "If you decline, no optional cookies are set, and the identifier cookie is deleted if you had previously accepted. You can change your mind at any time using the Cookie settings link in the footer.",
    ],
  },
  {
    heading: "How we use your information",
    body: [
      "We use your information only to respond to your enquiry, schedule a discovery call, prepare a proposal, and deliver and support the work you engage us for. We use the measurement data to understand which channels bring us enquiries so we know where to spend our effort.",
      "We do not sell, rent, or trade your personal data to anyone, ever, and we do not use it to build a profile of you or to make automated decisions about you.",
    ],
  },
  {
    heading: "Who we share it with",
    body: [
      "We share data only with the service providers that help us operate, and only to the extent needed to provide the service. Those are our email provider, which delivers the messages described above, Cloudflare, which serves this site and provides the country information, and our hosting and database provider, which stores the enquiries and visit records. They are bound to protect your data and may not use it for their own purposes.",
      "If you accept optional cookies, two more are added. Google receives analytics and advertising measurement data through Google Analytics and Google Ads. Microsoft receives the session recordings and heatmaps described above through Microsoft Clarity. Both are large companies that set their own terms for the data they gather, which is precisely why they are switched off until you say otherwise. Neither receives your name, email address or the contents of your enquiry: that is stored in our own database and sent to our own inbox, and nowhere else.",
    ],
  },
  {
    heading: "How long we keep it",
    body: [
      "Visit records are deleted after 14 months. This is enforced by a scheduled job, not by intention.",
      "Session recordings in Microsoft Clarity are deleted after 30 days, which is Clarity's own limit and not something we extend. Google Analytics data is kept for the period set on that account.",
      "Enquiries are kept for as long as needed to serve you and to meet our legal and accounting obligations, then deleted. Records of cookie choices are kept as evidence that consent was given, which is itself a legal requirement.",
    ],
  },
  {
    heading: "Your rights",
    body: [
      "You may request access to, correction of, or deletion of your personal data, ask us to restrict or stop processing it, or receive a copy in a portable format. Where we rely on consent, you may withdraw it at any time, and where we rely on legitimate interest, you may object.",
      "One honest limitation: because the visit measurement described above holds no identifier that can be traced back to you, we usually cannot locate your specific visit records, and the law does not require us to collect extra data purely to make you identifiable. Anything tied to an enquiry you sent us can always be found and removed.",
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
      `Questions about this policy? Email ${SITE.email}. ${SITE.legalName}, ${shortLocation(SITE.address)}.`,
    ],
  },
];

export default async function PrivacyPage() {
  const SECTIONS = sections(await getSite());
  return (
    <>
      <PageHeader
        eyebrow="Privacy"
        title="Privacy Policy"
        lead="Effective December 2024. We collect as little as possible, never sell your data, and delete it on request."
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

import { Mail, MessageCircle, Send, MapPin, Clock } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import { SITE as STATIC_SITE } from "@/content/site";
import { getSite, longLocation } from "@/lib/content";
import { turnstileSiteKey } from "@/lib/turnstile";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { ContactForm } from "@/components/ContactForm";

// Metadata is static, so it cannot await the CMS. It reads the email from the
// static config rather than hardcoding the address, which is what it used to
// do and the only place an email was duplicated outside content/site.ts.
export const metadata = buildMetadata({
  title: "Contact Doxa Innovations",
  description: `Book a free 30-minute discovery call. Email ${STATIC_SITE.email}, message us on WhatsApp or Telegram, or send the form. We respond within 24 hours on business days.`,
  path: "/contact",
});

export default async function ContactPage() {
  const SITE = await getSite();
  const whatsappUrl = `https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}`;
  const telegramUrl = `https://t.me/${SITE.telegram}`;

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's talk, the first call is free"
        lead="Tell us what you're trying to build. No obligation, no upfront payment, no sales pressure."
      />

      <Section variant="muted" frame>
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Methods */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-ink">Reach us directly</h2>
            <ul className="mt-6 space-y-5">
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
                <div>
                  <p className="text-sm font-semibold text-ink">Email</p>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="text-sm text-ink/70 hover:text-brand"
                  >
                    {SITE.email}
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <MessageCircle className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
                <div>
                  <p className="text-sm font-semibold text-ink">Phone / WhatsApp</p>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-ink/70 hover:text-brand"
                  >
                    {SITE.phone}
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <Send className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
                <div>
                  <p className="text-sm font-semibold text-ink">Telegram</p>
                  <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-ink/70 hover:text-brand"
                  >
                    @{SITE.telegram}
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
                <div>
                  <p className="text-sm font-semibold text-ink">Office</p>
                  <a
                    href={SITE.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-ink/70 hover:text-brand"
                  >
                    {longLocation(SITE.address)}
                  </a>
                </div>
              </li>
            </ul>

            <div className="mt-8 flex gap-3 rounded-[1.25rem] border border-line bg-panel p-5">
              <Clock className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
              <p className="text-sm text-ink-muted">
                <span className="font-semibold text-ink">
                  We respond within 24 hours
                </span>{" "}
                on business days. For urgent matters, WhatsApp and Telegram are
                the fastest channels.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="rounded-[1.6rem] border border-line bg-panel p-6 shadow-[0_40px_90px_-50px_rgba(124,60,180,0.6)] sm:p-8">
              <ContactForm turnstileSiteKey={turnstileSiteKey()} />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

import { Mail, MessageCircle, Send, MapPin, Clock } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import { SITE } from "@/content/site";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { ContactForm } from "@/components/ContactForm";

export const metadata = buildMetadata({
  title: "Contact Doxa Innovations",
  description:
    "Book a free 30-minute discovery call. Email company@doxaplc.com, message us on WhatsApp or Telegram, or send the form. We respond within 24 hours on business days.",
  path: "/contact",
});

export default function ContactPage() {
  const whatsappUrl = `https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}`;
  const telegramUrl = `https://t.me/${SITE.telegram}`;

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's talk, the first call is free"
        lead="Tell us what you're trying to build. No obligation, no upfront payment, no sales pressure."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]}
      />

      <Section variant="surface">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Methods */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-ink">Reach us directly</h2>
            <ul className="mt-6 space-y-5">
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-5 shrink-0 text-pj-secondary" aria-hidden />
                <div>
                  <p className="text-sm font-semibold text-ink">Email</p>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="text-sm text-ink/70 hover:text-pj-secondary"
                  >
                    {SITE.email}
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <MessageCircle className="mt-0.5 size-5 shrink-0 text-pj-secondary" aria-hidden />
                <div>
                  <p className="text-sm font-semibold text-ink">Phone / WhatsApp</p>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-ink/70 hover:text-pj-secondary"
                  >
                    {SITE.phone}
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <Send className="mt-0.5 size-5 shrink-0 text-pj-secondary" aria-hidden />
                <div>
                  <p className="text-sm font-semibold text-ink">Telegram</p>
                  <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-ink/70 hover:text-pj-secondary"
                  >
                    @{SITE.telegram}
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-pj-secondary" aria-hidden />
                <div>
                  <p className="text-sm font-semibold text-ink">Office</p>
                  <a
                    href={SITE.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-ink/70 hover:text-pj-secondary"
                  >
                    {SITE.address.street}, {SITE.address.city},{" "}
                    {SITE.address.region}, {SITE.address.country}
                  </a>
                </div>
              </li>
            </ul>

            <div className="mt-8 flex gap-3 rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-5">
              <Clock className="mt-0.5 size-5 shrink-0 text-pj-secondary" aria-hidden />
              <p className="text-sm text-ink/80">
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
            <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.02] p-6 shadow-[0_40px_90px_-50px_rgba(124,60,180,0.6)] sm:p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

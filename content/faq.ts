import type { FaqItem } from "./types";

/**
 * Frequently asked questions. This SAME array renders the /how-it-works
 * accordion and the FAQPage JSON-LD — so the visible answers always match the
 * structured data (a Google requirement for FAQ rich results).
 */
export const FAQS: FaqItem[] = [
  {
    question: "Do I need to pay anything to get started?",
    answer:
      "No. The first call is free and there is no obligation. We start with a conversation, not an invoice.",
  },
  {
    question: "What if I'm not happy with the work?",
    answer:
      "Revisions are built into each stage and you approve before we advance. The contract specifies how many revision rounds are included, so there are no surprises.",
  },
  {
    question: "How do I pay you?",
    answer:
      "We accept international wire transfer, Wise (formerly TransferWise), and PayPal. Invoices are issued in US Dollars or Euros, per your preference.",
  },
  {
    question: "What currency do you invoice in?",
    answer:
      "US Dollars or Euros, whichever you prefer.",
  },
  {
    question: "Can I see your legal registration?",
    answer:
      "Yes. It's published on this website and we share it on the video call. Our Taxpayer ID (TIN) is 0093503857 and it is independently verifiable with the Ethiopian Revenue Authority.",
  },
  {
    question: "What happens to my code at the end?",
    answer:
      "You own it — 100%. All source code, design files, and assets transfer to you upon final payment. No exceptions.",
  },
];

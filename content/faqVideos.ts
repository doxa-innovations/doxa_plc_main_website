export interface FaqVideo {
  question: string;
  answer: string;
  /** Portrait clip answering the question. TODO: add real video URLs. */
  videoSrc?: string;
}

/**
 * The six questions we answer on video (portrait, tech-talk style). The same
 * question/answer pairs feed the FAQPage JSON-LD on /faq.
 */
export const FAQ_VIDEOS: FaqVideo[] = [
  {
    question: "What does working with Doxa look like?",
    answer:
      "We start with a free call, write a clear proposal, sign a contract, then build in stages you review and approve before we move on. From hello to launch, you always know what comes next.",
  },
  {
    question: "How can you be so affordable?",
    answer:
      "We operate from Ethiopia, where a US dollar funds far more professional work. That is optimized operations, not cheap labor, and the saving passes straight to you at the same quality.",
  },
  {
    question: "How do I know Doxa isn't a scam?",
    answer:
      "We are a registered private limited company with a verifiable trade license, TIN, and VAT number. You can check our license on the government site, and we show our faces and IDs on the first video call.",
  },
  {
    question: "Why should you choose Doxa?",
    answer:
      "Enterprise-grade quality at a fraction of Western agency rates, full transparency, no upfront payment, and complete ownership of everything we build for you.",
  },
  {
    question: "How solid is your engineering?",
    answer:
      "We build on modern, battle-tested foundations: containerized services, modern frameworks, managed databases, and CDNs, set up for reliability, security, and scale, not shortcuts.",
  },
  {
    question: "What stops you from taking my money and disappearing?",
    answer:
      "Payment happens in milestones, never fully upfront, and is protected by contract. You own all source code and assets on final payment, and there is always a real, registered company behind the work.",
  },
];

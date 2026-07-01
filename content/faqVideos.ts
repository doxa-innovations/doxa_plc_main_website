import { WALKTHROUGH_VIDEO, WALKTHROUGH_POSTER } from "./media";

export interface FaqVideo {
  question: string;
  answer: string;
  /** Portrait clip answering the question. */
  videoSrc?: string;
  /** Poster frame shown before play. */
  poster?: string;
}

/**
 * The short questions we answer on video (portrait, tech-talk style). The same
 * question/answer pairs feed the FAQPage JSON-LD on /faq and the FAQ section on
 * the thank-you page. For now every clip points at the office walkthrough video
 * as a placeholder; swap `videoSrc` per question when the real clips land.
 */
const PLACEHOLDER_VIDEO = WALKTHROUGH_VIDEO;
const PLACEHOLDER_POSTER = WALKTHROUGH_POSTER;

export const FAQ_VIDEOS: FaqVideo[] = [
  {
    question: "What does working with Doxa look like?",
    answer:
      "We start with a free call, write a clear proposal, sign a contract, then build in stages you review and approve before we move on. From hello to launch, you always know what comes next.",
    videoSrc: PLACEHOLDER_VIDEO,
    poster: PLACEHOLDER_POSTER,
  },
  {
    question: "How can you be so affordable?",
    answer:
      "We operate from Ethiopia, where a US dollar funds far more professional work. That is optimized operations, not cheap labor, and the saving passes straight to you at the same quality.",
    videoSrc: PLACEHOLDER_VIDEO,
    poster: PLACEHOLDER_POSTER,
  },
  {
    question: "How do I know Doxa isn't a scam?",
    answer:
      "We are a registered private limited company with a verifiable trade license, TIN, and VAT number. You can check our license on the government site, and we show our faces and IDs on the first video call.",
    videoSrc: PLACEHOLDER_VIDEO,
    poster: PLACEHOLDER_POSTER,
  },
  {
    question: "What stops you from taking my money and disappearing?",
    answer:
      "Payment happens in milestones, never fully upfront, and is protected by contract. You own all source code and assets on final payment, and there is always a real, registered company behind the work.",
    videoSrc: PLACEHOLDER_VIDEO,
    poster: PLACEHOLDER_POSTER,
  },
];

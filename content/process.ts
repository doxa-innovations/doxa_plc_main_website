import type { PaymentMilestone, ProcessStage } from "./types";

/** The six engagement stages, shown as a stepper on /how-it-works. */
export const PROCESS_STAGES: ProcessStage[] = [
  {
    number: 1,
    title: "Discovery Call",
    image:
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1200&q=70",
    description:
      "You send a short message or email. Within 24 hours we propose a video-call time. On the call we show our faces and, if you ask, our government-issued ID and business registration. This is about understanding your project, not selling to you. Zero financial commitment.",
  },
  {
    number: 2,
    title: "Project Proposal",
    // Our own team mapping a product out on the office whiteboard — real
    // scoping work, in place of the stock photo that used to sit here.
    image: "/office_planning.png",
    description:
      "Within 3 to 5 business days we deliver a written proposal covering scope, deliverables, timeline, tech stack, and phased pricing. Nothing is vague. If something is unclear, there's a revision round before anything is signed.",
  },
  {
    number: 3,
    title: "Contract Signing",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=70",
    description:
      "We sign an internationally accepted digital contract specifying the milestone payment schedule, transfer of all deliverables to you on final payment, dispute-resolution terms, and our legal details. There is no full upfront payment.",
  },
  {
    number: 4,
    title: "Development & Reviews",
    // The team mid-build in the Bishoftu office.
    image: "/workers.png",
    description:
      "Work happens in sprint cycles. Every 1 to 2 weeks you get a progress update and review the work in a staging environment. Your feedback is incorporated before we move on. You are never surprised.",
  },
  {
    number: 5,
    title: "Launch & Handover",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=70",
    description:
      "Once approved, we deploy to your chosen hosting, transfer all credentials, and deliver a handover document covering repository access, admin credentials, hosting setup, and maintenance instructions.",
  },
  {
    number: 6,
    title: "Post-Launch Support",
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=70",
    description:
      "Optional monthly maintenance retainers start at $100/month. Even without a retainer, you get a 30-day post-launch bug-fix period at no additional cost.",
  },
];

/** The 30 / 40 / 30 milestone payment structure. */
export const PAYMENT_MILESTONES: PaymentMilestone[] = [
  { label: "To Begin", percent: 30, unlocks: "Kicks off design & development" },
  {
    label: "Mid-Delivery",
    percent: 40,
    unlocks: "Released when core work is delivered for review",
  },
  {
    label: "Final Delivery",
    percent: 30,
    unlocks: "Paid on approval; unlocks full ownership & handover",
  },
];

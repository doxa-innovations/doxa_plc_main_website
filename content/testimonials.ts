import type { Testimonial } from "./types";

/**
 * Testimonials are entered in /olympus, not in code, because they arrive one
 * at a time long after a deploy. There is no production seed list, and there
 * must never be one: writing a quote and attributing it to a person is
 * fabricating a review, and an empty section costs nothing by comparison. The
 * home page hides the whole band when there are none.
 *
 * What is below is DEVELOPMENT-ONLY sample data, so the scrolling row can be
 * seen and worked on before any real quote exists. `lib/seed.ts` skips it
 * entirely when NODE_ENV is production, which the standalone `server.js`
 * always sets, so it cannot reach the live site.
 *
 * Every person and company here is INVENTED. None of it is attributed to a
 * real Doxa client — a made-up quote under a real client's name would be the
 * genuinely damaging version of this, gate or no gate.
 */
export type TestimonialSeed = Omit<Testimonial, "id">;

export const DEV_TESTIMONIALS: TestimonialSeed[] = [
  {
    name: "Hanna Girma",
    quote:
      "They asked harder questions than we did. The scope we ended up with was smaller than the one we walked in with, and the thing shipped on the date they gave us in week one.",
    rating: 5,
    photo: "",
    role: "Operations Director at Three Roots International",
    date: "2026-05-01",
  },
  {
    name: "Daniel Okoye",
    quote:
      "We had been quoted three times what Doxa charged, for less. Six months on, the platform has not gone down once and we own every line of it.",
    rating: 5,
    photo: "",
    role: "Founder at Kanju Logistics",
    date: "2026-04-01",
  },
  {
    name: "Marit de Vries",
    quote:
      "Working across five time zones usually means waiting a day for every answer. It never once felt like that. Weekly demos, written updates, no chasing.",
    rating: 5,
    photo: "",
    role: "Programme Manager at Stichting Vooruit",
    date: "2026-02-01",
  },
  {
    name: "Samuel Bekele",
    quote:
      "The handover was the part that surprised me. Documentation, a walkthrough recording, and the repository transferred the same week. Nothing held hostage.",
    rating: 4,
    photo: "",
    role: "IT Lead at Rift Valley Academy",
    date: "2026-01-01",
  },
  {
    name: "Erin Whitfield",
    quote:
      "They pushed back on a feature I wanted, showed me the numbers, and they were right. That is worth more than an agency that says yes to everything.",
    rating: 5,
    photo: "",
    role: "Owner at Northpoint Outfitters",
    date: "2025-11-01",
  },
];

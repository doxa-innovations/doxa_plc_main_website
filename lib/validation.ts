import { z } from "zod";

export const PROJECT_TYPES = [
  "Website",
  "E-Commerce",
  "Custom Software",
  "Mobile App",
  "Branding",
  "Maintenance",
  "Other",
] as const;

export const BUDGET_RANGES = [
  "Under $2,000",
  "$2,000 – $5,000",
  "$5,000 – $10,000",
  "$10,000+",
  "Not sure yet",
] as const;

/**
 * Contact form schema — shared by the client form and the server route so the
 * server never trusts the client. `_gotcha` is a honeypot that must stay empty.
 */
export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.email("Enter a valid email address."),
  company: z.string().max(120).optional().or(z.literal("")),
  country: z.string().min(2, "Please tell us your country."),
  projectType: z.enum(PROJECT_TYPES, { message: "Pick a project type." }),
  budget: z.enum(BUDGET_RANGES, { message: "Pick a budget range." }),
  message: z.string().min(10, "Tell us a little about your project."),
  _gotcha: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

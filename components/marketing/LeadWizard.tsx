"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Check,
  CircleHelp,
  Globe,
  LifeBuoy,
  Palette,
  ShoppingCart,
  Smartphone,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import {
  contactSchema,
  type ContactInput,
  PROJECT_TYPES,
  BUDGET_RANGES,
} from "@/lib/validation";
import { trackLead } from "@/lib/gtm";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * The home page's four-step version of the contact form.
 *
 * It is a different SHAPE, not a different pipeline: same `contactSchema`,
 * same POST to /api/contact, same honeypot, same Turnstile token, same
 * /thank-you redirect, same Leads row at the end. Everything the contact page
 * earned — persisting before mailing, attribution, the silent-200 bot
 * handling — applies here for free, and there is exactly one server-side
 * definition of what a valid enquiry is.
 *
 * Why four steps rather than one long form on the home page: the contact page
 * is for someone who has already decided to write to us. This is for someone
 * still scrolling. Asking a single question per screen, starting with a
 * choice they can answer by clicking, is a far lower opening cost than a page
 * of empty text boxes.
 */

/** Which fields must be valid before the Continue button on each step works. */
const STEP_FIELDS = [
  ["projectType"],
  ["company", "country"],
  ["budget"],
  ["name", "email", "message"],
] as const satisfies readonly (readonly (keyof ContactInput)[])[];

const TOTAL = STEP_FIELDS.length;

/** Human names for the "Still needed" hint, so it never shows a field key. */
const FIELD_LABELS: Record<string, string> = {
  projectType: "project type",
  company: "company",
  country: "country",
  budget: "budget",
  name: "your name",
  email: "email",
  message: "a note about the project",
};

/**
 * Icons reuse the service mapping, so the choice a visitor makes here looks
 * like the service they just scrolled past.
 */
const PROJECT_ICONS: Record<(typeof PROJECT_TYPES)[number], LucideIcon> = {
  Website: Globe,
  "E-Commerce": ShoppingCart,
  "Custom Software": Wrench,
  "Mobile App": Smartphone,
  Branding: Palette,
  Maintenance: LifeBuoy,
  Other: CircleHelp,
};

const BUDGET_ICONS: Record<(typeof BUDGET_RANGES)[number], LucideIcon> = {
  "Under $2,000": Briefcase,
  "$2,000 – $5,000": Briefcase,
  "$5,000 – $10,000": Briefcase,
  "$10,000+": Briefcase,
  "Not sure yet": CircleHelp,
};

/**
 * A single choice tile.
 *
 * Rendered as a radio group rather than a row of buttons: arrow keys move
 * between options, only the selected one is a tab stop, and a screen reader
 * announces "2 of 7 selected" instead of seven unrelated buttons.
 */
function ChoiceGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  icons,
}: {
  label: string;
  options: readonly T[];
  value: T | undefined;
  onChange: (value: T) => void;
  icons: Record<T, LucideIcon>;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="grid gap-3 sm:grid-cols-2">
      {options.map((option) => {
        // Annotated because TypeScript will not narrow `Record<T, LucideIcon>[T]`
        // to LucideIcon while T is still generic, and JSX then rejects the props.
        const Icon: LucideIcon = icons[option];
        const selected = value === option;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={selected}
            // Roving tabindex: the group is one tab stop, arrows move within.
            tabIndex={selected || (!value && option === options[0]) ? 0 : -1}
            onClick={() => onChange(option)}
            onKeyDown={(e) => {
              if (!["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(e.key))
                return;
              e.preventDefault();
              const i = value ? options.indexOf(value) : 0;
              const forward = e.key === "ArrowRight" || e.key === "ArrowDown";
              const next =
                (i + (forward ? 1 : -1) + options.length) % options.length;
              onChange(options[next]);
            }}
            className={cn(
              "flex items-center gap-3 rounded-[1rem] border p-3 text-left transition-colors duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
              selected
                ? "border-pj-secondary/60 bg-pj-primary/15 text-ink"
                : "border-line bg-panel text-ink-muted hover:border-line-strong hover:text-ink",
            )}
          >
            <span
              className={cn(
                "grid size-9 shrink-0 place-items-center rounded-lg border transition-colors duration-200",
                selected
                  ? "border-pj-secondary/50 bg-pj-primary/25 text-ink"
                  : "border-line bg-panel-strong text-brand",
              )}
            >
              <Icon className="size-4" strokeWidth={1.75} aria-hidden />
            </span>
            <span className="text-sm font-medium">{option}</span>
            {selected && (
              <Check
                className="ml-auto size-4 shrink-0 text-brand"
                strokeWidth={2.5}
                aria-hidden
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

function Titled({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="font-display text-2xl font-semibold tracking-[-0.02em] text-ink">
        {title}
      </h3>
      <p className="mt-1 text-sm text-ink-muted">{hint}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

export function LeadWizard({
  turnstileSiteKey = "",
  fallbackEmail = "",
}: {
  turnstileSiteKey?: string;
  fallbackEmail?: string;
}) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const uid = useId();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState<string | null>(null);

  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    // Validate as they go, so the Continue button reflects the current state
    // rather than only waking up after a failed press.
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      company: "",
      country: "",
      message: "",
      _gotcha: "",
    },
  });

  // `useWatch`, not `form.watch()`. The latter returns a fresh function on
  // every render, which makes React Compiler skip memoising this whole
  // component; the hook form subscribes properly and compiles.
  const values = useWatch({ control: form.control });
  const submitting = form.formState.isSubmitting;
  const isLast = step === TOTAL - 1;

  /**
   * What is still missing on this step.
   *
   * Derived from the values rather than from react-hook-form's error map on
   * purpose: errors only exist for fields that have been touched, so a
   * pristine step would claim nothing was needed and the disabled button
   * would have no explanation.
   */
  const missing = STEP_FIELDS[step].filter((field) => {
    const value = values[field];
    if (field === "company") return false; // optional, per contactSchema
    if (field === "message") return String(value ?? "").trim().length < 10;
    if (field === "country") return String(value ?? "").trim().length < 2;
    if (field === "name") return String(value ?? "").trim().length < 2;
    if (field === "email") return !/^\S+@\S+\.\S+$/.test(String(value ?? ""));
    return !value;
  });
  const canAdvance = missing.length === 0;

  async function next() {
    const ok = await form.trigger([...STEP_FIELDS[step]]);
    if (!ok) return;
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL - 1));
  }

  function back() {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function onSubmit(input: ContactInput) {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, _turnstile: turnstileToken }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        form.reset();
        // Same conversion as the contact page, tagged with which form it came
        // from. One event name, so a GTM trigger does not need updating when a
        // third entry point appears.
        trackLead("home-wizard");
        router.push("/thank-you");
      } else {
        toast.error(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    }
  }

  return (
    <div className="rounded-[1.6rem] border border-line bg-panel p-6 shadow-[0_40px_90px_-50px_rgba(124,60,180,0.6)] sm:p-8">
      {/* Progress: one segment per step, filled up to where they are. */}
      <div className="flex gap-2" aria-hidden>
        {STEP_FIELDS.map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-300",
              i <= step ? "bg-pj-secondary" : "bg-panel-strong",
            )}
          />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs">
        <p className="font-medium uppercase tracking-[0.16em] text-brand">
          Step {step + 1} of {TOTAL}
        </p>
        <p className="text-ink-muted">Takes about a minute</p>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="mt-6"
        // Enter on a text field should advance rather than submit from step 2,
        // otherwise the browser fires submit on an incomplete form.
        onKeyDown={(e) => {
          if (e.key === "Enter" && !isLast) {
            e.preventDefault();
            void next();
          }
        }}
      >
        {/* Honeypot, hidden from users, must stay empty */}
        <div className="sr-only" aria-hidden>
          <label htmlFor={`${uid}-gotcha`}>Leave this field empty</label>
          <input
            id={`${uid}-gotcha`}
            tabIndex={-1}
            autoComplete="off"
            {...form.register("_gotcha")}
          />
        </div>

        {/* The step number changes under assistive tech without stealing focus. */}
        <p className="sr-only" aria-live="polite">
          Step {step + 1} of {TOTAL}
        </p>

        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: direction * 24 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: direction * -24 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {step === 0 && (
              <Titled
                title="What are you building?"
                hint="Pick the closest — we'll refine it together."
              >
                <ChoiceGroup
                  label="Project type"
                  options={PROJECT_TYPES}
                  value={values.projectType}
                  onChange={(v) =>
                    form.setValue("projectType", v, { shouldValidate: true })
                  }
                  icons={PROJECT_ICONS}
                />
              </Titled>
            )}

            {step === 1 && (
              <Titled
                title="Who are we building it for?"
                hint="The country tells us your timezone and which currency to quote in."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor={`${uid}-company`}>
                      Company{" "}
                      <span className="text-ink-muted">(optional)</span>
                    </Label>
                    <Input
                      id={`${uid}-company`}
                      placeholder="Company or organisation"
                      autoComplete="organization"
                      {...form.register("company")}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`${uid}-country`}>Country</Label>
                    <Input
                      id={`${uid}-country`}
                      placeholder="Where you're based"
                      autoComplete="country-name"
                      {...form.register("country")}
                    />
                  </div>
                </div>
              </Titled>
            )}

            {step === 2 && (
              <Titled
                title="What's the budget?"
                hint="A range is enough. It decides scope, not whether we reply."
              >
                <ChoiceGroup
                  label="Budget range"
                  options={BUDGET_RANGES}
                  value={values.budget}
                  onChange={(v) =>
                    form.setValue("budget", v, { shouldValidate: true })
                  }
                  icons={BUDGET_ICONS}
                />
              </Titled>
            )}

            {step === 3 && (
              <Titled
                title="Where do we send the reply?"
                hint="We answer every enquiry within one business day."
              >
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor={`${uid}-name`}>Name</Label>
                      <Input
                        id={`${uid}-name`}
                        placeholder="Your name"
                        autoComplete="name"
                        {...form.register("name")}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor={`${uid}-email`}>Email</Label>
                      <Input
                        id={`${uid}-email`}
                        type="email"
                        placeholder="you@company.com"
                        autoComplete="email"
                        {...form.register("email")}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`${uid}-message`}>
                      Anything else we should know?
                    </Label>
                    <Textarea
                      id={`${uid}-message`}
                      rows={4}
                      placeholder="A couple of sentences about what you're trying to build."
                      {...form.register("message")}
                    />
                  </div>

                  {/* Mounted only on the last step, so scrolling past this
                      section never loads Cloudflare's script. */}
                  {turnstileSiteKey && (
                    <TurnstileWidget
                      siteKey={turnstileSiteKey}
                      onToken={setTurnstileToken}
                      onError={setTurnstileError}
                    />
                  )}

                  {/* The submit button stays enabled: the server decides
                      whether a token is required and fails open when Turnstile
                      is unconfigured or Cloudflare is unreachable, so
                      disabling here would refuse submissions it would accept. */}
                  {turnstileError && (
                    <p
                      role="alert"
                      className="rounded-[1rem] border border-destructive/40 bg-destructive/10 p-4 text-sm text-ink-muted"
                    >
                      <span className="font-semibold text-ink">
                        We could not run the spam check in your browser.
                      </span>{" "}
                      An ad blocker or a network restriction is the usual
                      cause. Sending may not work.{" "}
                      {fallbackEmail ? (
                        <>
                          Email us at{" "}
                          <a
                            href={`mailto:${fallbackEmail}`}
                            className="text-brand underline underline-offset-4 hover:text-glow"
                          >
                            {fallbackEmail}
                          </a>{" "}
                          instead.
                        </>
                      ) : (
                        <>Please use one of the contact routes in the footer.</>
                      )}
                    </p>
                  )}
                </div>
              </Titled>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex items-end justify-between gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={back}
            disabled={step === 0}
            className="disabled:opacity-40"
          >
            <ArrowLeft className="size-4" strokeWidth={1.75} />
            Back
          </Button>

          <div className="text-right">
            {isLast ? (
              <Button type="submit" size="lg" disabled={submitting || !canAdvance}>
                {submitting ? "Sending…" : "Send enquiry"}
                {!submitting && <ArrowRight className="size-4" strokeWidth={1.75} />}
              </Button>
            ) : (
              <Button
                type="button"
                size="lg"
                onClick={next}
                disabled={!canAdvance}
              >
                Continue
                <ArrowRight className="size-4" strokeWidth={1.75} />
              </Button>
            )}
            {/* Says WHY the button is dead. A disabled control with no
                explanation is the most common dead end in a stepped form. */}
            {missing.length > 0 && (
              <p className="mt-2 text-xs text-ink-muted">
                Still needed:{" "}
                {missing.map((f) => FIELD_LABELS[f] ?? f).join(", ")}
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

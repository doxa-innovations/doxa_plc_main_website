"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  contactSchema,
  type ContactInput,
  PROJECT_TYPES,
  BUDGET_RANGES,
} from "@/lib/validation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * `turnstileSiteKey` arrives as a prop, read from the server's runtime
 * environment. An empty string means Turnstile is not configured and the form
 * behaves exactly as it did before it existed.
 *
 * `fallbackEmail` is the route to a human when the challenge cannot run. It is
 * the CMS-managed public address, the same one the page already shows above
 * the form, so it can never drift from what is displayed.
 */
export function ContactForm({
  turnstileSiteKey = "",
  fallbackEmail = "",
}: {
  turnstileSiteKey?: string;
  fallbackEmail?: string;
}) {
  const router = useRouter();
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState<string | null>(null);
  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      country: "",
      message: "",
      _gotcha: "",
    },
  });

  const submitting = form.formState.isSubmitting;

  async function onSubmit(values: ContactInput) {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // The server verifies this against Cloudflare before storing anything.
        body: JSON.stringify({ ...values, _turnstile: turnstileToken }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        form.reset();
        router.push("/thank-you");
      } else {
        toast.error(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Honeypot, hidden from users, must stay empty */}
        <div className="sr-only" aria-hidden>
          <label htmlFor="_gotcha">Leave this field empty</label>
          <input
            id="_gotcha"
            tabIndex={-1}
            autoComplete="off"
            {...form.register("_gotcha")}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" autoComplete="name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@company.com"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Company <span className="text-ink/40">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Company name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="Where you're based" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="projectType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger
                      className="w-full"
                      aria-label="Select project type"
                    >
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PROJECT_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget Range</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger
                      className="w-full"
                      aria-label="Select budget range"
                    >
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {BUDGET_RANGES.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Description</FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  placeholder="A few sentences about what you're trying to build."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Invisible in the normal case: nothing is drawn unless Cloudflare
            decides this visitor genuinely needs to prove something. Placed
            above the button so that on the rare occasion a challenge does
            appear, it is not below the fold. */}
        {turnstileSiteKey && (
          <TurnstileWidget
            siteKey={turnstileSiteKey}
            onToken={setTurnstileToken}
            onError={setTurnstileError}
          />
        )}

        {/* Shown the moment the challenge fails, not after the visitor has
            written a long message and pressed send. The submit button stays
            enabled on purpose: the server is the authority on whether a token
            is required, and it fails open when Turnstile is unconfigured or
            Cloudflare is unreachable, so disabling here would refuse
            submissions the server would have happily accepted. */}
        {turnstileError && (
          <p
            role="alert"
            className="rounded-[1.25rem] border border-destructive/40 bg-destructive/10 p-4 text-sm text-ink-muted"
          >
            <span className="font-semibold text-ink">
              We could not run the spam check in your browser.
            </span>{" "}
            An ad blocker or a network restriction is the usual cause. Sending
            may not work.{" "}
            {fallbackEmail ? (
              <>
                Email us at{" "}
                <a
                  href={`mailto:${fallbackEmail}`}
                  className="text-brand underline underline-offset-4 hover:text-glow"
                >
                  {fallbackEmail}
                </a>{" "}
                and we will pick it up from there.
              </>
            ) : (
              <>Please use one of the contact routes listed on this page.</>
            )}
          </p>
        )}

        <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
          {submitting ? "Sending…" : "Send Message"}
        </Button>
      </form>
    </Form>
  );
}

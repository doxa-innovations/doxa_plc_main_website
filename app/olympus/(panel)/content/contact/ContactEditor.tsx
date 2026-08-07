"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import type { SiteSetting } from "@/payload-types";

import { saveSiteSettings, type ActionResult } from "../actions";
import { Field } from "../_components/Fields";

/**
 * Contact details, as one form.
 *
 * Left as a single always-visible form rather than the card-and-modal pattern
 * used for tiers, projects and people. There is exactly one of these records,
 * it is never created, deleted or reordered, and hiding a handful of fields
 * behind a modal would add a click without adding clarity.
 */

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? "Saving…" : "Save changes"}
    </Button>
  );
}

export function ContactEditor({ settings }: { settings: SiteSetting }) {
  const [state, formAction] = useActionState<ActionResult, FormData>(
    saveSiteSettings,
    { ok: false },
  );

  return (
    <form action={formAction} className="space-y-4">
      <section className="rounded-[1.25rem] border border-line bg-panel p-5">
        <h2 className="mb-4 font-display text-sm font-semibold text-ink">
          Contact
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Email"
            name="email"
            type="email"
            defaultValue={settings.email}
            required
          />
          <Field
            label="Telegram"
            name="telegram"
            defaultValue={settings.telegram}
            hint="Username without the @."
          />
          <Field
            label="Phone"
            name="phone"
            defaultValue={settings.phone}
            hint="Displayed as written, e.g. +251 961 412 909"
            required
          />
          <Field
            label="Second phone"
            name="phone2"
            defaultValue={settings.phone2}
            hint="Footer only. Leave empty to omit."
          />
          <Field
            label="WhatsApp"
            name="whatsapp"
            defaultValue={settings.whatsapp}
            wide
            hint="Digits only, international format. Anything else is stripped on save."
          />
        </div>
      </section>

      <section className="rounded-[1.25rem] border border-line bg-panel p-5">
        <h2 className="mb-4 font-display text-sm font-semibold text-ink">
          Office
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Street"
            name="street"
            defaultValue={settings.street}
            wide
            hint="The contact and About pages show street, city, region, country. The footer drops the street."
          />
          <Field label="City" name="city" defaultValue={settings.city} required />
          <Field
            label="Region"
            name="region"
            defaultValue={settings.region}
            required
          />
          <Field
            label="Country"
            name="country"
            defaultValue={settings.country}
            required
          />
          <Field
            label="Country code"
            name="countryCode"
            defaultValue={settings.countryCode}
            hint="Two letters, e.g. ET"
          />
          <Field
            label="Google Maps link"
            name="mapUrl"
            defaultValue={settings.mapUrl}
            wide
            hint="Every address on the site links here. The embedded map on the About page is separate and stays in code."
          />
          <Field
            label="Latitude"
            name="latitude"
            type="number"
            defaultValue={settings.latitude}
            hint="Structured data only."
          />
          <Field
            label="Longitude"
            name="longitude"
            type="number"
            defaultValue={settings.longitude}
          />
        </div>
      </section>

      <div className="flex items-center justify-end gap-3">
        {state.error && (
          <span role="alert" className="text-xs text-destructive">
            {state.error}
          </span>
        )}
        {state.ok && !state.error && (
          <span role="status" className="text-xs text-brand">
            Saved. Live now.
          </span>
        )}
        <SaveButton />
      </div>
    </form>
  );
}

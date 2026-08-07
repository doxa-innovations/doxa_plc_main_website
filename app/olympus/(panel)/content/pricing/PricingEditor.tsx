"use client";

import { Check, EyeOff, Star } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import type { AddOn, PricingTier } from "@/payload-types";
import { readStringList } from "@/collections/fields/stringList";
import { cn } from "@/lib/utils";

import { saveAddOn, savePricingTier } from "../actions";
import {
  AddButton,
  DeleteButton,
  DetailDrawer,
  EditButton,
  EditModal,
  EditorShell,
  OpenDetail,
} from "../_components/EditorShell";
import { Area, DetailRow, Field, SelectField } from "../_components/Fields";
import { ListInput } from "../_components/ListInput";
import { SortableArea, SortableItem } from "../_components/Sortable";

/**
 * Tiers and add-ons as draggable cards.
 *
 * Both sections use the same shell: click a card to read it, the pencil to
 * change it, the grip to move it. One modal serves every record rather than
 * one form per record.
 */

const money = (n?: number | null) =>
  typeof n === "number" ? n.toLocaleString() : "—";

function tierPriceLabel(tier: PricingTier): string {
  if (tier.mode === "quote") return "On request";
  return `$${money(tier.amountUsd)} · ETB ${money(tier.amountEtb)}`;
}

export function PricingEditor({
  tiers,
  addOns,
}: {
  tiers: PricingTier[];
  addOns: AddOn[];
}) {
  return (
    <div className="space-y-10">
      {/* ---------------------------------------------------------------- */}
      <EditorShell<PricingTier>>
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-sm font-semibold text-ink">
                Tiers
              </h2>
              <p className="mt-0.5 text-xs text-ink-muted">
                {tiers.length} cards, shown left to right in this order. Drag to
                rearrange.
              </p>
            </div>
            <AddButton label="Add tier" />
          </div>

          {tiers.length === 0 ? (
            <EmptyState message="No tiers yet. Add one to show pricing on the site." />
          ) : (
            <SortableArea items={tiers} collection="pricing-tiers" layout="grid">
              {(tier) => (
                <SortableItem key={tier.id} id={tier.id}>
                  {(handle) => (
                    <article
                      className={cn(
                        "flex h-full flex-col rounded-[1.25rem] border bg-panel p-4 transition-colors",
                        tier.highlighted
                          ? "border-pj-secondary/50 ring-1 ring-pj-secondary/30"
                          : "border-line hover:border-line-strong",
                      )}
                    >
                      <div className="mb-2 flex items-center gap-1">
                        {handle}
                        <span className="min-w-0 flex-1 truncate font-display text-sm font-semibold text-ink">
                          {tier.name}
                        </span>
                        <EditButton record={tier} />
                        <DeleteButton
                          collection="pricing-tiers"
                          id={tier.id}
                          name={tier.name}
                        />
                      </div>

                      <OpenDetail record={tier} className="flex-1">
                        <p className="text-lg font-semibold text-ink">
                          {tierPriceLabel(tier)}
                        </p>
                        <p className="mt-1 line-clamp-2 text-xs text-ink-muted">
                          {tier.bestFor}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {tier.highlighted && (
                            <Chip icon={<Star className="size-3" />}>
                              Most popular
                            </Chip>
                          )}
                          {!tier.published && (
                            <Chip icon={<EyeOff className="size-3" />} muted>
                              Hidden
                            </Chip>
                          )}
                          <Chip>
                            {readStringList(tier.includes).length} inclusions
                          </Chip>
                        </div>
                      </OpenDetail>
                    </article>
                  )}
                </SortableItem>
              )}
            </SortableArea>
          )}
        </section>

        <DetailDrawer<PricingTier>
          title={(t) => t.name}
          render={(t) => (
            <dl>
              <DetailRow label="Price" value={tierPriceLabel(t)} />
              <DetailRow
                label="Mode"
                value={t.mode === "quote" ? "Quote only" : "Starting price"}
              />
              <DetailRow label="Best for" value={t.bestFor} />
              <DetailRow label="Timeline" value={t.timeline} />
              <DetailRow label="Payment" value={t.payment} />
              <DetailRow
                label="Includes"
                value={
                  <ul className="space-y-1">
                    {readStringList(t.includes).map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Check
                          className="mt-0.5 size-3.5 shrink-0 text-brand"
                          strokeWidth={2.5}
                          aria-hidden
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                }
              />
              <DetailRow
                label="Highlighted"
                value={t.highlighted ? "Yes" : "No"}
              />
              <DetailRow
                label="Published"
                value={t.published ? "Live" : "Hidden"}
              />
            </dl>
          )}
        />

        <EditModalTier />
      </EditorShell>

      {/* ---------------------------------------------------------------- */}
      <EditorShell<AddOn>>
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-sm font-semibold text-ink">
                Add-ons
              </h2>
              <p className="mt-0.5 text-xs text-ink-muted">
                USD only. Prices are hidden from visitors in Ethiopia.
              </p>
            </div>
            <AddButton label="Add add-on" />
          </div>

          {addOns.length === 0 ? (
            <EmptyState message="No add-ons yet." />
          ) : (
            <SortableArea items={addOns} collection="add-ons" layout="grid">
              {(addOn) => (
                <SortableItem key={addOn.id} id={addOn.id}>
                  {(handle) => (
                    <article className="flex h-full flex-col rounded-[1.25rem] border border-line bg-panel p-4 transition-colors hover:border-line-strong">
                      <div className="mb-2 flex items-center gap-1">
                        {handle}
                        <span className="min-w-0 flex-1 truncate font-display text-sm font-semibold text-ink">
                          {addOn.name}
                        </span>
                        <EditButton record={addOn} />
                        <DeleteButton
                          collection="add-ons"
                          id={addOn.id}
                          name={addOn.name}
                        />
                      </div>

                      <OpenDetail record={addOn} className="flex-1">
                        <p className="text-lg font-semibold text-ink">
                          ${money(addOn.amountUsd)}
                          {addOn.interval === "month" && (
                            <span className="text-sm font-normal text-ink-muted">
                              /month
                            </span>
                          )}
                        </p>
                        <p className="mt-1 line-clamp-2 text-xs text-ink-muted">
                          {addOn.detail}
                        </p>
                        {!addOn.published && (
                          <div className="mt-3">
                            <Chip icon={<EyeOff className="size-3" />} muted>
                              Hidden
                            </Chip>
                          </div>
                        )}
                      </OpenDetail>
                    </article>
                  )}
                </SortableItem>
              )}
            </SortableArea>
          )}
        </section>

        <DetailDrawer<AddOn>
          title={(a) => a.name}
          render={(a) => (
            <dl>
              <DetailRow
                label="Price"
                value={`$${money(a.amountUsd)}${a.interval === "month" ? " per month" : " one off"}`}
              />
              <DetailRow label="Detail" value={a.detail} />
              <DetailRow
                label="Published"
                value={a.published ? "Live" : "Hidden"}
              />
            </dl>
          )}
        />

        <EditModalAddOn />
      </EditorShell>
    </div>
  );
}

// --- Modals -----------------------------------------------------------------
// Separate components so each can read its own shell's context.

function EditModalTier() {
  return (
    <EditModal<PricingTier>
      action={savePricingTier}
      title={(t) => (t ? `Edit ${t.name}` : "New tier")}
      description="Amounts are plain numbers. The site adds “From”, the currency and the separators."
      render={(t) => (
        <>
          <Field label="Name" name="name" defaultValue={t?.name} required />
          <SelectField
            label="Pricing mode"
            name="mode"
            defaultValue={t?.mode ?? "from"}
            options={[
              { label: "Starting price", value: "from" },
              { label: "Quote only", value: "quote" },
            ]}
            hint="Quote only shows “On request” and changes the button to booking a call."
          />
          <Area
            label="Best for"
            name="bestFor"
            defaultValue={t?.bestFor}
            rows={2}
          />
          <Field
            label="Price, USD"
            name="amountUsd"
            type="number"
            defaultValue={t?.amountUsd}
            hint="Ignored when quote only."
          />
          <Field
            label="Price, ETB"
            name="amountEtb"
            type="number"
            defaultValue={t?.amountEtb}
            hint="Shown to visitors in Ethiopia."
          />
          <Field label="Timeline" name="timeline" defaultValue={t?.timeline} />
          <Field
            label="Payment"
            name="payment"
            defaultValue={t?.payment}
            placeholder="30 / 40 / 30 milestones"
          />
          <ListInput
            label="What it includes"
            name="includes"
            defaultValues={readStringList(t?.includes)}
          />
          <div className="space-y-3 sm:col-span-2">
            <Switch
              name="highlighted"
              label="Highlighted"
              defaultChecked={Boolean(t?.highlighted)}
              hint="Adds the “Most Popular” treatment. Use on one tier."
            />
            <Switch
              name="published"
              label="Published"
              defaultChecked={t ? Boolean(t.published) : true}
              hint="Turn off to hide from the site without deleting."
            />
          </div>
        </>
      )}
    />
  );
}

function EditModalAddOn() {
  return (
    <EditModal<AddOn>
      action={saveAddOn}
      title={(a) => (a ? `Edit ${a.name}` : "New add-on")}
      render={(a) => (
        <>
          <Field label="Name" name="name" defaultValue={a?.name} required />
          <Field
            label="Price, USD"
            name="amountUsd"
            type="number"
            defaultValue={a?.amountUsd}
            required
          />
          <Area label="Detail" name="detail" defaultValue={a?.detail} rows={2} />
          <SelectField
            label="Interval"
            name="interval"
            defaultValue={a?.interval ?? "month"}
            options={[
              { label: "Per month", value: "month" },
              { label: "One off", value: "once" },
            ]}
          />
          <div className="sm:col-span-2">
            <Switch
              name="published"
              label="Published"
              defaultChecked={a ? Boolean(a.published) : true}
            />
          </div>
        </>
      )}
    />
  );
}

// --- Small presentational bits ---------------------------------------------

function Chip({
  children,
  icon,
  muted,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.65rem]",
        muted
          ? "border-line bg-panel-strong text-ink-muted"
          : "border-line bg-panel text-ink-muted",
      )}
    >
      {icon}
      {children}
    </span>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <p className="rounded-[1.25rem] border border-dashed border-line px-4 py-10 text-center text-sm text-ink-muted">
      {message}
    </p>
  );
}

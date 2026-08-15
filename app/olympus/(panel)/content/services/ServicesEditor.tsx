"use client";

import { Check, EyeOff, Repeat } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import type { Service } from "@/payload-types";
import { readStringList } from "@/collections/fields/stringList";
import { cn } from "@/lib/utils";

import { saveService } from "../actions";
import {
  DetailDrawer,
  EditButton,
  EditModal,
  EditorShell,
  OpenDetail,
} from "../_components/EditorShell";
import { Area, DetailRow, Field, SelectField } from "../_components/Fields";
import { ListInput } from "../_components/ListInput";

/**
 * The six services as read-and-edit cards.
 *
 * Deliberately NOT the works or pricing layout: no add button, no delete
 * icons, no drag handles. The lineup is fixed, because `slug` chooses the
 * hand-drawn illustration, anchors every /services#… link, and pairs with an
 * icon name the code has to know. What is editable is everything an editor
 * would actually want to change — the copy, the prices, the timeline.
 *
 * EditorShell composes down to this cleanly: AddButton is the only thing that
 * calls `edit(null)`, so leaving it out means `isCreating` is never true and
 * the modal never offers to create.
 */

const money = (n?: number | null) =>
  typeof n === "number" ? n.toLocaleString() : "—";

function usdLabel(service: Service): string {
  return `$${money(service.amountUsd)}${service.billing === "monthly" ? "/mo" : ""}`;
}

function etbLabel(service: Service): string {
  return service.etbMode === "custom"
    ? "ETB custom"
    : `ETB ${money(service.amountEtb)}`;
}

export function ServicesEditor({ services }: { services: Service[] }) {
  return (
    <EditorShell<Service>>
      <section className="space-y-4">
        <p className="text-xs text-ink-muted">
          {services.length} services, in this order on the site. The order, the
          illustrations and the web addresses are fixed in code.
        </p>

        {services.length === 0 ? (
          <p className="rounded-[1.25rem] border border-dashed border-line px-4 py-10 text-center text-sm text-ink-muted">
            No services found. They are seeded from content/services.ts on boot.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.id}
                className="flex h-full flex-col rounded-[1.25rem] border border-line bg-panel p-4 transition-colors hover:border-line-strong"
              >
                <div className="mb-2 flex items-center gap-1">
                  <span className="min-w-0 flex-1 truncate font-display text-sm font-semibold text-ink">
                    {service.name}
                  </span>
                  <EditButton record={service} />
                </div>

                <OpenDetail record={service} className="flex-1">
                  <p className="text-lg font-semibold text-ink">
                    {usdLabel(service)}
                    <span className="text-sm font-normal text-ink-muted">
                      {" · "}
                      {etbLabel(service)}
                    </span>
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-ink-muted">
                    {service.summary}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {service.billing === "monthly" && (
                      <Chip icon={<Repeat className="size-3" />}>Retainer</Chip>
                    )}
                    <Chip>
                      {readStringList(service.deliverables).length} deliverables
                    </Chip>
                    {!service.showInFooter && (
                      <Chip icon={<EyeOff className="size-3" />} muted>
                        Not in footer
                      </Chip>
                    )}
                  </div>
                </OpenDetail>
              </article>
            ))}
          </div>
        )}
      </section>

      <DetailDrawer<Service>
        title={(s) => s.name}
        render={(s) => (
          <dl>
            <DetailRow label="Starting price" value={usdLabel(s)} />
            <DetailRow
              label="In Ethiopia"
              value={
                s.etbMode === "custom" ? "Quoted per client" : etbLabel(s)
              }
            />
            <DetailRow
              label="Billing"
              value={s.billing === "monthly" ? "Monthly retainer" : "Per project"}
            />
            <DetailRow label="Timeline" value={s.timeline} />
            <DetailRow label="Summary" value={s.summary} />
            <DetailRow label="Best for" value={s.forWhom} />
            <DetailRow label="Description" value={s.description} />
            <DetailRow
              label="What you get"
              value={
                <ul className="space-y-1">
                  {readStringList(s.deliverables).map((item) => (
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
              label="Tech stack"
              value={readStringList(s.techStack).join(", ")}
            />
            <DetailRow
              label="In footer"
              value={s.showInFooter ? "Listed" : "Not listed"}
            />
            <DetailRow label="Web address" value={`/services#${s.slug}`} />
          </dl>
        )}
      />

      <EditModal<Service>
        action={saveService}
        title={(s) => (s ? `Edit ${s.name}` : "Service")}
        description="Amounts are plain numbers. The site adds “From”, the currency and the separators."
        render={(s) => (
          <>
            <Field label="Name" name="name" defaultValue={s?.name} required />
            <Field
              label="Timeline"
              name="timeline"
              defaultValue={s?.timeline}
              placeholder="3 to 6 weeks"
              required
            />
            <Area
              label="Summary"
              name="summary"
              defaultValue={s?.summary}
              rows={2}
              hint="The one-liner on the home page tile and above the panel."
            />
            <Area
              label="Description"
              name="description"
              defaultValue={s?.description}
              rows={4}
            />
            <Area
              label="Best for"
              name="forWhom"
              defaultValue={s?.forWhom}
              rows={2}
            />
            <Field
              label="Starting price, USD"
              name="amountUsd"
              type="number"
              defaultValue={s?.amountUsd}
              required
              hint="Also the price in the search-engine structured data."
            />
            <SelectField
              label="Billing"
              name="billing"
              defaultValue={s?.billing ?? "project"}
              options={[
                { label: "Per project", value: "project" },
                { label: "Monthly retainer", value: "monthly" },
              ]}
              hint="A retainer prints the price as “/mo”."
            />
            <SelectField
              label="Ethiopian price"
              name="etbMode"
              defaultValue={s?.etbMode ?? "amount"}
              options={[
                { label: "Starting amount", value: "amount" },
                { label: "Custom, quoted per client", value: "custom" },
              ]}
              hint="Custom shows “Pricing: Custom” to visitors in Ethiopia."
            />
            <Field
              label="Starting price, ETB"
              name="amountEtb"
              type="number"
              defaultValue={s?.amountEtb}
              hint="Ignored when the Ethiopian price is custom."
            />
            <ListInput
              label="What you get"
              name="deliverables"
              defaultValues={readStringList(s?.deliverables)}
            />
            <ListInput
              label="Tech stack"
              name="techStack"
              defaultValues={readStringList(s?.techStack)}
            />
            <div className="sm:col-span-2">
              <Switch
                name="showInFooter"
                label="Show in footer"
                defaultChecked={s ? Boolean(s.showInFooter) : true}
                hint="Lists this service in the footer’s Services column."
              />
            </div>
          </>
        )}
      />
    </EditorShell>
  );
}

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

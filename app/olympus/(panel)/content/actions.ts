"use server";

import { updateTag } from "next/cache";

import { TAGS } from "@/lib/content";
import { requireUser } from "@/lib/auth";
import { getPayloadClient } from "@/lib/payload";

/**
 * Content mutations: create, update, delete, reorder.
 *
 * Cache invalidation happens HERE, in the server action, and never in a
 * Payload `afterChange` hook. Outside a server action there is no work store,
 * so it throws E263, and because an afterChange error propagates it would
 * abort the write itself. A hook would also fire during migrations and seed
 * scripts, where the same throw would break them.
 *
 * `updateTag`, not `revalidateTag(tag, "max")`. The latter is
 * stale-while-revalidate: measured here, the FIRST page load after a save
 * still served the old price and only the second showed the new one. For a CMS
 * that reads as "my save did not work". `updateTag` is Next's read-your-own-
 * writes primitive and is Server-Action-only, which is exactly where we are.
 */

export type Collection =
  | "team-members"
  | "projects"
  | "pricing-tiers"
  | "add-ons";

const TAG_FOR: Record<Collection, string> = {
  "team-members": TAGS.team,
  projects: TAGS.projects,
  "pricing-tiers": TAGS.pricing,
  "add-ons": TAGS.pricing,
};

const LABEL_FOR: Record<Collection, string> = {
  "team-members": "team member",
  projects: "project",
  "pricing-tiers": "tier",
  "add-ons": "add-on",
};

export interface ActionResult {
  ok: boolean;
  error?: string;
}

// --- Field coercion ---------------------------------------------------------

/** Empty input becomes null, not 0. "" and "0" are very different prices. */
function num(value: FormDataEntryValue | null): number | null {
  const raw = String(value ?? "").trim();
  if (raw === "") return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

function str(value: FormDataEntryValue | null): string {
  return String(value ?? "").trim();
}

/** Newline-joined hidden field from PillInput / ListInput. */
function list(value: FormDataEntryValue | null): { value: string }[] {
  return String(value ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((v) => ({ value: v }));
}

/**
 * Slug from a title, for newly created records.
 *
 * Only ever used on create. Changing a slug afterwards would break every
 * existing link to that project, so editing it is not offered at all.
 */
function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || `item-${Date.now()}`
  );
}

/** Appends -2, -3 … until the slug is free. */
async function uniqueSlug(
  collection: "projects" | "team-members",
  base: string,
): Promise<string> {
  const payload = await getPayloadClient();
  let candidate = base;
  for (let n = 2; n < 50; n++) {
    const existing = await payload.find({
      collection,
      where: { slug: { equals: candidate } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    if (existing.totalDocs === 0) return candidate;
    candidate = `${base}-${n}`;
  }
  return `${base}-${Date.now()}`;
}

// --- Generic write helpers --------------------------------------------------

async function write(
  collection: Collection,
  id: string | null,
  data: Record<string, unknown>,
): Promise<ActionResult> {
  await requireUser();
  try {
    const payload = await getPayloadClient();

    if (id) {
      await payload.update({
        collection,
        id,
        data,
        overrideAccess: true,
      } as never);
    } else {
      // New records go to the end of the list. The drag handle is how order is
      // changed, so a create never has to ask about position.
      const last = await payload.find({
        collection,
        sort: "-order",
        limit: 1,
        depth: 0,
        overrideAccess: true,
      });
      const highest =
        (last.docs[0] as { order?: number } | undefined)?.order ?? 0;

      await payload.create({
        collection,
        data: { ...data, order: highest + 10 },
        overrideAccess: true,
      } as never);
    }

    updateTag(TAG_FOR[collection]);
    return { ok: true };
  } catch (err) {
    console.error(`olympus: failed to save ${collection}`, err);
    return {
      ok: false,
      error: `Could not save this ${LABEL_FOR[collection]}. Please try again.`,
    };
  }
}

export async function deleteEntry(
  collection: Collection,
  id: string,
): Promise<ActionResult> {
  await requireUser();
  try {
    const payload = await getPayloadClient();
    await payload.delete({ collection, id, overrideAccess: true } as never);
    updateTag(TAG_FOR[collection]);
    return { ok: true };
  } catch (err) {
    console.error(`olympus: failed to delete ${collection}/${id}`, err);
    return {
      ok: false,
      error: `Could not delete this ${LABEL_FOR[collection]}.`,
    };
  }
}

/**
 * Persists a drag-and-drop reorder.
 *
 * Takes the ids in their new visual order and rewrites `order` as 10, 20, 30…
 * Renumbering the whole list rather than patching one row keeps the values
 * evenly spaced and free of ties, so the next drag has somewhere to land and
 * the sequence never silently depends on insertion order.
 */
export async function reorderEntries(
  collection: Collection,
  ids: string[],
): Promise<ActionResult> {
  await requireUser();
  try {
    const payload = await getPayloadClient();
    await Promise.all(
      ids.map((id, index) =>
        payload.update({
          collection,
          id,
          data: { order: (index + 1) * 10 },
          overrideAccess: true,
        } as never),
      ),
    );
    updateTag(TAG_FOR[collection]);
    return { ok: true };
  } catch (err) {
    console.error(`olympus: failed to reorder ${collection}`, err);
    return { ok: false, error: "Could not save the new order." };
  }
}

// --- Per-collection savers --------------------------------------------------

export async function saveTeamMember(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const id = str(formData.get("id")) || null;
  const name = str(formData.get("name"));

  return write("team-members", id, {
    name,
    role: str(formData.get("role")),
    bio: str(formData.get("bio")),
    photo: str(formData.get("photo")),
    expertise: list(formData.get("expertise")),
    founder: formData.get("founder") === "on",
    published: formData.get("published") === "on",
    ...(id ? {} : { slug: await uniqueSlug("team-members", slugify(name)) }),
  });
}

export async function saveProject(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const id = str(formData.get("id")) || null;
  const title = str(formData.get("title"));
  const client = str(formData.get("client"));

  return write("projects", id, {
    title,
    client,
    country: str(formData.get("country")),
    countryCode: str(formData.get("countryCode")).toUpperCase(),
    industry: str(formData.get("industry")),
    summary: str(formData.get("summary")),
    problem: str(formData.get("problem")),
    whatWeBuilt: str(formData.get("whatWeBuilt")),
    techStack: list(formData.get("techStack")),
    liveUrl: str(formData.get("liveUrl")) || null,
    logo: str(formData.get("logo")),
    coverImage: str(formData.get("coverImage")),
    testimonial: {
      quote: str(formData.get("testimonialQuote")) || null,
      name: str(formData.get("testimonialName")) || null,
      role: str(formData.get("testimonialRole")) || null,
    },
    featured: formData.get("featured") === "on",
    status: str(formData.get("status")) || "live",
    published: formData.get("published") === "on",
    ...(id
      ? {}
      : { slug: await uniqueSlug("projects", slugify(`${client}-${title}`)) }),
  });
}

export async function savePricingTier(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const id = str(formData.get("id")) || null;
  const mode = str(formData.get("mode")) || "from";

  return write("pricing-tiers", id, {
    name: str(formData.get("name")),
    bestFor: str(formData.get("bestFor")),
    includes: list(formData.get("includes")),
    mode,
    // Clear the amounts on a quote-only tier so a stale number cannot reappear
    // if it is later switched back.
    amountUsd: mode === "quote" ? null : num(formData.get("amountUsd")),
    amountEtb: mode === "quote" ? null : num(formData.get("amountEtb")),
    timeline: str(formData.get("timeline")),
    payment: str(formData.get("payment")),
    highlighted: formData.get("highlighted") === "on",
    published: formData.get("published") === "on",
  });
}

export async function saveAddOn(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const id = str(formData.get("id")) || null;

  return write("add-ons", id, {
    name: str(formData.get("name")),
    detail: str(formData.get("detail")),
    amountUsd: num(formData.get("amountUsd")) ?? 0,
    interval: str(formData.get("interval")) || "month",
    published: formData.get("published") === "on",
  });
}

export async function saveSiteSettings(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requireUser();
  try {
    const payload = await getPayloadClient();
    await payload.updateGlobal({
      slug: "site-settings",
      data: {
        email: str(formData.get("email")),
        phone: str(formData.get("phone")),
        phone2: str(formData.get("phone2")),
        whatsapp: str(formData.get("whatsapp")).replace(/\D/g, ""),
        telegram: str(formData.get("telegram")).replace(/^@/, ""),
        street: str(formData.get("street")),
        city: str(formData.get("city")),
        region: str(formData.get("region")),
        country: str(formData.get("country")),
        countryCode: str(formData.get("countryCode")).toUpperCase(),
        latitude: num(formData.get("latitude")) ?? 0,
        longitude: num(formData.get("longitude")) ?? 0,
        mapUrl: str(formData.get("mapUrl")),
      },
      overrideAccess: true,
    });
    updateTag(TAGS.site);
    return { ok: true };
  } catch (err) {
    console.error("olympus: failed to update site settings", err);
    return { ok: false, error: "Could not save. Please try again." };
  }
}

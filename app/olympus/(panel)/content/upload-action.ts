"use server";

import { requireUser } from "@/lib/auth";
import { getPayloadClient } from "@/lib/payload";

/**
 * Uploads one image and returns its public URL.
 *
 * Goes to Cloudflare R2 when R2_BUCKET is configured, and to `public/uploads`
 * otherwise, so the whole picker works in development without credentials.
 * Either way the caller only ever sees a URL, and the field it fills stores a
 * URL, so switching storage later changes nothing downstream.
 */

const MAX_BYTES = 8 * 1024 * 1024;

export interface UploadResult {
  ok: boolean;
  url?: string;
  error?: string;
}

export async function uploadImage(formData: FormData): Promise<UploadResult> {
  await requireUser();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "No file selected." };
  }

  if (!file.type.startsWith("image/")) {
    return { ok: false, error: "That is not an image." };
  }

  if (file.size > MAX_BYTES) {
    return { ok: false, error: "Images must be under 8 MB." };
  }

  try {
    const payload = await getPayloadClient();
    const doc = await payload.create({
      collection: "media",
      data: {
        // Required by the schema. The caller sets a real one on the record it
        // belongs to; this is a sane placeholder, not a shrug.
        alt: (formData.get("alt") as string) || file.name.replace(/\.[^.]+$/, ""),
      },
      file: {
        data: Buffer.from(await file.arrayBuffer()),
        mimetype: file.type,
        name: file.name,
        size: file.size,
      },
      overrideAccess: true,
    });

    /**
     * Resolve the public URL ourselves rather than trusting `doc.url`.
     *
     * With R2 configured, the s3Storage plugin's `generateFileURL` already
     * returns the cdn.doxaplc.com address, so `doc.url` is right.
     *
     * Without it, Payload falls back to LOCAL storage and hands back
     * `/api/media/file/<name>`, which is its own static handler living in
     * `app/(payload)/api/[...slug]` — a directory this project deliberately
     * never creates. That URL 404s. The file is actually written to
     * `public/uploads`, which Next serves at `/uploads/<name>`, so point there.
     */
    const usingR2 = Boolean(process.env.R2_BUCKET);
    const url = usingR2 ? doc.url : `/uploads/${doc.filename}`;

    if (!url) {
      return { ok: false, error: "Upload saved but returned no URL." };
    }

    return { ok: true, url };
  } catch (err) {
    console.error("olympus: image upload failed", err);
    return { ok: false, error: "Upload failed. Please try again." };
  }
}

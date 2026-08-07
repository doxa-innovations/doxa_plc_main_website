"use client";

import { useRef, useState, useTransition } from "react";
import { ImageOff, Loader2, Upload } from "lucide-react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { uploadImage } from "../upload-action";

/**
 * Image field: shows what is currently set, uploads a replacement.
 *
 * What is stored is still a URL, exactly as before, so nothing downstream
 * changes and images already hosted on the CDN keep working untouched. The
 * upload just fills that URL in rather than making someone find it themselves.
 *
 * Uploads go to R2 when it is configured and to local disk otherwise, so this
 * works in development with no credentials.
 */
export function ImageUpload({
  label,
  name,
  defaultValue,
  hint,
  aspect = "aspect-video",
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  hint?: string;
  aspect?: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [error, setError] = useState<string | null>(null);
  const [broken, setBroken] = useState(false);
  const [pending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  const onPick = (file: File) => {
    setError(null);
    const data = new FormData();
    data.set("file", file);
    data.set("alt", label);

    startTransition(async () => {
      const result = await uploadImage(data);
      if (result.ok && result.url) {
        setUrl(result.url);
        setBroken(false);
      } else {
        setError(result.error ?? "Upload failed.");
      }
    });
  };

  return (
    <div className="space-y-1.5 sm:col-span-2">
      <Label>{label}</Label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div
          className={cn(
            "relative w-full shrink-0 overflow-hidden rounded-lg border border-line bg-surface-nested sm:w-48",
            aspect,
          )}
        >
          {url && !broken ? (
            // Deliberately a plain <img>: the source is arbitrary at runtime
            // and next/image would need every future host in remotePatterns.
            <img
              src={url}
              alt=""
              className="size-full object-cover"
              onError={() => setBroken(true)}
            />
          ) : (
            <div className="grid size-full place-items-center text-ink-muted/50">
              <ImageOff className="size-6" strokeWidth={1.5} aria-hidden />
            </div>
          )}

          {pending && (
            <div className="absolute inset-0 grid place-items-center bg-deep/70 backdrop-blur-sm">
              <Loader2
                className="size-5 animate-spin text-brand"
                strokeWidth={2}
                aria-hidden
              />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onPick(file);
              // Reset so re-picking the same file still fires a change event.
              e.target.value = "";
            }}
          />

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-panel px-4 py-2 text-sm text-ink transition-colors hover:bg-panel-strong disabled:opacity-60 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <Upload className="size-4" strokeWidth={1.75} aria-hidden />
            {pending ? "Uploading…" : url ? "Replace image" : "Upload image"}
          </button>

          {/* The URL stays visible and editable: images already on the CDN are
              set this way, and seeing the value is how you spot a wrong one. */}
          <input
            type="url"
            name={name}
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setBroken(false);
            }}
            placeholder="https://cdn.doxaplc.com/…"
            className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-xs text-ink-muted outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          />

          {error && (
            <p role="alert" className="text-xs text-destructive">
              {error}
            </p>
          )}
          {broken && url && !error && (
            <p className="text-xs text-destructive">
              That URL did not load. Check it, or upload a replacement.
            </p>
          )}
          {hint && !error && (
            <p className="text-xs text-ink-muted/80">{hint}</p>
          )}
        </div>
      </div>
    </div>
  );
}

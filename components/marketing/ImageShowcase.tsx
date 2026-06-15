import Image from "next/image";
import { VideoEmbed } from "@/components/VideoEmbed";

/**
 * "A look inside Doxa": a full-width office walkthrough video on top, with two
 * photos sharing the row below. The photos pop on hover (hover-capable
 * pointers only). TODO: replace the video src and the two placeholder photos
 * with the client's real assets.
 */
const PHOTOS = [
  {
    src: "https://picsum.photos/seed/doxa-photo-1/1000/700",
    alt: "The Doxa team at work (placeholder)",
  },
  {
    src: "https://picsum.photos/seed/doxa-photo-2/1000/700",
    alt: "The Doxa office (placeholder)",
  },
];

function PhotoTile({ src, alt }: { src: string; alt: string }) {
  return (
    <figure className="group relative aspect-[16/10] overflow-hidden rounded-[1.4rem] border border-white/10 bg-surface-muted transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:z-10 hover:shadow-[0_50px_110px_-40px_rgba(124,60,180,0.95)] [@media(hover:hover)]:hover:scale-[1.04]">
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105"
      />
    </figure>
  );
}

export function ImageShowcase() {
  return (
    <div className="space-y-3">
      <VideoEmbed
        orientation="landscape"
        title="A walkthrough of our Bishoftu office"
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {PHOTOS.map((p) => (
          <PhotoTile key={p.src} src={p.src} alt={p.alt} />
        ))}
      </div>
    </div>
  );
}

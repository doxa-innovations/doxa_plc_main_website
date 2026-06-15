import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * A small gallery that "pops" each image on hover (scales up, raises z-index,
 * adds glow) so it reads as responsive without taking over the page. The
 * transform/z/shadow are GPU-cheap and the scale is gated to hover-capable
 * pointers (no accidental zoom on touch taps).
 *
 * TODO: replace the placeholder picsum images with the 3 real photos the
 * client will provide; the first ("primary") gets the large cell.
 */
const IMAGES = [
  {
    src: "https://picsum.photos/seed/doxa-primary/1280/960",
    alt: "Inside the Doxa studio (placeholder)",
    primary: true,
  },
  {
    src: "https://picsum.photos/seed/doxa-team/960/640",
    alt: "The Doxa team at work (placeholder)",
    primary: false,
  },
  {
    src: "https://picsum.photos/seed/doxa-work/960/640",
    alt: "A Doxa project in progress (placeholder)",
    primary: false,
  },
];

function Tile({
  src,
  alt,
  className,
  sizes,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes: string;
}) {
  return (
    <figure
      className={cn(
        "group relative overflow-hidden rounded-[1.4rem] border border-white/10 bg-surface-muted transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:z-10 hover:shadow-[0_50px_110px_-40px_rgba(124,60,180,0.95)] [@media(hover:hover)]:hover:scale-[1.06]",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        unoptimized
        className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deep/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </figure>
  );
}

export function ImageShowcase() {
  const [primary, ...rest] = IMAGES;
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Tile
        src={primary.src}
        alt={primary.alt}
        className="aspect-[4/3]"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
      <div className="grid gap-5">
        {rest.map((img) => (
          <Tile
            key={img.src}
            src={img.src}
            alt={img.alt}
            className="aspect-[16/9]"
            sizes="(max-width: 1024px) 100vw, 25vw"
          />
        ))}
      </div>
    </div>
  );
}

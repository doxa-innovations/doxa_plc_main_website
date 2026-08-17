import Image from "next/image";
import { Container } from "@/components/layout/Container";

const CDN = "https://cdn.doxaplc.com/doxa-public";

/**
 * Display height of a mark, in pixels — `h-9` below. The raster logos are
 * requested at 2x this and no larger.
 */
const LOGO_H = 36;
const LOGO_W = 160; // matches max-w-[160px]

/**
 * Real client/project marks, normalized to uniform white silhouettes for a
 * cohesive dark logo wall (the standard premium "trusted by" treatment).
 *
 * `vector` splits the list for a reason. The rasters go through next/image,
 * because the originals on the CDN are full-size PNGs — maor.png alone is
 * 252 KiB and classic_logo.png 208 KiB — and every one of them was being
 * shipped at full resolution to be drawn 36 pixels tall. That single wall
 * accounted for most of the "improve image delivery" saving PageSpeed
 * reports. next/image resizes and re-encodes them to WebP.
 *
 * The SVGs stay plain <img>: they are already resolution-independent, and
 * routing them through the optimizer would need `dangerouslyAllowSVG`, which
 * turns the image endpoint into a proxy for arbitrary SVG — not a trade worth
 * making for two files.
 */
const LOGOS = [
  { src: `${CDN}/kla.svg`, alt: "KLA Construction Equipment", vector: true },
  { src: `${CDN}/ZOA.svg`, alt: "ZOA International", vector: true },
  { src: `${CDN}/myseed.png`, alt: "MySeed", vector: false },
  { src: `${CDN}/classic_logo.png`, alt: "Classic Noodle", vector: false },
  { src: `${CDN}/Zoe.png`, alt: "Zoe Delivery", vector: false },
  { src: `${CDN}/yenetaMaster.png`, alt: "Yeneta Master", vector: false },
  { src: `${CDN}/lce.png`, alt: "Lutheran Church of Ethiopia", vector: false },
  { src: `${CDN}/maor.png`, alt: "Maor Lutheran Seminary", vector: false },
];

/** Auto-scrolling wall of real client logos; pauses on hover, motion-safe. */
export function ClientLogos() {
  const track = [...LOGOS, ...LOGOS];
  return (
    <section className="border-y border-line bg-deep py-12 light:bg-surface-muted">
      <Container>
        <p className="text-center text-sm text-ink-muted">
          Trusted by clients across the US, the Netherlands, and East Africa
        </p>
        <div className="group relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <ul className="flex w-max animate-marquee items-center gap-16 group-hover:[animation-play-state:paused] motion-reduce:animate-none">
            {track.map((logo, i) => (
              <li key={`${logo.alt}-${i}`} className="flex h-12 shrink-0 items-center">
                {logo.vector ? (
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    // The logos were authored for a dark band. On the light
                    // panel most keep their contrast, but the pure-white ones
                    // (KLA, ZOA) would disappear against a soft violet tint.
                    // Desaturating + darkening slightly in light mode
                    // normalises the wall — matches the grayscale logo strip
                    // pattern common on premium marketing sites (Stripe,
                    // Linear) and keeps the row visually calm.
                    className="h-9 w-auto max-w-[160px] object-contain light:opacity-80 light:brightness-50 light:contrast-125 light:grayscale hover:light:opacity-100 hover:light:grayscale-0"
                    loading="lazy"
                  />
                ) : (
                  // width/height set the aspect box next/image needs; the
                  // classes still drive layout, so a mark with a different
                  // ratio is letterboxed by object-contain rather than
                  // stretched. `sizes` keeps the requested variant at the
                  // size it is actually drawn.
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={LOGO_W}
                    height={LOGO_H}
                    sizes={`${LOGO_W}px`}
                    className="h-9 w-auto max-w-[160px] object-contain light:opacity-80 light:brightness-50 light:contrast-125 light:grayscale hover:light:opacity-100 hover:light:grayscale-0"
                    loading="lazy"
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

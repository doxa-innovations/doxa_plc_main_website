import { Container } from "@/components/layout/Container";

const CDN = "https://cdn.doxaplc.com/doxa-public";

// Real client/project marks, normalized to uniform white silhouettes for a
// cohesive dark logo wall (the standard premium "trusted by" treatment).
const LOGOS = [
  { src: `${CDN}/kla.svg`, alt: "KLA Construction Equipment" },
  { src: `${CDN}/ZOA.svg`, alt: "ZOA International" },
  { src: `${CDN}/myseed.png`, alt: "MySeed" },
  { src: `${CDN}/classic_logo.png`, alt: "Classic Noodle" },
  { src: `${CDN}/Zoe.png`, alt: "Zoe Delivery" },
  { src: `${CDN}/yenetaMaster.png`, alt: "Yeneta Master" },
  { src: `${CDN}/lce.png`, alt: "Lutheran Church of Ethiopia" },
  { src: `${CDN}/maor.png`, alt: "Maor Lutheran Seminary" },
];

/** Auto-scrolling wall of real client logos; pauses on hover, motion-safe. */
export function ClientLogos() {
  const track = [...LOGOS, ...LOGOS];
  return (
    <section className="border-y border-white/[0.06] bg-deep py-12">
      <Container>
        <p className="text-center text-sm text-ink-muted">
          Trusted by clients across the US, the Netherlands, and East Africa
        </p>
        <div className="group relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <ul className="flex w-max animate-marquee items-center gap-16 group-hover:[animation-play-state:paused] motion-reduce:animate-none">
            {track.map((logo, i) => (
              <li key={`${logo.alt}-${i}`} className="shrink-0">
                <div className="flex h-16 items-center justify-center rounded-2xl border border-white/10 bg-white/90 px-6 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.6)]">
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="h-8 w-auto max-w-[150px] object-contain"
                    loading="lazy"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

import { Container } from "@/components/layout/Container";

const CLIENTS = [
  "ZOA International",
  "KLA Construction Equipment",
  "Maor Lutheran Seminary",
  "MySeed",
  "Classic Noodle",
  "Zoe Delivery",
  "Scholten Pattern Works",
  "Yeneta Master",
];

/**
 * Scrolling strip of client names. Uses a duplicated track so the marquee
 * loops seamlessly; pauses on hover and respects reduced-motion.
 */
export function ClientLogos() {
  const track = [...CLIENTS, ...CLIENTS];
  return (
    <section className="border-y border-border bg-surface py-10">
      <Container>
        <p className="text-center text-sm font-medium text-ink/60">
          Trusted by clients from the US, Netherlands, and East Africa
        </p>
        <div className="group relative mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <ul className="flex w-max animate-marquee items-center gap-12 group-hover:[animation-play-state:paused] motion-reduce:animate-none">
            {track.map((name, i) => (
              <li
                key={`${name}-${i}`}
                className="whitespace-nowrap text-lg font-semibold tracking-tight text-ink/40"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

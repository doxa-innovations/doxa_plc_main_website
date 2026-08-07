// The world geometry this pulls in is ~350KB. It must never reach the client
// bundle, and `server-only` turns that from a convention into a build error.
import "server-only";
import DottedMap from "dotted-map";

/**
 * Dotted world map with delivery arcs running out of Bishoftu.
 *
 * The landmass comes from `dotted-map`, which samples real country geometry,
 * so the continents are accurate rather than hand-approximated. We take its
 * points and draw our own SVG around them instead of calling `getSVG()` —
 * that returns a finished picture with its own background, and we need the
 * arcs, the glow and the theme tokens layered in.
 *
 * See DESTINATIONS below for what the endpoints do and do not claim.
 *
 * Built once at module scope, not per request: sampling the grid against the
 * country polygons costs ~400ms, and the result never changes. The container
 * is a long-lived node server, so this is a one-off cost at boot.
 */
const map = new DottedMap({ height: 60, grid: "diagonal" });

const POINTS = map.getPoints();
const { width: W, height: H } = map.image;

const ORIGIN = map.getPin({ lat: 8.75, lng: 38.99 }); // Bishoftu

/**
 * One endpoint per inhabited continent, so the graphic reads as global reach.
 *
 * Note this is broader than content/projects.ts, which evidences the US, the
 * Netherlands and East Africa. Treat it as a reach illustration, not a client
 * list — the alt text describes the drawing rather than asserting a client in
 * each country, and no surrounding copy claims otherwise.
 */
const DESTINATIONS = [
  map.getPin({ lat: 40.7, lng: -74 }), // United States
  map.getPin({ lat: 52.1, lng: 5.3 }), // Netherlands
  map.getPin({ lat: 52.52, lng: 13.4 }), // Germany
  map.getPin({ lat: 1.35, lng: 103.82 }), // Singapore
  map.getPin({ lat: -23.55, lng: -46.63 }), // Brazil
  map.getPin({ lat: -33.87, lng: 151.21 }), // Australia
].filter((p): p is NonNullable<typeof p> => Boolean(p));

/** A quadratic arc that bows off the direct line, like a flight path. */
function arc(
  from: { x: number; y: number },
  to: { x: number; y: number },
): string {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const lift = Math.hypot(to.x - from.x, to.y - from.y) * 0.26;
  return `M ${from.x} ${from.y} Q ${mx} ${my - lift} ${to.x} ${to.y}`;
}

export function ReachMap({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      aria-label="World map with connection lines radiating from Bishoftu, Ethiopia to points in North America, South America, Europe, Asia and Australia"
      viewBox={`-2 -2 ${W + 4} ${H + 4}`}
      className={className}
    >
      <defs>
        <radialGradient id="reach-halo">
          <stop offset="0%" stopColor="#c69bff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#c69bff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="reach-arc" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#b277d3" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#c69bff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#b277d3" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* Landmass. `--mark` rather than `--grid-strong`: at 0.2 alpha the
          continents barely registered against the deep canvas. */}
      <g fill="var(--mark)">
        {POINTS.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={0.34} />
        ))}
      </g>

      {ORIGIN && (
        <>
          {/* Routes. The dashed overlay is what reads as "flowing". */}
          {DESTINATIONS.map((dest, i) => {
            const d = arc(ORIGIN, dest);
            return (
              <g key={i}>
                <path
                  d={d}
                  fill="none"
                  stroke="url(#reach-arc)"
                  strokeWidth={0.26}
                  strokeLinecap="round"
                />
                <path
                  className="reach-flow"
                  d={d}
                  fill="none"
                  stroke="#e0c3ff"
                  strokeWidth={0.36}
                  strokeLinecap="round"
                  strokeDasharray="1.6 30"
                  // Offset per route, or six pulses leave in lockstep and the
                  // map reads as one blinking object rather than live traffic.
                  style={{ animationDelay: `${i * 0.55}s` }}
                />
                <circle cx={dest.x} cy={dest.y} r={0.7} fill="var(--mark)" />
                <circle
                  cx={dest.x}
                  cy={dest.y}
                  r={1.5}
                  fill="none"
                  stroke="var(--mark)"
                  strokeOpacity={0.45}
                  strokeWidth={0.16}
                />
              </g>
            );
          })}

          {/* Origin */}
          <circle cx={ORIGIN.x} cy={ORIGIN.y} r={7} fill="url(#reach-halo)" />
          <circle
            className="reach-pulse-sm"
            cx={ORIGIN.x}
            cy={ORIGIN.y}
            r={1.6}
            fill="none"
            stroke="#c69bff"
            strokeWidth={0.18}
          />
          <circle cx={ORIGIN.x} cy={ORIGIN.y} r={0.95} fill="#e0c3ff" />
        </>
      )}
    </svg>
  );
}

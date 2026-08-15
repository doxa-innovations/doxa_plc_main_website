/**
 * Vector art for each service, drawn rather than photographed.
 *
 * Every piece sits on the same dotted canvas at the same 400x260 viewBox and
 * uses only the theme tokens, so six different subjects still read as one
 * family — which a set of stock screenshots never did.
 *
 * Stroke-only, no fills beyond faint panel washes: at this size a filled
 * illustration turns into a dark smudge, and outlines keep the shapes legible
 * against the solid card behind them.
 */

const W = 400;
const H = 260;

/** Shared dotted ground + frame. */
function Canvas({ children }: { children: React.ReactNode }) {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${W} ${H}`}
      fill="none"
      className="h-full w-full"
    >
      <defs>
        <pattern
          id="svc-dots"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1" cy="1" r="1" fill="var(--grid-strong)" />
        </pattern>
        <linearGradient id="svc-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c69bff" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#c69bff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#svc-dots)" opacity="0.7" />
      {children}
    </svg>
  );
}

/** Browser chrome the website-ish pieces share. */
function Frame({
  x = 60,
  y = 40,
  w = 280,
  h = 170,
}: {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
}) {
  return (
    <>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="10"
        fill="var(--deep)"
        stroke="var(--line-strong)"
      />
      <path
        d={`M${x} ${y + 22} H${x + w}`}
        stroke="var(--line-strong)"
      />
      <circle cx={x + 14} cy={y + 11} r="3" fill="var(--mark)" />
      <circle cx={x + 26} cy={y + 11} r="3" fill="var(--grid-strong)" />
      <circle cx={x + 38} cy={y + 11} r="3" fill="var(--grid-strong)" />
    </>
  );
}

const stroke = { stroke: "var(--mark)", strokeWidth: 1.6 } as const;
const faint = { stroke: "var(--grid-strong)", strokeWidth: 1.4 } as const;

/** A page skeleton: hero block, heading rules, a three-up row. */
function WebsiteArt() {
  return (
    <Canvas>
      <Frame />
      <rect x="76" y="76" width="120" height="46" rx="4" fill="url(#svc-fade)" {...faint} />
      <path d="M76 136 H176" {...stroke} strokeLinecap="round" />
      <path d="M76 148 H150" {...faint} strokeLinecap="round" />
      <rect x="76" y="164" width="46" height="14" rx="7" {...stroke} />
      <rect x="212" y="76" width="112" height="102" rx="6" {...faint} />
      <path d="M224 150 l22 -22 18 18 16 -14 24 24" {...stroke} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="240" cy="102" r="9" {...stroke} />
      <path d="M76 194 H324" {...faint} strokeDasharray="3 5" />
    </Canvas>
  );
}

/** Storefront: product grid, a price tag, a cart badge, and a companion phone. */
function EcommerceArt() {
  return (
    <Canvas>
      <Frame x={44} y={40} w={252} h={170} />
      {/* cart pill */}
      <rect x="242" y="52" width="42" height="16" rx="8" {...stroke} />
      <circle cx="253" cy="60" r="2.5" fill="var(--mark)" />
      <path d="M258 60 h18" {...faint} strokeLinecap="round" />
      {/* product tiles */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={60 + i * 78} y="82" width="64" height="56" rx="6" {...faint} />
          <path
            d={`M${68 + i * 78} 126 l14 -16 12 12 10 -8 14 12`}
            {...stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d={`M${60 + i * 78} 148 h40`} {...faint} strokeLinecap="round" />
          <rect x={60 + i * 78} y="158" width="26" height="10" rx="5" {...stroke} />
        </g>
      ))}
      <path d="M60 186 H280" {...faint} strokeDasharray="3 5" />
      {/* companion app */}
      <rect x="312" y="86" width="52" height="94" rx="10" fill="var(--deep)" stroke="var(--line-strong)" />
      <path d="M330 94 h16" {...faint} strokeLinecap="round" />
      <rect x="320" y="104" width="36" height="30" rx="4" {...stroke} />
      <path d="M320 144 h36 M320 154 h24" {...faint} strokeLinecap="round" />
      <rect x="320" y="164" width="36" height="9" rx="4.5" {...stroke} />
    </Canvas>
  );
}

/** Internal tooling: a dashboard with a chart, KPI tiles and a data table. */
function CustomSoftwareArt() {
  return (
    <Canvas>
      <Frame x={50} y={36} w={300} h={182} />
      {/* sidebar */}
      <path d="M96 58 V218" {...faint} />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M62 ${76 + i * 20} h22`} {...(i === 0 ? stroke : faint)} strokeLinecap="round" />
      ))}
      {/* KPI row */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={110 + i * 78} y="70" width="66" height="34" rx="5" {...faint} />
          <path d={`M118 ${88} h22`} {...stroke} strokeLinecap="round" transform={`translate(${i * 78} 0)`} />
        </g>
      ))}
      {/* chart */}
      <rect x="110" y="116" width="144" height="86" rx="6" {...faint} />
      <path d="M120 186 l26 -28 22 16 24 -34 26 22" {...stroke} strokeLinecap="round" strokeLinejoin="round" />
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx={120 + i * 24} cy={186 - i * 6} r="2.5" fill="var(--mark)" />
      ))}
      {/* table */}
      <rect x="266" y="116" width="70" height="86" rx="6" {...faint} />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M276 ${132 + i * 18} h50`} {...faint} strokeLinecap="round" />
      ))}
    </Canvas>
  );
}

/** Brand work: a pen-tool path with handles, mid-edit, plus swatches. */
function BrandingArt() {
  return (
    <Canvas>
      <rect x="60" y="40" width="280" height="170" rx="10" fill="var(--deep)" stroke="var(--line-strong)" />
      {/* the mark being drawn */}
      <path
        d="M150 160 C150 108, 200 96, 226 122 C250 146, 224 178, 196 168"
        {...stroke}
        strokeLinecap="round"
      />
      {/* bezier handles */}
      <g stroke="var(--grid-strong)" strokeWidth="1.2">
        <path d="M150 160 L128 132" />
        <path d="M226 122 L258 108" />
      </g>
      {[
        [150, 160],
        [226, 122],
        [196, 168],
      ].map(([cx, cy]) => (
        <rect key={`${cx}`} x={cx - 4} y={cy - 4} width="8" height="8" fill="var(--deep)" {...stroke} />
      ))}
      {[
        [128, 132],
        [258, 108],
      ].map(([cx, cy]) => (
        <circle key={`${cx}`} cx={cx} cy={cy} r="3.5" fill="var(--mark)" />
      ))}
      {/* cursor */}
      <path
        d="M262 150 l0 26 6 -7 5 10 5 -2 -5 -10 9 -1 z"
        fill="var(--deep)"
        {...stroke}
        strokeLinejoin="round"
      />
      {/* swatches */}
      {["#7851a9", "#b277d3", "#c69bff"].map((c, i) => (
        <rect key={c} x={78 + i * 22} y="182" width="16" height="16" rx="4" fill={c} opacity="0.9" />
      ))}
      <path d="M78 62 h64" {...faint} strokeLinecap="round" />
    </Canvas>
  );
}

/** A handset running a real-looking app. */
function MobileArt() {
  return (
    <Canvas>
      <rect x="152" y="26" width="96" height="200" rx="16" fill="var(--deep)" stroke="var(--line-strong)" />
      <rect x="182" y="34" width="36" height="6" rx="3" fill="var(--grid-strong)" />
      {/* header */}
      <path d="M164 60 h26" {...stroke} strokeLinecap="round" />
      <circle cx="236" cy="60" r="6" {...faint} />
      {/* feature card */}
      <rect x="164" y="74" width="72" height="44" rx="6" fill="url(#svc-fade)" {...faint} />
      <path d="M172 108 l14 -14 10 10 12 -10 16 14" {...stroke} strokeLinecap="round" strokeLinejoin="round" />
      {/* list rows */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x="164" y={128 + i * 26} width="18" height="18" rx="5" {...faint} />
          <path d={`M190 ${134 + i * 26} h46`} {...stroke} strokeLinecap="round" />
          <path d={`M190 ${142 + i * 26} h30`} {...faint} strokeLinecap="round" />
        </g>
      ))}
      {/* tab bar */}
      <path d="M152 204 H248" {...faint} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={176 + i * 24} cy="215" r="3.5" fill={i === 0 ? "var(--mark)" : "var(--grid-strong)"} />
      ))}
    </Canvas>
  );
}

/** The thing you are paying us to prevent: a 500, caught and being worked. */
function MaintenanceArt() {
  return (
    <Canvas>
      <Frame />
      <text
        x="200"
        y="120"
        textAnchor="middle"
        className="font-display"
        fontSize="46"
        fontWeight="600"
        fill="var(--mark)"
      >
        500
      </text>
      <text
        x="200"
        y="142"
        textAnchor="middle"
        fontSize="11"
        fill="var(--grid-strong)"
        letterSpacing="2"
      >
        SERVER ERROR
      </text>
      {/* status line: caught, and already being handled */}
      <path d="M96 168 H304" {...faint} strokeDasharray="3 5" />
      <circle cx="140" cy="186" r="9" {...stroke} />
      <path d="M136 186 l3 3 6 -7" {...stroke} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M158 186 h42" {...faint} strokeLinecap="round" />
      <circle cx="228" cy="186" r="9" {...stroke} />
      <path d="M228 181 v6 l4 3" {...stroke} strokeLinecap="round" />
      <path d="M246 186 h42" {...faint} strokeLinecap="round" />
    </Canvas>
  );
}

const ART: Record<string, () => React.ReactElement> = {
  "website-development": WebsiteArt,
  "e-commerce": EcommerceArt,
  "custom-software": CustomSoftwareArt,
  branding: BrandingArt,
  mobile: MobileArt,
  maintenance: MaintenanceArt,
};

export function ServiceArt({ slug }: { slug: string }) {
  const Art = ART[slug] ?? WebsiteArt;
  return <Art />;
}

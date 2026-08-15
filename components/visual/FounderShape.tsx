/**
 * The three hand-drawn polygons the previous doxaplc.com stood its founder
 * portraits on — a triangle, a pentagon and a lopsided hexagon, none of them
 * regular. They are the one device carried over from that site intact, so the
 * paths, the 10-unit stroke and the miter joins are reproduced exactly: the
 * triangle's acute corner clipping to a bevel at the default miter limit is
 * part of how the old shape looked, not a bug to round off.
 *
 * They used to be three files on the CDN. Inlined here instead, because each
 * path is under 300 bytes — a request per shape costs far more than the markup
 * it saves, it cannot arrive after the portrait it sits behind, and inlining is
 * what lets the fill read the brand tokens rather than a hex baked into a file
 * nobody would think to open.
 */
export type FounderShapeName = "triangle" | "pentagon" | "hexagon";

const PATHS: Record<FounderShapeName, { viewBox: string; d: string }> = {
  triangle: {
    viewBox: "0 0 252 252",
    d: "M181.745 241.53L10.2808 70.0656L244.505 7.30531L181.745 241.53Z",
  },
  pentagon: {
    viewBox: "0 0 285 279",
    d: "M134.363 272.171L6.76463 161.251L72.8256 5.62069L241.252 20.3561L279.285 185.093L134.363 272.171Z",
  },
  hexagon: {
    viewBox: "0 0 291 291",
    d: "M43.728 43.7282L183.04 6.39963L285.024 108.383L247.695 247.695L108.383 285.024L6.39943 183.04L43.728 43.7282Z",
  },
};

/**
 * Assignment order, indexed by position in the founders list. It cycles, so a
 * fourth founder starts the set again rather than rendering no shape at all.
 */
export const FOUNDER_SHAPES: FounderShapeName[] = [
  "triangle",
  "pentagon",
  "hexagon",
];

export function founderShapeAt(index: number): FounderShapeName {
  return FOUNDER_SHAPES[index % FOUNDER_SHAPES.length];
}

export function FounderShape({
  name,
  className,
}: {
  name: FounderShapeName;
  className?: string;
}) {
  const shape = PATHS[name];

  return (
    <svg
      viewBox={shape.viewBox}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      focusable="false"
    >
      <path
        d={shape.d}
        fill="var(--color-pj-secondary)"
        stroke="var(--color-pj-accent)"
        strokeWidth={10}
      />
    </svg>
  );
}

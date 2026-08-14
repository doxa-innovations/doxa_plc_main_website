import { ImageResponse } from "next/og";

/**
 * The iOS home-screen icon.
 *
 * app/icon.svg covers the browser tab, but iOS ignores SVG favicons: without
 * this, "Add to Home Screen" saves a screenshot of the page instead of a mark.
 * Generated rather than checked in as a PNG so the brand colours stay in one
 * place — these are the fixed values from CLAUDE.md.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#19003a",
          color: "#b277d3",
          fontSize: 116,
          fontWeight: 800,
          letterSpacing: "-0.05em",
        }}
      >
        D
      </div>
    ),
    { ...size },
  );
}

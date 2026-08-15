import { ImageResponse } from "next/og";
import { SITE } from "@/content/site";
import { OG_IMAGE } from "@/lib/metadata";

// Both read from the descriptor in lib/metadata.ts, which is what actually
// reaches the page as og:image. Declaring the size in two places is how the
// tag ends up promising dimensions the card does not have.
export const alt = OG_IMAGE.alt;
export const size = { width: OG_IMAGE.width, height: OG_IMAGE.height };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#19003a",
          color: "#ECECEC",
        }}
      >
        <div style={{ display: "flex", fontSize: 36, fontWeight: 700 }}>
          <span style={{ color: "#b277d3" }}>Doxa</span>
          <span style={{ marginLeft: 12 }}>Innovations</span>
        </div>
        <div
          style={{
            fontSize: 66,
            fontWeight: 800,
            marginTop: 28,
            lineHeight: 1.1,
            maxWidth: 900,
          }}
        >
          Your Software. Built Right. Delivered Affordably.
        </div>
        {/* The year comes from SITE, not a literal. It was hard-coded to 2017,
            which is the ETHIOPIAN-calendar year off the registration number —
            so the share card said 2017 while the hero said 2024 and the
            Organization schema emitted foundingDate 2024-12-01. */}
        {/* One interpolated string, not text plus an expression. Satori
            requires an explicit `display: flex` on any div with more than one
            child node and fails the BUILD, not the request, without it. */}
        <div style={{ fontSize: 28, marginTop: 32, opacity: 0.75 }}>
          {`Legally registered Ethiopian software company · Est. ${SITE.registration.foundingYear}`}
        </div>
      </div>
    ),
    { ...size },
  );
}

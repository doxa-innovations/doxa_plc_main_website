import { ImageResponse } from "next/og";

export const alt =
  "Doxa Innovations — Affordable Software Outsourcing from Ethiopia";
export const size = { width: 1200, height: 630 };
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
        <div style={{ fontSize: 28, marginTop: 32, opacity: 0.75 }}>
          Legally registered Ethiopian software company · Est. 2017
        </div>
      </div>
    ),
    { ...size },
  );
}

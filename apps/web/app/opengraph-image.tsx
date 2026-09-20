import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/seo";

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "linear-gradient(135deg, #fff7f2 0%, #ffffff 45%, #f8fafc 100%)",
        color: "#0f172a",
      }}
    >
      <div style={{ fontSize: 28, fontWeight: 600, color: "#ff6919" }}>{SITE_NAME}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 900 }}>
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.03em" }}>
          Travel discovery & trip planning
        </div>
        <div style={{ fontSize: 30, lineHeight: 1.35, color: "#475569" }}>{SITE_TAGLINE}</div>
      </div>
    </div>,
    { ...size },
  );
}

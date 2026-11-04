import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";
import { site } from "@/data/site";
import { octagram, toPath } from "@/lib/geometry";

export const alt = site.ogImageAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const stars = [0, 1, 2, 3].flatMap((row) => [0, 1, 2].map((column) => toPath(octagram(60 + column * 120, 60 + row * 120, 60))));
const mark = toPath(octagram(28, 28, 22));

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "linear-gradient(135deg, #0f2366 0%, #081227 55%, #060d1c 100%)",
          color: "#eef3fa",
        }}
      >
        <svg
          width="360"
          height="480"
          viewBox="0 0 360 480"
          style={{ position: "absolute", right: 64, top: 75, opacity: 0.5 }}
        >
          {stars.map((d, index) => (
            <path key={d} d={d} fill="none" stroke={index % 2 === 0 ? "#8db0ff" : "#f2b84b"} strokeWidth="2" strokeLinejoin="round" />
          ))}
        </svg>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "72px 80px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div
              style={{
                display: "flex",
                width: 64,
                height: 64,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 16,
                background: "#1e4fd8",
              }}
            >
              <svg width="40" height="40" viewBox="0 0 56 56">
                <path d={mark} fill="none" stroke="#ffffff" strokeWidth="4" strokeLinejoin="round" />
                <circle cx="28" cy="28" r="6" fill="#ffffff" />
              </svg>
            </div>
            <div style={{ display: "flex", fontSize: 28, color: "#bac5d7" }}>{profile.location}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 780 }}>
            <div style={{ display: "flex", fontSize: 88, fontWeight: 700, letterSpacing: "-3px", lineHeight: 1 }}>
              {profile.name}
            </div>
            <div style={{ display: "flex", marginTop: 28, fontSize: 34, lineHeight: 1.3, color: "#bac5d7" }}>
              {site.ogTagline}
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ display: "flex", width: 160, height: 8, borderRadius: 4, background: "#8db0ff" }} />
            <div style={{ display: "flex", width: 60, height: 8, borderRadius: 4, background: "#f2b84b" }} />
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

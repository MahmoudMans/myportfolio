import { ImageResponse } from "next/og";
import { consoleCopy } from "@/data/console";
import { profile } from "@/data/profile";
import { site } from "@/data/site";
import { OG, OG_SIZE, OgGrid, OgShield, ogFonts } from "@/lib/console/og";

export const alt = site.ogImageAlt;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: OG.bg,
          color: OG.fg,
          fontFamily: "Plex",
        }}
      >
        <OgGrid />
        <div
          style={{
            position: "absolute",
            right: -160,
            top: -120,
            width: 720,
            height: 720,
            display: "flex",
            background: "radial-gradient(circle, rgba(0,255,156,0.16), rgba(0,255,156,0) 65%)",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: "64px 76px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <OgShield />
            <div style={{ display: "flex", fontSize: 26, color: OG.dim }}>
              <span style={{ color: OG.accent }}>visitor@{consoleCopy.handle}:~$</span>
              <span style={{ marginLeft: 14 }}>whoami</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 92, fontWeight: 600, letterSpacing: "-4px", lineHeight: 1, color: "#ffffff" }}>{profile.name}</div>
            <div style={{ display: "flex", alignItems: "center", marginTop: 26, fontSize: 34, color: OG.accent }}>
              <span style={{ color: OG.faint, marginRight: 16 }}>&gt;</span>
              {consoleCopy.titles[0]}
              <div style={{ display: "flex", width: 20, height: 38, marginLeft: 8, background: OG.accent }} />
            </div>
            <div style={{ display: "flex", marginTop: 22, maxWidth: 900, fontSize: 28, lineHeight: 1.35, color: OG.dim }}>{site.ogTagline}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, paddingTop: 22, borderTop: `1px solid ${OG.line}`, fontSize: 22, color: OG.dim }}>
            <div style={{ display: "flex", width: 12, height: 12, borderRadius: 12, background: OG.accent }} />
            <span style={{ color: OG.fg }}>{profile.availability.label}</span>
            <span style={{ marginLeft: "auto" }}>{profile.location}</span>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: await ogFonts() },
  );
}

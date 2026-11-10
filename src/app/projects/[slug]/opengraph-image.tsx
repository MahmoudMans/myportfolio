import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { caseFiles } from "@/lib/console/content";
import { OG, OG_SIZE, OgGrid, OgShield, ogFonts } from "@/lib/console/og";

export const alt = `A project by ${profile.name}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectOpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const file = caseFiles.find((entry) => entry.slug === slug);
  const title = file?.title ?? profile.name;
  const kind = file?.kind ?? profile.headline;
  const stack = file?.tech.slice(0, 4) ?? [];
  const isPublic = file?.statusClass === "deployed";

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: OG.bg, color: OG.fg, fontFamily: "Plex" }}>
        <OgGrid />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: "64px 76px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <OgShield size={56} />
            <div style={{ display: "flex", fontSize: 24, color: OG.dim }}>CASE {file?.no ?? ""}</div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "6px 14px",
                border: `2px solid ${isPublic ? OG.accent : OG.dim}`,
                color: isPublic ? OG.accent : OG.dim,
                fontSize: 20,
                letterSpacing: "1px",
              }}
            >
              <div style={{ display: "flex", width: 10, height: 10, borderRadius: 10, background: isPublic ? OG.accent : OG.dim }} />
              {file?.status ?? ""}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 1000 }}>
            <div style={{ display: "flex", fontSize: 26, color: OG.amber }}>{kind}</div>
            <div style={{ display: "flex", marginTop: 16, fontSize: title.length > 18 ? 70 : 84, fontWeight: 600, letterSpacing: "-3px", lineHeight: 1.04, color: "#ffffff" }}>
              {title}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 30 }}>
              {stack.map((item) => (
                <div key={item} style={{ display: "flex", padding: "8px 18px", border: `1px solid ${OG.line}`, background: "rgba(0,255,156,0.04)", fontSize: 22, color: OG.dim }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", paddingTop: 22, borderTop: `1px solid ${OG.line}`, fontSize: 22, color: OG.dim }}>
            <span style={{ color: OG.accent }}>TLP:CLEAR</span>
            <span style={{ marginLeft: 18 }}>Case file by {profile.name}</span>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: await ogFonts() },
  );
}

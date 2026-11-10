import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG = {
  bg: "#05070a",
  fg: "#dce8e5",
  dim: "#94a5a3",
  faint: "#74847f",
  accent: "#00ff9c",
  amber: "#ffb020",
  line: "rgba(0, 255, 156, 0.16)",
};

export async function ogFonts() {
  const dir = join(process.cwd(), "src", "fonts");
  const [regular, semibold] = await Promise.all([
    readFile(join(dir, "ibm-plex-mono-regular.woff")),
    readFile(join(dir, "ibm-plex-mono-semibold.woff")),
  ]);
  return [
    { name: "Plex", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Plex", data: semibold, weight: 600 as const, style: "normal" as const },
  ];
}

export function OgGrid() {
  const vertical = Array.from({ length: 22 }, (_, index) => index * 56);
  const horizontal = Array.from({ length: 12 }, (_, index) => index * 56);
  return (
    <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", left: 0, top: 0 }}>
      {vertical.map((x) => (
        <line key={`v${x}`} x1={x} y1="0" x2={x} y2="630" stroke="rgba(0,255,156,0.06)" strokeWidth="1" />
      ))}
      {horizontal.map((y) => (
        <line key={`h${y}`} x1="0" y1={y} x2="1200" y2={y} stroke="rgba(0,255,156,0.06)" strokeWidth="1" />
      ))}
    </svg>
  );
}

export function OgShield({ size = 64 }: { size?: number }) {
  return (
    <div
      style={{
        display: "flex",
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
        border: `2px solid ${OG.accent}`,
        borderRadius: 6,
        background: "rgba(0,255,156,0.06)",
      }}
    >
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24">
        <path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z" fill="none" stroke={OG.accent} strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M9 12l2.2 2.2L15.2 10" fill="none" stroke={OG.accent} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

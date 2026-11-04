"use client";

import { FileCode, ShieldAlert } from "lucide-react";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import { useHydrated } from "@/components/ui/use-hydrated";
import { ui } from "@/data/ui";
import { cn } from "@/lib/utils";

const CLEAN_PAGES = ["/", "/projects", "/cv", "/posts"];

export function QuarantineWindow() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const missing = hydrated && pathname && pathname !== "/" ? pathname : "/missing-page";
  const rows = [
    { name: missing, label: ui.notFound.missing, verdict: "malicious" as const },
    ...CLEAN_PAGES.map((page) => ({ name: page, label: ui.notFound.clean, verdict: "clean" as const })),
  ];

  return (
    <div className="quarantine" aria-hidden="true">
      <div className="scan-window">
        <div className="scan-titlebar">
          <span className="scan-dots">
            <span />
            <span />
            <span />
          </span>
          <span className="scan-app">{ui.notFound.scanTitle}</span>
          <span className="scan-status">
            <span className="scan-status-dot" />
            {ui.notFound.scanStatus}
          </span>
        </div>
        <div className="scan-body">
          <div className="scan-files-wrap">
            <ul className="scan-files">
              {rows.map((row, index) => (
                <li key={row.name} className="scan-file-row" style={{ "--row": index } as CSSProperties}>
                  <span className={cn("scan-file", index === 0 && "scan-file-active")}>
                    <FileCode className="size-3.5 shrink-0 opacity-70" />
                    <span className="scan-file-name">{row.name}</span>
                    <span className={cn("scan-badge", `scan-badge-${row.verdict}`)}>{row.label}</span>
                  </span>
                </li>
              ))}
            </ul>
            <span className="scan-beam" />
          </div>
          <div className="scan-verdict scan-verdict-malicious quarantine-verdict">
            <ShieldAlert className="size-5" />
            <p className="scan-verdict-label">{ui.notFound.verdictLabel}</p>
            <p className="scan-verdict-name">{ui.notFound.verdictName}</p>
            <p className="scan-verdict-file">{missing}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Briefcase, FileCode, GraduationCap, ShieldAlert, ShieldCheck, Users, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Rosette } from "@/components/ui/rosette";
import type { HeroShowcase, ScanVerdict, ShowcaseChipIcon } from "@/types";
import { cn } from "@/lib/utils";

const chipIcons: Record<ShowcaseChipIcon, LucideIcon> = {
  work: Briefcase,
  study: GraduationCap,
  community: Users,
};

const verdictIcons: Record<ScanVerdict, LucideIcon> = {
  clean: ShieldCheck,
  suspicious: ShieldAlert,
  malicious: ShieldAlert,
};

const SCAN_MS = 1100;

export function HeroShowcaseArt({ showcase }: { showcase: HeroShowcase }) {
  const initial = Math.max(
    0,
    showcase.files.findIndex((file) => file.name === showcase.selectedFile),
  );
  const [selected, setSelected] = useState(initial);
  const [scanCount, setScanCount] = useState(0);
  const [scanning, setScanning] = useState(false);
  const timer = useRef<number | null>(null);
  const file = showcase.files[selected];
  const VerdictIcon = verdictIcons[file.verdict];

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  function pick(index: number) {
    setSelected(index);
    setScanCount((count) => count + 1);
    setScanning(true);
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setScanning(false);
      timer.current = null;
    }, SCAN_MS);
  }

  return (
    <figure className="showcase">
      <div className="showcase-stage">
        <Rosette className="showcase-rosette" />
        <div aria-hidden="true" className="showcase-glow" />
        <div className={cn("scan-window", scanCount > 0 && "scan-window-rescan")}>
          <div className="scan-titlebar" aria-hidden="true">
            <span className="scan-dots">
              <span />
              <span />
              <span />
            </span>
            <span className="scan-app">{showcase.appName}</span>
            <span className={cn("scan-status", scanning && "scan-status-busy")}>
              <span className="scan-status-dot" />
              {scanning ? showcase.scanningStatus : showcase.status}
            </span>
          </div>
          <div className="scan-body">
            <p className="scan-heading" id="scan-files-title">
              {showcase.listTitle}
            </p>
            <div className="scan-files-wrap">
              <ul className="scan-files" aria-labelledby="scan-files-title">
                {showcase.files.map((item, index) => (
                  <li key={item.name} className="scan-file-row" style={{ "--row": index } as CSSProperties}>
                    <button
                      type="button"
                      className={cn("scan-file", index === selected && "scan-file-active")}
                      aria-pressed={index === selected}
                      aria-label={`${showcase.scanLabel} ${item.name}`}
                      onClick={() => pick(index)}
                    >
                      <FileCode aria-hidden="true" className="size-3.5 shrink-0 opacity-70" />
                      <span className="scan-file-name">{item.name}</span>
                      <span className={cn("scan-badge", `scan-badge-${item.verdict}`)}>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <span key={`beam-${scanCount}`} className="scan-beam" aria-hidden="true" />
            </div>
            <div className="scan-grid" aria-hidden="true">
              <div className="scan-features">
                <p className="scan-heading">{showcase.featuresTitle}</p>
                {showcase.featureNames.map((name, index) => (
                  <div key={name} className="scan-feature">
                    <span>{name}</span>
                    <span className="scan-bar">
                      <span style={{ "--weight": `${file.weights[index] ?? 0}%` } as CSSProperties} />
                    </span>
                  </div>
                ))}
              </div>
              <div key={`verdict-${scanCount}`} className={cn("scan-verdict", `scan-verdict-${file.verdict}`)}>
                <VerdictIcon className="size-5" />
                <p className="scan-verdict-label">{showcase.verdictLabel}</p>
                <p className="scan-verdict-name">{file.result}</p>
                <p className="scan-verdict-file">{file.name}</p>
              </div>
            </div>
            <p className="sr-only" aria-live="polite">
              {`${file.name}: ${file.result}`}
            </p>
          </div>
        </div>
      </div>
      <ul className="fact-strip" aria-label={showcase.chipsLabel}>
        {showcase.chips.map((chip) => {
          const Icon = chipIcons[chip.icon];
          return (
            <li key={chip.value} className="fact-strip-item">
              <Icon aria-hidden="true" className={cn("fact-strip-icon size-4", chip.icon === "community" && "fact-strip-icon-olive")} />
              <span className="fact-strip-value">{chip.value}</span>
              <span className="fact-strip-label">{chip.label}</span>
            </li>
          );
        })}
      </ul>
      <figcaption className="showcase-caption">
        {showcase.caption}{" "}
        <Link href={`/projects/${showcase.projectSlug}`} className="text-link font-semibold">
          {showcase.linkLabel}
        </Link>
      </figcaption>
    </figure>
  );
}

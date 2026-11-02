import { Briefcase, FileCode, GraduationCap, ShieldAlert, Users, type LucideIcon } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { HeroShowcase, ShowcaseChipIcon } from "@/types";
import { cn } from "@/lib/utils";

const chipIcons: Record<ShowcaseChipIcon, LucideIcon> = {
  work: Briefcase,
  study: GraduationCap,
  community: Users,
};

export function HeroShowcaseArt({ showcase }: { showcase: HeroShowcase }) {
  return (
    <figure className="showcase">
      <div className="showcase-stage">
        <div aria-hidden="true" className="showcase-glow" />
        <div className="scan-window" aria-hidden="true">
          <div className="scan-titlebar">
            <span className="scan-dots">
              <span />
              <span />
              <span />
            </span>
            <span className="scan-app">{showcase.appName}</span>
            <span className="scan-status">
              <span className="scan-status-dot" />
              {showcase.status}
            </span>
          </div>
          <div className="scan-body">
            <p className="scan-heading">{showcase.listTitle}</p>
            <ul className="scan-files">
              {showcase.files.map((file, index) => (
                <li key={file.name} className="scan-file" style={{ "--row": index } as CSSProperties}>
                  <FileCode className="size-3.5 shrink-0 opacity-70" />
                  <span className="scan-file-name">{file.name}</span>
                  <span className={cn("scan-badge", `scan-badge-${file.verdict}`)}>{file.label}</span>
                </li>
              ))}
              <li className="scan-beam" />
            </ul>
            <div className="scan-grid">
              <div className="scan-features">
                <p className="scan-heading">{showcase.featuresTitle}</p>
                {showcase.features.map((feature) => (
                  <div key={feature.name} className="scan-feature">
                    <span>{feature.name}</span>
                    <span className="scan-bar">
                      <span style={{ "--weight": `${feature.weight}%` } as CSSProperties} />
                    </span>
                  </div>
                ))}
              </div>
              <div className="scan-verdict">
                <ShieldAlert className="size-5" />
                <p className="scan-verdict-label">{showcase.verdictLabel}</p>
                <p className="scan-verdict-name">{showcase.verdictName}</p>
                <p className="scan-verdict-file">{showcase.verdictFile}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ul className="showcase-chips" aria-label={showcase.chipsLabel}>
        {showcase.chips.map((chip, index) => {
          const Icon = chipIcons[chip.icon];
          return (
            <li key={chip.value} className="float-chip" style={{ "--chip": index } as CSSProperties}>
              <span className={cn("float-chip-icon", chip.icon === "community" && "float-chip-icon-olive")}>
                <Icon aria-hidden="true" className="size-4" />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="float-chip-value">{chip.value}</span>
                <span className="float-chip-label">{chip.label}</span>
              </span>
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

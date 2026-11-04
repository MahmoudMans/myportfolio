import { GraduationCap, ShieldCheck, Sparkles, Target, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { now } from "@/data/now";
import { sections } from "@/data/sections";
import { ui } from "@/data/ui";
import type { NowIcon } from "@/types";
import { formatDate } from "@/lib/utils";

const nowIcons: Record<NowIcon, LucideIcon> = {
  working: ShieldCheck,
  studying: GraduationCap,
  interests: Sparkles,
  looking: Target,
};

export function NowSection() {
  return (
    <Section
      {...sections.now}
      band
      action={
        <p className="badge badge-success">
          <span className="status-dot status-dot-open" aria-hidden="true" />
          {ui.lastUpdated}{" "}
          <time dateTime={now.lastUpdated}>{formatDate(now.lastUpdated)}</time>
        </p>
      }
    >
      <Reveal>
        <ul className="cell-panel cell-panel-4">
          {now.items.map((item) => {
            const Icon = nowIcons[item.icon];
            return (
              <li key={item.label} className="cell">
                <h3 className="cell-label">
                  <Icon aria-hidden="true" className="size-4 shrink-0 text-saffron-ink" />
                  {item.label}
                </h3>
                <p className="cell-text">{item.text}</p>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </Section>
  );
}

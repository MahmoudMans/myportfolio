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
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {now.items.map((item, index) => {
          const Icon = nowIcons[item.icon];
          return (
            <li key={item.label}>
              <Reveal delay={index * 60} className="h-full">
                <article className="now-card">
                  <span className="tile-icon tile-icon-accent">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <h3 className="font-display text-sm font-bold text-ink">{item.label}</h3>
                  <p className="copy-sm -mt-1.5">{item.text}</p>
                </article>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

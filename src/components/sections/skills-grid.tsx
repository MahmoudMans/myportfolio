import { ChartLine, CodeXml, Database, Layers, Wrench, type LucideIcon } from "lucide-react";
import { LevelMeter } from "@/components/ui/level-meter";
import { Reveal } from "@/components/ui/reveal";
import type { SkillGroup, SkillGroupIcon } from "@/types";
import { cn } from "@/lib/utils";

const groupIcons: Record<SkillGroupIcon, LucideIcon> = {
  code: CodeXml,
  frameworks: Layers,
  data: ChartLine,
  database: Database,
  tools: Wrench,
};

export function SkillsGrid({ groups }: { groups: SkillGroup[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {groups.map((group, index) => {
        const Icon = groupIcons[group.icon];
        return (
          <Reveal key={group.id} delay={(index % 3) * 60} className={cn("h-full", index === 0 && "md:col-span-2")}>
            <div className="card card-pad h-full">
              <div className="mb-4 flex items-center gap-3">
                <span className="tile-icon tile-icon-accent">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <h3 className="font-display text-lg font-bold tracking-tight text-ink">{group.title}</h3>
              </div>
              <ul className="flex flex-wrap gap-2" aria-label={group.title}>
                {group.skills.map((skill) => (
                  <li key={skill.name} className="skill-chip">
                    <span>{skill.name}</span>
                    {skill.level ? <LevelMeter level={skill.level} /> : null}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}

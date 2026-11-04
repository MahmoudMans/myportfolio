import { ChartLine, CodeXml, Database, Layers, Wrench, type LucideIcon } from "lucide-react";
import { LevelMeter } from "@/components/ui/level-meter";
import { Reveal } from "@/components/ui/reveal";
import { StackChip } from "@/components/ui/stack-chip";
import { projects } from "@/data/projects";
import { countProjectsUsing } from "@/lib/stack";
import type { SkillGroup, SkillGroupIcon } from "@/types";

const groupIcons: Record<SkillGroupIcon, LucideIcon> = {
  code: CodeXml,
  frameworks: Layers,
  data: ChartLine,
  database: Database,
  tools: Wrench,
};

export function SkillsGrid({ groups }: { groups: SkillGroup[] }) {
  return (
    <Reveal>
      <div className="skill-rows">
        {groups.map((group) => {
          const Icon = groupIcons[group.icon];
          return (
            <div key={group.id} className="skill-row">
              <h3 className="skill-row-title">
                <Icon aria-hidden="true" className="size-[18px] shrink-0 text-saffron-ink" />
                {group.title}
              </h3>
              <ul className="flex flex-wrap gap-2" aria-label={group.title}>
                {group.skills.map((skill) =>
                  skill.level ? (
                    <li key={skill.name} className="skill-chip">
                      <span>{skill.name}</span>
                      <LevelMeter level={skill.level} />
                    </li>
                  ) : (
                    <li key={skill.name} className="flex">
                      <StackChip name={skill.name} count={countProjectsUsing(projects, skill.name)} />
                    </li>
                  ),
                )}
              </ul>
            </div>
          );
        })}
      </div>
    </Reveal>
  );
}

import { ui } from "@/data/ui";
import type { SkillLevel } from "@/types";
import { cn } from "@/lib/utils";

interface LevelMeterProps {
  level: SkillLevel;
  label?: string;
  className?: string;
}

const steps = [1, 2, 3, 4, 5] as const;

export function LevelMeter({ level, label, className }: LevelMeterProps) {
  const description = label ?? ui.skills.levels[level - 1];
  return (
    <span className={cn("inline-flex items-center", className)}>
      <span className="meter" aria-hidden="true">
        {steps.map((step) => (
          <span key={step} className={step <= level ? "meter-seg meter-seg-on" : "meter-seg"} />
        ))}
      </span>
      <span className="sr-only">
        {ui.skills.levelPrefix} {level} {ui.skills.of} 5, {description}
      </span>
    </span>
  );
}

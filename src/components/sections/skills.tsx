import { SkillsGrid } from "@/components/sections/skills-grid";
import { StackUsage } from "@/components/sections/stack-usage";
import { Section } from "@/components/ui/section";
import { sections } from "@/data/sections";
import { skillGroups } from "@/data/skills";

export function SkillsSection() {
  return (
    <Section {...sections.skills} rail>
      <StackUsage />
      <SkillsGrid groups={skillGroups} />
    </Section>
  );
}

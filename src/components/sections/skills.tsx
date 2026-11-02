import { SkillsGrid } from "@/components/sections/skills-grid";
import { Section } from "@/components/ui/section";
import { sections } from "@/data/sections";
import { skillGroups } from "@/data/skills";

export function SkillsSection() {
  return (
    <Section {...sections.skills}>
      <SkillsGrid groups={skillGroups} />
    </Section>
  );
}

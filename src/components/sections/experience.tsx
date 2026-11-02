import { ExperienceList } from "@/components/sections/experience-list";
import { Section } from "@/components/ui/section";
import { experience } from "@/data/experience";
import { sections } from "@/data/sections";

export function ExperienceSection() {
  return (
    <Section {...sections.experience}>
      <ExperienceList items={experience} />
    </Section>
  );
}

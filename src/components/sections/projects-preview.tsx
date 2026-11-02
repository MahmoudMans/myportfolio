import { ArrowRight } from "lucide-react";
import { ProjectCard } from "@/components/projects/project-card";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { projects } from "@/data/projects";
import { sections } from "@/data/sections";
import { ui } from "@/data/ui";
import { getFeaturedProjects } from "@/lib/projects";

function isWide(index: number, total: number): boolean {
  return index === 0 || (index === total - 1 && (total - 1) % 2 === 1);
}

export function ProjectsPreview() {
  const featured = getFeaturedProjects();
  return (
    <Section
      {...sections.projects}
      band
      action={
        <ButtonLink href="/projects" variant="secondary" icon={<ArrowRight aria-hidden="true" className="size-4" />}>
          {`${ui.projects.allProjects} (${projects.length})`}
        </ButtonLink>
      }
    >
      <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {featured.map((project, index) => (
          <li key={project.slug} className={isWide(index, featured.length) ? "md:col-span-2" : undefined}>
            <Reveal delay={index * 80} className="h-full">
              <ProjectCard project={project} wide={isWide(index, featured.length)} />
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}

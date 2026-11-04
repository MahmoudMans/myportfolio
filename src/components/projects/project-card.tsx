import { ArrowUpRight, BadgeCheck, CircleCheck, CirclePlay, Database, Layers, type LucideIcon } from "lucide-react";
import Image from "next/image";
import { ResourceLinks } from "@/components/ui/resource-links";
import { Spotlight } from "@/components/ui/spotlight";
import { TransitionLink } from "@/components/ui/transition-link";
import { TagList } from "@/components/ui/tags";
import { ui } from "@/data/ui";
import type { ProjectSummary } from "@/types";
import { cn } from "@/lib/utils";

const proofIcons: Record<string, LucideIcon> = {
  Scale: Layers,
  Tests: CircleCheck,
  Data: Database,
  Quality: BadgeCheck,
  Status: CirclePlay,
};

interface ProjectCardProps {
  project: ProjectSummary;
  headingLevel?: "h3" | "h2";
  wide?: boolean;
  flip?: boolean;
  eager?: boolean;
}

export function ProjectCard({ project, headingLevel = "h3", wide = false, flip = false, eager = false }: ProjectCardProps) {
  const Heading = headingLevel;
  return (
    <Spotlight className={cn("project-card", wide && "project-card-wide", wide && flip && "project-card-flip")}>
      <article className="project-card-body">
        <div className="project-cover" data-cover={project.slug}>
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            width={project.cover.width}
            height={project.cover.height}
            unoptimized
            loading={eager ? "eager" : "lazy"}
            className={cn("h-full w-full", project.cover.position === "contain" ? "object-contain p-4 sm:p-6" : "object-cover", project.cover.position === "top" && "object-top")}
          />
        </div>
        <div className={cn("flex flex-1 flex-col gap-3.5 p-5 sm:p-6", wide && "lg:p-9")}>
          <div className="project-card-head">
            <Heading className={cn("font-heading font-bold tracking-[-0.006em] text-ink", wide ? "text-2xl sm:text-3xl" : "text-xl")}>
              <TransitionLink href={`/projects/${project.slug}`} className="card-link" cover={project.slug}>
                {project.title}
              </TransitionLink>
            </Heading>
            <TagList items={project.tags} label={`${ui.projects.categories}, ${project.title}`} tone="accent" variant="inline" />
          </div>
          <p className={cn("text-ink-2", wide ? "copy" : "copy-sm")}>{project.summary}</p>
          {project.proof.length > 0 ? (
            <ul className="card-proof" aria-label={`${ui.projects.proof}, ${project.title}`}>
              {project.proof.map((fact) => {
                const Icon = proofIcons[fact.label] ?? CircleCheck;
                return (
                  <li key={fact.label}>
                    <Icon aria-hidden="true" className="card-proof-icon" />
                    <span>{fact.value}</span>
                  </li>
                );
              })}
            </ul>
          ) : null}
          <TagList items={project.stack} label={`${ui.projects.stack}, ${project.title}`} variant="inline" />
          <div className="relative z-10 mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
            {project.links.length > 0 ? (
              <ResourceLinks links={project.links} label={`${ui.projects.links}, ${project.title}`} context={project.title} />
            ) : null}
            <span className="case-study-cue ml-auto" aria-hidden="true">
              {ui.projects.details}
              <ArrowUpRight className="size-4" />
            </span>
          </div>
        </div>
      </article>
    </Spotlight>
  );
}

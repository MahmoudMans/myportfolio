import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ResourceLinks } from "@/components/ui/resource-links";
import { Spotlight } from "@/components/ui/spotlight";
import { TagList } from "@/components/ui/tags";
import { ui } from "@/data/ui";
import type { ProjectSummary } from "@/types";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: ProjectSummary;
  headingLevel?: "h3" | "h2";
  wide?: boolean;
  eager?: boolean;
}

export function ProjectCard({ project, headingLevel = "h3", wide = false, eager = false }: ProjectCardProps) {
  const Heading = headingLevel;
  return (
    <Spotlight className={cn("project-card", wide && "project-card-wide")}>
      <article className="project-card-body">
        <div className="project-cover">
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
        <div className={cn("flex flex-1 flex-col gap-4 p-5 sm:p-6", wide && "lg:p-8")}>
          <TagList items={project.tags} label={`${ui.projects.categories}, ${project.title}`} tone="accent" />
          <Heading className={cn("font-display font-bold tracking-tight text-ink", wide ? "text-2xl sm:text-3xl" : "text-xl")}>
            <Link href={`/projects/${project.slug}`} className="card-link">
              {project.title}
            </Link>
          </Heading>
          <p className={cn("text-ink-2", wide ? "copy" : "copy-sm")}>{project.summary}</p>
          <TagList items={project.stack} label={`${ui.projects.stack}, ${project.title}`} />
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

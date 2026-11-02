import { projects } from "@/data/projects";
import type { Project, ProjectSummary } from "@/types";

export function toSummary(project: Project): ProjectSummary {
  return {
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    tags: project.tags,
    stack: project.stack,
    cover: project.cover,
    links: project.links,
  };
}

export function getProjectSummaries(): ProjectSummary[] {
  return projects.map(toSummary);
}

export function getFeaturedProjects(): ProjectSummary[] {
  return projects.filter((project) => project.featured).map(toSummary);
}

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

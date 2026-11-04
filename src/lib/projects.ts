import { projects } from "@/data/projects";
import type { Project, ProjectFact, ProjectSummary } from "@/types";

const PROOF_ORDER = ["Scale", "Tests", "Data", "Quality", "Status"];

function proofFor(project: Project): ProjectFact[] {
  const facts = project.facts ?? [];
  return PROOF_ORDER.flatMap((label) => facts.filter((fact) => fact.label === label)).slice(0, 2);
}

export function toSummary(project: Project): ProjectSummary {
  return {
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    tags: project.tags,
    stack: project.stack,
    cover: project.cover,
    links: project.links,
    proof: proofFor(project),
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

export interface RelatedProject {
  project: ProjectSummary;
  shared: string[];
  sharedTags: string[];
}

function stackRarity(): Map<string, number> {
  const uses = new Map<string, number>();
  for (const item of projects.flatMap((entry) => entry.stack)) uses.set(item.toLowerCase(), (uses.get(item.toLowerCase()) ?? 0) + 1);
  return uses;
}

export function getRelatedProjects(project: Project, exclude: string[], count = 3): RelatedProject[] {
  const ownStack = new Set(project.stack.map((item) => item.toLowerCase()));
  const uses = stackRarity();
  const rarity = (item: string) => uses.get(item.toLowerCase()) ?? 0;
  return projects
    .map((other, index) => {
      const shared = other.stack.filter((item) => ownStack.has(item.toLowerCase())).sort((a, b) => rarity(a) - rarity(b));
      const sharedTags = other.tags.filter((tag) => project.tags.includes(tag));
      return { other, shared, sharedTags, index, score: shared.length + sharedTags.length * 2 };
    })
    .filter((entry) => entry.other.slug !== project.slug && exclude.includes(entry.other.slug) === false && entry.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, count)
    .map((entry) => ({ project: toSummary(entry.other), shared: entry.shared, sharedTags: entry.sharedTags }));
}

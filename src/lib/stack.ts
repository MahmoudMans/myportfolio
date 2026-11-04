import { ui } from "@/data/ui";

interface UsesStack {
  stack: string[];
}

export interface StackUse {
  name: string;
  count: number;
}

export function usesStack(project: UsesStack, name: string): boolean {
  const target = name.toLowerCase();
  return project.stack.some((item) => item.toLowerCase() === target);
}

export function countProjectsUsing(projects: UsesStack[], name: string): number {
  return projects.filter((project) => usesStack(project, name)).length;
}

export function stackUsage(projects: UsesStack[]): StackUse[] {
  const uses = new Map<string, StackUse>();
  for (const project of projects) {
    for (const item of project.stack) {
      const key = item.toLowerCase();
      const known = uses.get(key);
      if (known) known.count += 1;
      else uses.set(key, { name: item, count: 1 });
    }
  }
  return [...uses.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function canonicalStack(projects: UsesStack[], value: string | null): string | null {
  const target = value?.trim().toLowerCase() ?? "";
  if (target.length === 0) return null;
  for (const project of projects) {
    const match = project.stack.find((item) => item.toLowerCase() === target);
    if (match !== undefined) return match;
  }
  return null;
}

export function stackHref(name: string): string {
  return `/projects?stack=${encodeURIComponent(name)}`;
}

export function projectCountLabel(count: number): string {
  return `${count} ${count === 1 ? ui.skills.project : ui.skills.projects}`;
}

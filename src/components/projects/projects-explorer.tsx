"use client";

import { AnimatePresence, LayoutGroup, m } from "motion/react";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/projects/project-card";
import { ui } from "@/data/ui";
import type { ProjectSummary, ProjectTag } from "@/types";
import { canonicalStack, usesStack } from "@/lib/stack";
import { cn, normalize } from "@/lib/utils";

type Filter = ProjectTag | "All";

interface ProjectsExplorerProps {
  projects: ProjectSummary[];
  tags: ProjectTag[];
  stack?: string | null;
}

function matches(project: ProjectSummary, filter: Filter, terms: string[]): boolean {
  if (filter !== "All" && project.tags.includes(filter) === false) return false;
  if (terms.length === 0) return true;
  const haystack = normalize([project.title, project.summary, ...project.tags, ...project.stack].join(" "));
  return terms.every((term) => haystack.includes(term));
}

export function ProjectsExplorerFromUrl(props: Omit<ProjectsExplorerProps, "stack">) {
  const params = useSearchParams();
  return <ProjectsExplorer {...props} stack={canonicalStack(props.projects, params.get("stack"))} />;
}

export function ProjectsExplorer({ projects, tags, stack = null }: ProjectsExplorerProps) {
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const router = useRouter();

  const pool = useMemo(() => (stack === null ? projects : projects.filter((project) => usesStack(project, stack))), [projects, stack]);
  const terms = useMemo(() => normalize(query).split(/\s+/).filter((term) => term.length > 0), [query]);
  const visible = useMemo(() => pool.filter((project) => matches(project, filter, terms)), [pool, filter, terms]);
  const counts = useMemo(() => {
    const result = new Map<Filter, number>([["All", pool.length]]);
    for (const tag of tags) result.set(tag, pool.filter((project) => project.tags.includes(tag)).length);
    return result;
  }, [pool, tags]);

  const filters: Filter[] = ["All", ...tags];

  function reset() {
    setFilter("All");
    setQuery("");
    if (stack !== null) router.replace("/projects", { scroll: false });
  }

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div role="group" aria-label={ui.projects.filterLabel} className="flex flex-wrap gap-2">
            {filters.map((item) => {
              const selected = filter === item;
              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setFilter(item)}
                  className={cn("filter-chip", selected && "filter-chip-active")}
                >
                  {selected ? (
                    <m.span
                      layoutId="filter-highlight"
                      className="absolute inset-0 rounded-full bg-ink"
                      transition={{ type: "spring", stiffness: 480, damping: 38 }}
                    />
                  ) : null}
                  <span className="relative">{item === "All" ? ui.projects.all : item}</span>
                  <span className="relative tabular-nums opacity-70">{counts.get(item) ?? 0}</span>
                </button>
              );
            })}
          </div>
          {stack !== null ? (
            <Link href="/projects" scroll={false} className="stack-filter">
              <span>
                {ui.projects.stack} {stack}
              </span>
              <X aria-hidden="true" className="size-4" />
              <span className="sr-only">, {ui.projects.removeStack}</span>
            </Link>
          ) : null}
        </div>
        <div className="relative w-full lg:max-w-xs">
          <label htmlFor="project-search" className="sr-only">
            {ui.projects.searchLabel}
          </label>
          <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-3" />
          <input
            id="project-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={ui.projects.searchPlaceholder}
            autoComplete="off"
            className="field h-11 pl-10"
          />
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {visible.length} {ui.projects.shown}
      </p>

      <LayoutGroup>
        <m.ul layout className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((project, index) => (
              <m.li
                key={project.slug}
                layout
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.18 } }}
                transition={{ type: "spring", stiffness: 380, damping: 34 }}
                className="h-full"
              >
                <ProjectCard project={project} headingLevel="h2" eager={index < 3} />
              </m.li>
            ))}
          </AnimatePresence>
        </m.ul>
      </LayoutGroup>

      {visible.length === 0 ? (
        <div className="mt-8 rounded-[var(--radius-lg)] border border-dashed border-line-strong px-6 py-14 text-center">
          <p className="font-heading text-xl font-semibold text-ink">{ui.projects.emptyTitle}</p>
          <p className="copy mx-auto mt-2 max-w-[44ch]">{ui.projects.emptyBody}</p>
          <button type="button" onClick={reset} className="btn btn-secondary mt-6">
            <X aria-hidden="true" className="size-4" />
            <span>{ui.projects.clear}</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}

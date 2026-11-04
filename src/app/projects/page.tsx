import type { Metadata } from "next";
import { Suspense } from "react";
import { ProjectsExplorer, ProjectsExplorerFromUrl } from "@/components/projects/projects-explorer";
import { PageHeader } from "@/components/ui/section";
import { projectTags } from "@/data/projects";
import { pageCopy } from "@/data/sections";
import { pageMetadata } from "@/lib/metadata";
import { getProjectSummaries } from "@/lib/projects";

export const metadata: Metadata = pageMetadata({
  title: pageCopy.projects.title,
  description: pageCopy.projects.description,
  path: "/projects",
});

export default function ProjectsPage() {
  const summaries = getProjectSummaries();
  return (
    <>
      <PageHeader title={pageCopy.projects.title} intro={pageCopy.projects.intro} deep />
      <div className="page-shell py-12 pb-24 sm:py-16">
        <Suspense fallback={<ProjectsExplorer projects={summaries} tags={projectTags} />}>
          <ProjectsExplorerFromUrl projects={summaries} tags={projectTags} />
        </Suspense>
      </div>
    </>
  );
}

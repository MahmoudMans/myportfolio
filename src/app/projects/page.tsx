import type { Metadata } from "next";
import { ProjectsExplorer } from "@/components/projects/projects-explorer";
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
  return (
    <>
      <PageHeader title={pageCopy.projects.title} intro={pageCopy.projects.intro} />
      <div className="page-shell py-12 pb-24 sm:py-16">
        <ProjectsExplorer projects={getProjectSummaries()} tags={projectTags} />
      </div>
    </>
  );
}

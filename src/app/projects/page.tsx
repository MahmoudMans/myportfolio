import type { Metadata } from "next";
import { SectionHead } from "@/components/console/section-head";
import { CaseGrid } from "@/components/projects/case-grid";
import { consoleCopy } from "@/data/console";
import { pageCopy } from "@/data/sections";
import { caseFiles } from "@/lib/console/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: pageCopy.projects.title,
  description: pageCopy.projects.description,
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <section className="sec page-sec" id="all-projects" aria-labelledby="h-all-projects">
      <div className="wrap">
        <SectionHead copy={consoleCopy.pages.projects} headingId="h-all-projects" level={1} />
        <CaseGrid files={caseFiles} search />
      </div>
    </section>
  );
}

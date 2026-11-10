import Link from "next/link";
import { consoleCopy } from "@/data/console";
import { caseFiles } from "@/lib/console/content";
import { Icon } from "@/components/console/icon";
import { SectionHead } from "@/components/console/section-head";
import { CaseGrid } from "@/components/projects/case-grid";

export function CaseFilesSection() {
  const featured = caseFiles.filter((file) => file.featured);
  return (
    <section className="sec" id="projects" aria-labelledby="h-projects">
      <div className="wrap">
        <SectionHead copy={consoleCopy.sections.projects} headingId="h-projects" />
        <CaseGrid files={featured} />
        <p className="cases-more reveal">
          <Link className="btn" href="/projects">
            <Icon name="file" /> {consoleCopy.cases.allCases} <span className="dim">({caseFiles.length})</span>
          </Link>
        </p>
      </div>
    </section>
  );
}

import { Download } from "lucide-react";
import type { Metadata } from "next";
import { CertificationList } from "@/components/sections/certifications";
import { EducationList } from "@/components/sections/education-list";
import { ExperienceList } from "@/components/sections/experience-list";
import { LanguageList } from "@/components/sections/languages";
import { SkillsGrid } from "@/components/sections/skills-grid";
import { ButtonLink } from "@/components/ui/button-link";
import { PageHeader } from "@/components/ui/section";
import { Tabs } from "@/components/ui/tabs";
import { certifications } from "@/data/certifications";
import { education } from "@/data/education";
import { experience } from "@/data/experience";
import { pageCopy } from "@/data/sections";
import { site } from "@/data/site";
import { skillGroups } from "@/data/skills";
import { ui } from "@/data/ui";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: pageCopy.cv.title,
  description: pageCopy.cv.description,
  path: "/cv",
});

export default function CvPage() {
  const items = [
    {
      id: "education",
      label: ui.cv.education,
      content: (
        <>
          <h2 className="sr-only">{ui.cv.education}</h2>
          <EducationList items={education} />
        </>
      ),
    },
    {
      id: "experience",
      label: ui.cv.experience,
      content: (
        <>
          <h2 className="sr-only">{ui.cv.experience}</h2>
          <ExperienceList items={experience} />
        </>
      ),
    },
    {
      id: "certifications",
      label: ui.cv.certifications,
      content: (
        <>
          <h2 className="sr-only">{ui.cv.certifications}</h2>
          <CertificationList items={certifications} />
        </>
      ),
    },
    {
      id: "skills",
      label: ui.cv.skills,
      content: (
        <>
          <h2 className="sr-only">{ui.cv.skills}</h2>
          <SkillsGrid groups={skillGroups} />
        </>
      ),
    },
    {
      id: "languages",
      label: ui.cv.languages,
      content: (
        <>
          <h2 className="sr-only">{ui.cv.languages}</h2>
          <LanguageList />
        </>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title={pageCopy.cv.title}
        intro={pageCopy.cv.intro}
        actions={
          <ButtonLink href="/cv.pdf" download={site.cvFileName} icon={<Download aria-hidden="true" className="size-4" />}>
            {ui.cv.download}
          </ButtonLink>
        }
      />
      <div className="page-shell py-12 pb-24 sm:py-16">
        <Tabs label={ui.cv.tabsLabel} items={items} />
      </div>
    </>
  );
}

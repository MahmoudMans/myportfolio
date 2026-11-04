import { ArrowRight, Download } from "lucide-react";
import { EducationList } from "@/components/sections/education-list";
import { ButtonLink } from "@/components/ui/button-link";
import { Section } from "@/components/ui/section";
import { education } from "@/data/education";
import { sections } from "@/data/sections";
import { site } from "@/data/site";
import { ui } from "@/data/ui";

export function CvPreview() {
  return (
    <Section
      {...sections.cv}
      band
      rail
      action={
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/cv.pdf" download={site.cvFileName} icon={<Download aria-hidden="true" className="size-4" />}>
            {ui.cv.download}
          </ButtonLink>
          <ButtonLink href="/cv" variant="secondary" icon={<ArrowRight aria-hidden="true" className="size-4" />}>
            {ui.cv.open}
          </ButtonLink>
        </div>
      }
    >
      <EducationList items={education} />
    </Section>
  );
}

import { Download, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { PrintButton } from "@/components/cv/print-button";
import { GitHubIcon, LinkedInIcon } from "@/components/icons/brand-icons";
import { CertificationList } from "@/components/sections/certifications";
import { EducationList } from "@/components/sections/education-list";
import { ExperienceList } from "@/components/sections/experience-list";
import { ButtonLink } from "@/components/ui/button-link";
import { Khatam, MarkedName } from "@/components/ui/khatam";
import { LevelMeter } from "@/components/ui/level-meter";
import { PageHeader } from "@/components/ui/section";
import { TagList } from "@/components/ui/tags";
import { certifications } from "@/data/certifications";
import { education } from "@/data/education";
import { experience } from "@/data/experience";
import { languages } from "@/data/languages";
import { profile } from "@/data/profile";
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

function SheetTitle({ id, children }: { id: string; children: string }) {
  return (
    <h2 id={id} className="cv-section-title">
      <Khatam className="cv-section-mark" />
      {children}
    </h2>
  );
}

export default function CvPage() {
  const links = (["linkedin", "github"] as const).flatMap((kind) => profile.socials.filter((social) => social.kind === kind));

  return (
    <>
      <PageHeader
        title={pageCopy.cv.title}
        intro={pageCopy.cv.intro}
        actions={
          <>
            <ButtonLink href="/cv.pdf" download={site.cvFileName} icon={<Download aria-hidden="true" className="size-4" />}>
              {ui.cv.download}
            </ButtonLink>
            <PrintButton label={ui.cv.print} />
          </>
        }
      />
      <div className="page-shell cv-page">
        <article className="cv-sheet" aria-label={ui.cv.sheetLabel}>
          <header className="cv-sheet-head">
            <div className="min-w-0">
              <p className="cv-name">
                <MarkedName name={profile.name} />
              </p>
              <p className="cv-role">{profile.headline}</p>
            </div>
            <ul className="cv-contact" aria-label={ui.cv.contact}>
              <li>
                <MapPin aria-hidden="true" className="size-4 shrink-0" />
                <span>{profile.location}</span>
              </li>
              {links.map((link) => (
                <li key={link.kind}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="cv-contact-link">
                    {link.kind === "github" ? <GitHubIcon className="size-4 shrink-0" /> : <LinkedInIcon className="size-4 shrink-0" />}
                    <span>{link.handle}</span>
                    <span className="sr-only">
                      , {link.label} {ui.externalSuffix}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </header>

          <div className="cv-sheet-body">
            <div className="cv-main">
              <section aria-labelledby="cv-profile" className="cv-section">
                <SheetTitle id="cv-profile">{ui.cv.profile}</SheetTitle>
                <div className="space-y-3">
                  {profile.bio.slice(0, 2).map((paragraph) => (
                    <p key={paragraph} className="copy max-w-[68ch]">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
              <section aria-labelledby="cv-experience" className="cv-section">
                <SheetTitle id="cv-experience">{ui.cv.experience}</SheetTitle>
                <ExperienceList items={experience} />
              </section>
              <section aria-labelledby="cv-education" className="cv-section">
                <SheetTitle id="cv-education">{ui.cv.education}</SheetTitle>
                <EducationList items={education} />
              </section>
              <section aria-labelledby="cv-certifications" className="cv-section">
                <SheetTitle id="cv-certifications">{ui.cv.certifications}</SheetTitle>
                <CertificationList items={certifications} />
              </section>
            </div>

            <div className="cv-aside">
              <section aria-labelledby="cv-availability" className="cv-section">
                <SheetTitle id="cv-availability">{ui.cv.availability}</SheetTitle>
                <p className="flex items-start gap-2.5 font-display text-[0.9375rem] font-semibold leading-snug text-ink">
                  <span className="status-dot status-dot-open mt-1.5 shrink-0" aria-hidden="true" />
                  {profile.availability.detail}
                </p>
              </section>
              <section aria-labelledby="cv-skills" className="cv-section">
                <SheetTitle id="cv-skills">{ui.cv.skills}</SheetTitle>
                <div className="cv-skill-groups">
                  {skillGroups.map((group) => (
                    <div key={group.id}>
                      <h3 className="cv-skill-title">{group.title}</h3>
                      <TagList items={group.skills.map((skill) => skill.name)} label={group.title} variant="inline" className="mt-1" />
                    </div>
                  ))}
                </div>
              </section>
              <section aria-labelledby="cv-languages" className="cv-section">
                <SheetTitle id="cv-languages">{ui.cv.languages}</SheetTitle>
                <ul className="cv-languages">
                  {languages.map((language) => (
                    <li key={language.name}>
                      <span className="font-display font-bold text-ink">{language.name}</span>
                      <span className="cv-language-level">
                        {language.level}
                        <LevelMeter level={language.score} label={language.level} className="cv-meter" />
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}

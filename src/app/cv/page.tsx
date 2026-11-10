import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PrintButton } from "@/components/cv/print-button";
import { Icon } from "@/components/console/icon";
import { SectionHead } from "@/components/console/section-head";
import { certifications } from "@/data/certifications";
import { consoleCopy } from "@/data/console";
import { education } from "@/data/education";
import { experience } from "@/data/experience";
import { languages } from "@/data/languages";
import { profile } from "@/data/profile";
import { pageCopy } from "@/data/sections";
import { site } from "@/data/site";
import { skillGroups } from "@/data/skills";
import { ui } from "@/data/ui";
import { monthLabel } from "@/lib/console/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: pageCopy.cv.title,
  description: pageCopy.cv.description,
  path: "/cv",
});

function CvSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section className="cv-section" aria-labelledby={id}>
      <h2 className="cv-title" id={id}>
        <span aria-hidden="true">##</span> {title}
      </h2>
      {children}
    </section>
  );
}

export default function CvPage() {
  const copy = consoleCopy.cv;
  const links = (["linkedin", "github"] as const).flatMap((kind) => profile.socials.filter((social) => social.kind === kind));
  return (
    <section className="sec page-sec cv-page" id="cv" aria-labelledby="h-cv">
      <div className="wrap">
        <SectionHead copy={consoleCopy.pages.cv} headingId="h-cv" level={1}>
          <div className="cv-actions reveal">
            <a className="btn btn-primary" href="/cv.pdf" download={site.cvFileName}>
              <Icon name="download" /> {copy.download}
            </a>
            <PrintButton label={copy.print} />
          </div>
        </SectionHead>
        <article className="panel cv-sheet reveal" aria-label={ui.cv.sheetLabel}>
          <div className="panel-head cv-panel-head">
            <span>
              <Icon name="file" /> {copy.panel}
            </span>
            <span>{copy.pages}</span>
          </div>
          <header className="cv-head">
            <div>
              <p className="cv-name">{profile.name}</p>
              <p className="cv-role">{profile.headline}</p>
            </div>
            <ul className="cv-contact" aria-label={ui.cv.contact}>
              <li>
                <Icon name="pin" /> {profile.location}
              </li>
              {links.map((link) => (
                <li key={link.kind}>
                  <Icon name={link.kind === "github" ? "code" : "user"} />
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    {link.handle}
                  </a>
                </li>
              ))}
            </ul>
          </header>
          <div className="cv-body">
            <div className="cv-main">
              <CvSection id="cv-profile" title={ui.cv.profile}>
                {profile.bio.slice(0, 2).map((paragraph) => (
                  <p key={paragraph} className="cv-text">
                    {paragraph}
                  </p>
                ))}
              </CvSection>
              <CvSection id="cv-experience" title={ui.cv.experience}>
                <ol className="cv-list">
                  {experience.map((item) => (
                    <li key={item.id}>
                      <p className="cv-item-title">
                        {item.role}, <span>{item.organization}</span>
                      </p>
                      <p className="cv-item-meta">
                        {monthLabel(item.start)} to {item.end ? monthLabel(item.end) : ui.present}, {item.location}
                      </p>
                      {item.highlights && item.highlights.length > 0 ? (
                        <ul className="log-list">
                          {item.highlights.map((highlight) => (
                            <li key={highlight}>{highlight}</li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  ))}
                </ol>
              </CvSection>
              <CvSection id="cv-education" title={ui.cv.education}>
                <ol className="cv-list">
                  {education.map((item) => (
                    <li key={item.id}>
                      <p className="cv-item-title">
                        {item.degree}, <span>{item.institution}</span>
                      </p>
                      <p className="cv-item-meta">
                        {item.start} to {item.end}, {item.location}
                      </p>
                    </li>
                  ))}
                </ol>
              </CvSection>
              <CvSection id="cv-certifications" title={ui.cv.certifications}>
                <ol className="cv-list">
                  {certifications.map((item) => (
                    <li key={item.id}>
                      <p className="cv-item-title">
                        {item.name}, <span>{item.issuer}</span>
                      </p>
                      <p className="cv-item-meta">
                        {item.date ? monthLabel(item.date) : ui.certifications.noDate}, {item.kind}
                      </p>
                    </li>
                  ))}
                </ol>
              </CvSection>
            </div>
            <div className="cv-aside">
              <CvSection id="cv-availability" title={ui.cv.availability}>
                <p className="cv-status">
                  <i className="pulse" /> {profile.availability.detail}
                </p>
              </CvSection>
              <CvSection id="cv-skills" title={ui.cv.skills}>
                <div className="cv-skills">
                  {skillGroups.map((group) => (
                    <div key={group.id}>
                      <h3 className="cv-skill-title">{group.title}</h3>
                      <p className="cv-skill-list">{group.skills.map((skill) => skill.name).join(", ")}</p>
                    </div>
                  ))}
                </div>
              </CvSection>
              <CvSection id="cv-languages" title={ui.cv.languages}>
                <ul className="cv-languages">
                  {languages.map((language) => (
                    <li key={language.name}>
                      <span>{language.name}</span>
                      <span className="cv-level">
                        {language.level}
                        <span className="cv-meter" aria-hidden="true">
                          {"■".repeat(language.score)}
                          <span>{"□".repeat(5 - language.score)}</span>
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </CvSection>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

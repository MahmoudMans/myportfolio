import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Icon } from "@/components/console/icon";
import { Command } from "@/components/console/section-head";
import { CaseCard } from "@/components/projects/case-card";
import { Evidence } from "@/components/projects/evidence";
import { consoleCopy } from "@/data/console";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { ui } from "@/data/ui";
import { caseFiles } from "@/lib/console/content";
import { jsonLd, pageMetadata } from "@/lib/metadata";
import { getProject, getRelatedProjects } from "@/lib/projects";
import { countProjectsUsing } from "@/lib/stack";
import type { Project } from "@/types";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return projects.map((project) => ({ slug: project.slug }));
}

function shareImageFor(project: Project): { url: string; alt: string } {
  return { url: `/projects/${project.slug}/opengraph-image`, alt: `${project.title}, a project by ${profile.name}` };
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (project === undefined) return {};
  return pageMetadata({
    title: project.title,
    description: project.summary,
    path: `/projects/${project.slug}`,
    type: "article",
    tags: project.stack,
    image: shareImageFor(project),
  });
}

interface DossierSection {
  id: string;
  label: string;
  title: string;
  body: ReactNode;
}

function Prose({ paragraphs }: { paragraphs: string[] }) {
  return (
    <>
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </>
  );
}

function Findings({ items }: { items: string[] }) {
  return (
    <ul className="findings">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (project === undefined) notFound();

  const copy = consoleCopy.dossier;
  const file = caseFiles.find((entry) => entry.slug === project.slug) ?? caseFiles[0];
  const position = projects.findIndex((item) => item.slug === project.slug);
  const nextProject = projects[(position + 1) % projects.length];
  const related = getRelatedProjects(project, nextProject ? [nextProject.slug] : [])
    .map((entry) => caseFiles.find((candidate) => candidate.slug === entry.project.slug))
    .filter((entry): entry is (typeof caseFiles)[number] => entry !== undefined);
  const caseStudy = project.caseStudy;
  const facts = [{ label: ui.project.type, value: project.kind }, ...(project.facts ?? [])];
  const shareImage = shareImageFor(project);
  const structuredData = jsonLd({
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url: `${site.url}/projects/${project.slug}`,
    image: `${site.url}${shareImage.url}`,
    keywords: project.stack.join(", "),
    author: { "@type": "Person", name: profile.name, url: site.url },
  });

  let figureCount = 0;
  const nextFigure = () => {
    figureCount += 1;
    return figureCount;
  };

  const sections: DossierSection[] = [];
  if (caseStudy) {
    sections.push({ id: "problem", label: ui.project.nav.problem, title: ui.project.problem, body: <Prose paragraphs={caseStudy.problem} /> });
  } else {
    sections.push({ id: "about", label: ui.project.nav.about, title: ui.project.about, body: <Prose paragraphs={[project.description]} /> });
  }
  if (caseStudy?.approach) {
    sections.push({ id: "approach", label: ui.project.nav.approach, title: ui.project.approach, body: <Prose paragraphs={caseStudy.approach} /> });
  }
  if (caseStudy?.audience) {
    sections.push({
      id: "audience",
      label: ui.project.nav.audience,
      title: ui.project.audience,
      body: (
        <dl className="audience">
          {caseStudy.audience.map((item) => (
            <div key={item.name}>
              <dt>{item.name}</dt>
              <dd>{item.detail}</dd>
            </div>
          ))}
        </dl>
      ),
    });
  }
  sections.push({ id: "features", label: ui.project.nav.features, title: ui.project.features, body: <Findings items={project.features} /> });
  if (caseStudy) {
    sections.push({
      id: "engineering",
      label: ui.project.nav.engineering,
      title: ui.project.engineering,
      body: (
        <div className="highlights">
          {caseStudy.highlights.map((highlight) => (
            <section className="highlight" key={highlight.title}>
              <h3>{highlight.title}</h3>
              <Prose paragraphs={highlight.body} />
              {highlight.image ? <Evidence image={highlight.image} number={nextFigure()} framed={highlight.image.crop} /> : null}
            </section>
          ))}
        </div>
      ),
    });
  }
  if (project.gallery && project.gallery.length > 0) {
    const phones = project.gallery.every((image) => image.crop === false && image.height > image.width);
    sections.push({
      id: "screens",
      label: ui.project.nav.screens,
      title: ui.project.screens,
      body: (
        <ul className={`gallery${phones ? " gallery-phones" : ""}`}>
          {project.gallery.map((image) => (
            <li key={image.src}>
              <Evidence image={image} number={nextFigure()} framed={image.crop ?? true} />
            </li>
          ))}
        </ul>
      ),
    });
  }
  if (caseStudy) {
    sections.push({
      id: "built",
      label: ui.project.nav.howBuilt,
      title: ui.project.howBuilt,
      body: (
        <>
          <div className="table-frame">
            <table className="stack-table">
              <thead>
                <tr>
                  <th scope="col">{ui.project.layer}</th>
                  <th scope="col">{ui.project.technology}</th>
                </tr>
              </thead>
              <tbody>
                {caseStudy.stackRows.map((row) => (
                  <tr key={row.layer}>
                    <th scope="row">{row.layer}</th>
                    <td>{row.tech}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {caseStudy.diagram ? (
            <figure className="diagram-figure">
              <pre className="diagram" aria-hidden="true">
                {caseStudy.diagram.join("\n")}
              </pre>
              <figcaption>{ui.project.diagram}</figcaption>
            </figure>
          ) : null}
          {caseStudy.architecture ? <Evidence image={caseStudy.architecture} number={nextFigure()} /> : null}
        </>
      ),
    });
  }
  if (caseStudy?.testing) {
    sections.push({ id: "testing", label: ui.project.nav.testing, title: ui.project.testing, body: <Prose paragraphs={caseStudy.testing} /> });
  }
  if (caseStudy?.results) {
    sections.push({ id: "results", label: ui.project.nav.results, title: ui.project.results, body: <Findings items={caseStudy.results} /> });
  }
  if (caseStudy?.next) {
    sections.push({ id: "next-steps", label: ui.project.nav.nextSteps, title: ui.project.nextSteps, body: <Findings items={caseStudy.next} /> });
  }
  if (caseStudy?.learned) {
    sections.push({ id: "learned", label: ui.project.nav.learned, title: ui.project.learned, body: <Findings items={caseStudy.learned} /> });
  }
  sections.push({
    id: "stack",
    label: ui.project.nav.builtWith,
    title: ui.project.builtWith,
    body: (
      <ul className="chips stack-chips" aria-label={`${ui.project.builtWith}, ${project.title}`}>
        {project.stack.map((item) => {
          const count = countProjectsUsing(projects, item);
          return (
            <li key={item}>
              <Link className="chip chip-link" href={`/projects?stack=${encodeURIComponent(item)}`} title={`${count} ${copy.stackCount}`}>
                {item}
                {count > 1 ? <span>{count}</span> : null}
              </Link>
            </li>
          );
        })}
      </ul>
    ),
  });

  return (
    <article className="dossier">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
      <header className="dossier-head">
        <div className="wrap">
          <Command cmd={`cat ~/projects/${project.slug}.md`} />
          <Link className="back-link" href="/projects">
            <Icon name="back" /> {copy.back}
          </Link>
          <div className="dossier-card panel reveal">
            <div className="report-tlp">
              <b>{consoleCopy.report.tlp}</b>
              <span>{consoleCopy.report.tlpNote}</span>
            </div>
            <div className="dossier-title-block">
              <p className="dossier-meta">
                <span>CASE {file.no}</span>
                <span className={`status ${file.statusClass}`}>{file.status}</span>
                <span>{project.tags.join(", ").toLowerCase()}</span>
              </p>
              <h1 className="dossier-title glitch" data-text={project.title}>
                {project.title}
              </h1>
              <p className="dossier-summary">{project.summary}</p>
            </div>
            <dl className="dossier-facts">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label.toLowerCase()}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
            {project.links.length > 0 ? (
              <div className="dossier-links">
                {project.links.map((link) => (
                  <a key={link.href} className="btn" href={link.href} target="_blank" rel="noopener noreferrer">
                    <Icon name={link.kind === "github" ? "code" : "external"} /> {link.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <div className="wrap dossier-cover reveal">
        <Evidence image={{ ...project.cover, caption: undefined }} cover eager />
      </div>

      <div className="wrap dossier-body">
        {sections.length >= 4 ? (
          <nav className="toc" aria-label={copy.onThisPage}>
            <p>{copy.onThisPage}</p>
            <ol>
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} data-toc={section.id}>
                    <span>{index + 1}.0</span> {section.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        <div className="dossier-sections">
          {sections.map((section, index) => (
            <section key={section.id} id={section.id} className="dossier-sec" aria-labelledby={`${section.id}-heading`}>
              <h2 id={`${section.id}-heading`}>
                <span className="sec-no">{index + 1}.0</span> {section.title}
              </h2>
              <div className="dossier-prose">{section.body}</div>
            </section>
          ))}
        </div>
      </div>

      {related.length > 0 ? (
        <div className="wrap dossier-related">
          <header className="sec-head">
            <Command cmd={`grep -rl "${project.stack[0] ?? project.tags[0] ?? ""}" ~/projects`} />
            <h2 className="glitch" data-text={copy.related}>
              {copy.related}
            </h2>
            <p className="lede">{copy.relatedLede}</p>
          </header>
          <div className="cases">
            {related.map((entry, index) => (
              <CaseCard key={entry.slug} file={entry} delay={index * 80} />
            ))}
          </div>
        </div>
      ) : null}

      {nextProject && nextProject.slug !== project.slug ? (
        <div className="wrap">
          <Link className="next-case panel" href={`/projects/${nextProject.slug}`}>
            <span className="next-case-label">{copy.nextCase}</span>
            <span className="next-case-title">{nextProject.title}</span>
            <span className="next-case-summary">{nextProject.summary}</span>
            <span className="next-case-arrow" aria-hidden="true">
              <Icon name="next" />
            </span>
          </Link>
        </div>
      ) : null}
    </article>
  );
}

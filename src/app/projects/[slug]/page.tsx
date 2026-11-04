import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { CaseFigure } from "@/components/projects/case-figure";
import { RelatedProjects } from "@/components/projects/related-projects";
import { ScreenViewer } from "@/components/projects/screen-viewer";
import { SectionNav, type SectionNavItem } from "@/components/projects/section-nav";
import { Lattice } from "@/components/ui/lattice";
import { ResourceLinks } from "@/components/ui/resource-links";
import { StackChip } from "@/components/ui/stack-chip";
import { TagList } from "@/components/ui/tags";
import { TransitionLink } from "@/components/ui/transition-link";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { ui } from "@/data/ui";
import { jsonLd, pageMetadata } from "@/lib/metadata";
import { getProject, getRelatedProjects } from "@/lib/projects";
import { countProjectsUsing } from "@/lib/stack";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return projects.map((project) => ({ slug: project.slug }));
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

function shareImageFor(project: Project): { url: string; alt: string } {
  return { url: `/projects/${project.slug}/opengraph-image`, alt: `${project.title}, a project by ${profile.name}` };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (project === undefined) notFound();

  const position = projects.findIndex((item) => item.slug === project.slug);
  const nextProject = projects[(position + 1) % projects.length];
  const related = getRelatedProjects(project, nextProject ? [nextProject.slug] : []);
  const facts = [
    { label: ui.project.type, value: project.kind },
    ...(project.facts ?? []),
    { label: ui.project.stack, value: project.stack.join(", ") },
  ];
  const caseStudy = project.caseStudy;
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
  const candidates: Array<SectionNavItem | null> = [
    caseStudy ? { id: "problem", label: ui.project.nav.problem } : { id: "about", label: ui.project.nav.about },
    caseStudy?.approach ? { id: "approach", label: ui.project.nav.approach } : null,
    caseStudy?.audience ? { id: "audience", label: ui.project.nav.audience } : null,
    { id: "features", label: ui.project.nav.features },
    caseStudy ? { id: "engineering", label: ui.project.nav.engineering } : null,
    project.gallery && project.gallery.length > 0 ? { id: "screens", label: ui.project.nav.screens } : null,
    caseStudy ? { id: "built", label: ui.project.nav.howBuilt } : null,
    caseStudy?.testing ? { id: "testing", label: ui.project.nav.testing } : null,
    caseStudy?.results ? { id: "results", label: ui.project.nav.results } : null,
    caseStudy?.next ? { id: "next-steps", label: ui.project.nav.nextSteps } : null,
    caseStudy?.learned ? { id: "learned", label: ui.project.nav.learned } : null,
    { id: "stack", label: ui.project.nav.builtWith },
  ];
  const sections = candidates.filter((item): item is SectionNavItem => item !== null);
  const hasScreens =
    (project.gallery?.length ?? 0) > 0 ||
    caseStudy?.architecture !== undefined ||
    (caseStudy?.highlights.some((highlight) => highlight.image !== undefined) ?? false);

  return (
    <article className="pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
      <header className="page-header page-header-deep">
        <Lattice className="page-header-lattice" />
        <div className="page-shell page-header-cover-pad relative pt-10 sm:pt-14">
          <Link href="/projects" className="back-link">
            <ArrowLeft aria-hidden="true" className="size-4" />
            {ui.project.back}
          </Link>
          <TagList items={project.tags} label={`${ui.project.categories}, ${project.title}`} tone="accent" className="mt-8" />
          <h1 className="mt-4 font-heading text-[clamp(2.5rem,6.5vw,4.5rem)] font-extrabold leading-[1] tracking-[-0.012em] text-ink text-balance">
            {project.title}
          </h1>
          <p className="lead mt-5 max-w-[58ch]">{project.summary}</p>
          <dl
            className={cn(
              "mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-lg)] border border-line bg-line",
              facts.length >= 4 ? "sm:grid-cols-2 xl:grid-cols-4" : "sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]",
            )}
          >
            {facts.map((fact) => (
              <div key={fact.label} className="bg-surface p-5">
                <dt className="meta-label">{fact.label}</dt>
                <dd className="mt-1 font-display font-semibold leading-snug text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>
          {project.links.length > 0 ? (
            <ResourceLinks links={project.links} label={`${ui.projects.links}, ${project.title}`} context={project.title} className="mt-6" />
          ) : null}
        </div>
      </header>

      <div className="page-shell case-cover-wrap">
        <div className="case-cover" data-cover-dest={project.slug}>
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            width={project.cover.width}
            height={project.cover.height}
            unoptimized
            loading="eager"
            className={cn("h-full w-full", project.cover.position === "contain" ? "object-contain p-4 sm:p-6" : "object-cover", project.cover.position === "top" && "object-top")}
          />
        </div>
      </div>

      {sections.length >= 4 ? <SectionNav title={project.title} label={ui.project.onThisPage} items={sections} /> : null}

      <div className="page-shell mt-16 space-y-14 lg:mt-20 lg:space-y-20">
        {caseStudy ? (
          <ProjectBlock id="problem" title={ui.project.problem}>
            {caseStudy.problem.map((paragraph) => (
              <p key={paragraph} className="case-prose">
                {paragraph}
              </p>
            ))}
          </ProjectBlock>
        ) : (
          <ProjectBlock id="about" title={ui.project.about}>
            <p className="case-prose">{project.description}</p>
          </ProjectBlock>
        )}

        {caseStudy?.approach ? (
          <ProjectBlock id="approach" title={ui.project.approach}>
            {caseStudy.approach.map((paragraph) => (
              <p key={paragraph} className="case-prose">
                {paragraph}
              </p>
            ))}
          </ProjectBlock>
        ) : null}

        {caseStudy?.audience ? (
          <ProjectBlock id="audience" title={ui.project.audience}>
            <dl className="audience-list">
              {caseStudy.audience.map((item) => (
                <div key={item.name} className="audience-row">
                  <dt className="font-display font-bold text-ink">{item.name}</dt>
                  <dd className="text-ink-2">{item.detail}</dd>
                </div>
              ))}
            </dl>
          </ProjectBlock>
        ) : null}

        <ProjectBlock id="features" title={ui.project.features}>
          <ul className="check-list case-prose">
            {project.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </ProjectBlock>

        {caseStudy ? (
          <ProjectBlock id="engineering" title={ui.project.engineering}>
            <div className="space-y-12">
              {caseStudy.highlights.map((highlight) => (
                <section key={highlight.title} className="case-highlight">
                  <h3 className="font-heading text-xl font-bold leading-snug tracking-[-0.006em] text-ink sm:text-2xl">{highlight.title}</h3>
                  {highlight.body.map((paragraph) => (
                    <p key={paragraph} className="case-prose mt-3">
                      {paragraph}
                    </p>
                  ))}
                  {highlight.image ? <CaseFigure image={highlight.image} framed={highlight.image.crop} className="mt-6" /> : null}
                </section>
              ))}
            </div>
          </ProjectBlock>
        ) : null}

        {project.gallery && project.gallery.length > 0 ? (
          <ProjectBlock id="screens" title={ui.project.screens}>
            <ul
              className={cn(
                "grid gap-x-5 gap-y-8",
                project.gallery.every((image) => image.crop === false && image.height > image.width)
                  ? "grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1 sm:grid-cols-2",
              )}
            >
              {project.gallery.map((image) => (
                <li key={image.src}>
                  <CaseFigure image={image} framed={image.crop ?? true} />
                </li>
              ))}
            </ul>
          </ProjectBlock>
        ) : null}

        {caseStudy ? (
          <ProjectBlock id="built" title={ui.project.howBuilt}>
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
              <figure className="mt-8">
                <pre className="diagram-block" aria-hidden="true">
                  {caseStudy.diagram.join("\n")}
                </pre>
                <figcaption className="case-figcaption">{ui.project.diagram}</figcaption>
              </figure>
            ) : null}
            {caseStudy.architecture ? <CaseFigure image={caseStudy.architecture} className="mt-8" /> : null}
          </ProjectBlock>
        ) : null}

        {caseStudy?.testing ? (
          <ProjectBlock id="testing" title={ui.project.testing}>
            {caseStudy.testing.map((paragraph) => (
              <p key={paragraph} className="case-prose">
                {paragraph}
              </p>
            ))}
          </ProjectBlock>
        ) : null}

        {caseStudy?.results ? (
          <ProjectBlock id="results" title={ui.project.results}>
            <ul className="check-list case-prose">
              {caseStudy.results.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </ProjectBlock>
        ) : null}

        {caseStudy?.next ? (
          <ProjectBlock id="next-steps" title={ui.project.nextSteps}>
            <ul className="check-list case-prose">
              {caseStudy.next.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </ProjectBlock>
        ) : null}

        {caseStudy?.learned ? (
          <ProjectBlock id="learned" title={ui.project.learned}>
            <ul className="check-list case-prose">
              {caseStudy.learned.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </ProjectBlock>
        ) : null}

        <ProjectBlock id="stack" title={ui.project.builtWith}>
          <ul className="flex flex-wrap gap-2" aria-label={`${ui.project.builtWith}, ${project.title}`}>
            {project.stack.map((item) => (
              <li key={item} className="flex">
                <StackChip name={item} count={countProjectsUsing(projects, item)} minimum={2} />
              </li>
            ))}
          </ul>
        </ProjectBlock>
      </div>

      {related.length > 0 ? (
        <div className="page-shell mt-20 lg:mt-24">
          <RelatedProjects items={related} />
        </div>
      ) : null}

      {nextProject && nextProject.slug !== project.slug ? (
        <div className="page-shell mt-16 lg:mt-20">
          <TransitionLink href={`/projects/${nextProject.slug}`} className="next-card group" cover={nextProject.slug}>
            <Lattice className="next-card-lattice" />
            <span className="next-card-text">
              <span className="meta-label">{ui.project.next}</span>
              <span className="mt-2 flex items-center justify-between gap-4">
                <span className="font-heading text-3xl font-extrabold tracking-[-0.006em] text-ink sm:text-4xl">{nextProject.title}</span>
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-accent text-accent-ink transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowRight aria-hidden="true" className="size-5" />
                </span>
              </span>
              <span className="copy mt-2 block max-w-[60ch]">{nextProject.summary}</span>
            </span>
            <span className="next-card-media" aria-hidden="true" data-cover={nextProject.slug}>
              <Image
                src={nextProject.cover.src}
                alt=""
                width={nextProject.cover.width}
                height={nextProject.cover.height}
                unoptimized
                loading="lazy"
                className={cn("h-full w-full", nextProject.cover.position === "contain" ? "object-contain p-3" : "object-cover object-top")}
              />
            </span>
          </TransitionLink>
        </div>
      ) : null}
      {hasScreens ? <ScreenViewer key={project.slug} title={project.title} /> : null}
    </article>
  );
}

function ProjectBlock({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="case-block grid grid-cols-1 gap-x-12 gap-y-5 lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[17rem_minmax(0,1fr)]"
    >
      <h2 id={`${id}-heading`} className="font-heading text-2xl font-extrabold tracking-[-0.008em] text-ink">
        {title}
      </h2>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

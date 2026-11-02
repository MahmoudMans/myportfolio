import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { CaseFigure } from "@/components/projects/case-figure";
import { Lattice } from "@/components/ui/lattice";
import { ResourceLinks } from "@/components/ui/resource-links";
import { TagList } from "@/components/ui/tags";
import { projects } from "@/data/projects";
import { ui } from "@/data/ui";
import { pageMetadata } from "@/lib/metadata";
import { getProject } from "@/lib/projects";
import { cn } from "@/lib/utils";

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
  });
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (project === undefined) notFound();

  const position = projects.findIndex((item) => item.slug === project.slug);
  const nextProject = projects[(position + 1) % projects.length];
  const facts = [
    { label: ui.project.type, value: project.kind },
    ...(project.facts ?? []),
    { label: ui.project.stack, value: project.stack.join(", ") },
  ];
  const caseStudy = project.caseStudy;

  return (
    <article className="pb-24">
      <header className="page-header">
        <Lattice className="page-header-lattice" />
        <div className="page-shell relative pt-10 pb-12 sm:pt-14 sm:pb-14">
          <Link href="/projects" className="back-link">
            <ArrowLeft aria-hidden="true" className="size-4" />
            {ui.project.back}
          </Link>
          <TagList items={project.tags} label={`${ui.project.categories}, ${project.title}`} tone="accent" className="mt-8" />
          <h1 className="mt-4 font-display text-[clamp(2.5rem,6.5vw,4.5rem)] font-extrabold leading-[1] tracking-[-0.045em] text-ink text-balance">
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

      <div className="page-shell mt-12">
        <div className="case-cover">
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

      <div className="page-shell mt-16 space-y-14 lg:mt-20 lg:space-y-20">
        {caseStudy ? (
          <ProjectBlock title={ui.project.problem}>
            {caseStudy.problem.map((paragraph) => (
              <p key={paragraph} className="case-prose">
                {paragraph}
              </p>
            ))}
          </ProjectBlock>
        ) : (
          <ProjectBlock title={ui.project.about}>
            <p className="case-prose">{project.description}</p>
          </ProjectBlock>
        )}

        {caseStudy?.approach ? (
          <ProjectBlock title={ui.project.approach}>
            {caseStudy.approach.map((paragraph) => (
              <p key={paragraph} className="case-prose">
                {paragraph}
              </p>
            ))}
          </ProjectBlock>
        ) : null}

        {caseStudy?.audience ? (
          <ProjectBlock title={ui.project.audience}>
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

        <ProjectBlock title={ui.project.features}>
          <ul className="check-list case-prose">
            {project.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </ProjectBlock>

        {caseStudy ? (
          <ProjectBlock title={ui.project.engineering}>
            <div className="space-y-12">
              {caseStudy.highlights.map((highlight) => (
                <section key={highlight.title} className="case-highlight">
                  <h3 className="font-display text-xl font-bold leading-snug tracking-tight text-ink sm:text-2xl">{highlight.title}</h3>
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
          <ProjectBlock title={ui.project.screens}>
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
          <ProjectBlock title={ui.project.howBuilt}>
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
          <ProjectBlock title={ui.project.testing}>
            {caseStudy.testing.map((paragraph) => (
              <p key={paragraph} className="case-prose">
                {paragraph}
              </p>
            ))}
          </ProjectBlock>
        ) : null}

        {caseStudy?.results ? (
          <ProjectBlock title={ui.project.results}>
            <ul className="check-list case-prose">
              {caseStudy.results.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </ProjectBlock>
        ) : null}

        {caseStudy?.next ? (
          <ProjectBlock title={ui.project.nextSteps}>
            <ul className="check-list case-prose">
              {caseStudy.next.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </ProjectBlock>
        ) : null}

        {caseStudy?.learned ? (
          <ProjectBlock title={ui.project.learned}>
            <ul className="check-list case-prose">
              {caseStudy.learned.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </ProjectBlock>
        ) : null}

        <ProjectBlock title={ui.project.builtWith}>
          <ul className="flex flex-wrap gap-2" aria-label={`${ui.project.builtWith}, ${project.title}`}>
            {project.stack.map((item) => (
              <li key={item} className="skill-chip">
                {item}
              </li>
            ))}
          </ul>
        </ProjectBlock>
      </div>

      {nextProject && nextProject.slug !== project.slug ? (
        <div className="page-shell mt-24">
          <Link href={`/projects/${nextProject.slug}`} className="next-card group">
            <span className="meta-label">{ui.project.next}</span>
            <span className="mt-2 flex items-center justify-between gap-4">
              <span className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{nextProject.title}</span>
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-accent text-accent-ink transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight aria-hidden="true" className="size-5" />
              </span>
            </span>
            <span className="copy mt-2 block max-w-[60ch]">{nextProject.summary}</span>
          </Link>
        </div>
      ) : null}
    </article>
  );
}

function ProjectBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="grid grid-cols-1 gap-x-12 gap-y-5 lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[17rem_minmax(0,1fr)]">
      <h2 className="font-display text-2xl font-extrabold tracking-[-0.025em] text-ink">{title}</h2>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

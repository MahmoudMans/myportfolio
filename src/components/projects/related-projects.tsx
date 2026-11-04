import Image from "next/image";
import { TransitionLink } from "@/components/ui/transition-link";
import { ui } from "@/data/ui";
import type { RelatedProject } from "@/lib/projects";
import { cn } from "@/lib/utils";

export function RelatedProjects({ items }: { items: RelatedProject[] }) {
  if (items.length === 0) return null;
  return (
    <section className="related" aria-labelledby="related-heading">
      <h2 id="related-heading" className="font-heading text-2xl font-extrabold tracking-[-0.008em] text-ink">
        {ui.project.related}
      </h2>
      <p className="copy-sm mt-2 max-w-[60ch]">{ui.project.relatedIntro}</p>
      <ul className="related-list">
        {items.map(({ project, shared, sharedTags }) => (
          <li key={project.slug}>
            <article className="related-card">
              <div className="related-cover" data-cover={project.slug}>
                <Image
                  src={project.cover.src}
                  alt=""
                  width={project.cover.width}
                  height={project.cover.height}
                  unoptimized
                  loading="lazy"
                  className={cn("h-full w-full", project.cover.position === "contain" ? "object-contain p-3" : "object-cover object-top")}
                />
              </div>
              <div className="related-body">
                <h3 className="font-heading text-lg font-bold leading-snug tracking-[-0.006em] text-ink">
                  <TransitionLink href={`/projects/${project.slug}`} className="card-link" cover={project.slug}>
                    {project.title}
                  </TransitionLink>
                </h3>
                <p className="related-summary">{project.summary}</p>
                {shared.length > 0 ? (
                  <p className="related-shared">
                    {ui.project.alsoUses} {shared.slice(0, 3).join(", ")}
                  </p>
                ) : sharedTags.length > 0 ? (
                  <p className="related-shared">
                    {ui.project.sameArea} {sharedTags.join(", ")}
                  </p>
                ) : null}
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}

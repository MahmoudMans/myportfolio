import { Briefcase, Building2, FlaskConical, GraduationCap, HandHeart, Laptop, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { TagList } from "@/components/ui/tags";
import { ui } from "@/data/ui";
import type { Experience, ExperienceKind } from "@/types";
import { cn, formatRange } from "@/lib/utils";

const kindIcons: Record<ExperienceKind, LucideIcon> = {
  Internship: Briefcase,
  Job: Building2,
  Freelance: Laptop,
  Teaching: GraduationCap,
  Research: FlaskConical,
  Volunteer: HandHeart,
};

export function ExperienceList({ items }: { items: Experience[] }) {
  return (
    <ol className="xp-list">
      {items.map((item, index) => {
        const Icon = kindIcons[item.kind];
        const current = item.end === null;
        const detailed = Boolean(item.summary || item.highlights?.length || item.results?.length || item.tools?.length);
        return (
          <li key={item.id} className="xp-item">
            <span className={cn("xp-node", current && "xp-node-current")} aria-hidden="true">
              <Icon className="size-[18px]" />
            </span>
            <Reveal delay={Math.min(index, 4) * 40}>
              <article className={cn("xp-card", current && "xp-card-current")}>
                <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-bold leading-snug tracking-tight text-ink sm:text-xl">{item.role}</h3>
                    <p className="mt-0.5 text-[0.96875rem] font-semibold text-ink-2">
                      {item.organization}
                      <span className="font-normal text-ink-3">, {item.location}</span>
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
                    {current ? <span className="badge badge-success">{ui.experience.current}</span> : null}
                    <span className="badge badge-accent">{item.kind}</span>
                    <span className="badge badge-outline tabular-nums">{formatRange(item.start, item.end, ui.present)}</span>
                  </div>
                </header>
                {detailed ? (
                  <div className="mt-4">
                    {item.summary ? <p className="copy max-w-[70ch]">{item.summary}</p> : null}
                    {item.highlights?.length ? (
                      <ul className="check-list mt-4 max-w-[70ch]">
                        {item.highlights.map((highlight) => (
                          <li key={highlight}>{highlight}</li>
                        ))}
                      </ul>
                    ) : null}
                    {item.results?.length ? (
                      <div className="mt-6">
                        <h4 className="sr-only">{ui.experience.results}</h4>
                        <dl className="stat-row">
                          {item.results.map((result) => (
                            <div key={result.label} className="stat-chip">
                              <dt className="stat-label">{result.label}</dt>
                              <dd className="stat-value">{result.value}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    ) : null}
                    {item.tools?.length ? (
                      <TagList items={item.tools} label={`${ui.experience.tools}, ${item.organization}`} className="mt-5" />
                    ) : null}
                  </div>
                ) : null}
              </article>
            </Reveal>
          </li>
        );
      })}
    </ol>
  );
}

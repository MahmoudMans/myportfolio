import { Briefcase, Building2, FlaskConical, GraduationCap, HandHeart, Laptop, type LucideIcon } from "lucide-react";
import { Khatam } from "@/components/ui/khatam";
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
    <Reveal>
      <ol className="entry-list">
        {items.map((item) => {
          const Icon = kindIcons[item.kind];
          const current = item.end === null;
          const detailed = Boolean(item.summary || item.highlights?.length || item.results?.length || item.tools?.length);
          return (
            <li key={item.id} className={cn("entry", current && "entry-current")}>
              <p className="entry-when">
                <span>{formatRange(item.start, item.end, ui.present)}</span>
                {current ? (
                  <span className="entry-now">
                    <Khatam className="size-3.5" />
                    {ui.experience.current}
                  </span>
                ) : null}
              </p>
              <div className="entry-main">
                <h3 className="entry-title">{item.role}</h3>
                <p className="entry-sub">
                  {item.organization}
                  <span>, {item.location}</span>
                </p>
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
              </div>
              <p className="entry-aside">
                <Icon aria-hidden="true" className="size-4 shrink-0" />
                {item.kind}
              </p>
            </li>
          );
        })}
      </ol>
    </Reveal>
  );
}

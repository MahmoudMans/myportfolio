import { Award, BookOpen, GraduationCap } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { ui } from "@/data/ui";
import type { Education } from "@/types";

export function EducationList({ items }: { items: Education[] }) {
  return (
    <ol className="grid grid-cols-1 gap-5">
      {items.map((item) => (
        <li key={item.id}>
          <Reveal>
            <article className="card card-pad">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <span className="tile-icon tile-icon-accent tile-icon-lg">
                  <GraduationCap aria-hidden="true" className="size-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="font-display text-xl font-bold leading-snug tracking-tight text-ink sm:text-2xl">
                        {item.field ? `${item.degree}, ${item.field}` : item.degree}
                      </h3>
                      <p className="mt-1 text-[0.96875rem] font-semibold text-ink-2">
                        {item.institution}
                        <span className="font-normal text-ink-3">, {item.location}</span>
                      </p>
                    </div>
                    <span className="badge badge-outline w-fit shrink-0 tabular-nums">
                      {item.start} – {item.end}
                    </span>
                  </div>
                  {item.note ? <p className="copy mt-4 max-w-[70ch]">{item.note}</p> : null}
                  {item.gpa || item.honors?.length ? (
                    <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-[12rem_minmax(0,1fr)]">
                      {item.gpa ? (
                        <div className="stat-chip self-start">
                          <p className="stat-label">{ui.cv.gpa}</p>
                          <p className="stat-value text-[1.75rem]">{item.gpa}</p>
                        </div>
                      ) : null}
                      {item.honors?.length ? (
                        <div>
                          <p className="flex items-center gap-2 font-display text-sm font-bold text-ink">
                            <Award aria-hidden="true" className="size-4 text-accent" />
                            {ui.cv.honors}
                          </p>
                          <ul className="check-list mt-3">
                            {item.honors.map((honor) => (
                              <li key={honor}>{honor}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                  {item.courses?.length ? (
                    <div className="mt-6 border-t border-line pt-5">
                      <p className="flex items-center gap-2 font-display text-sm font-bold text-ink">
                        <BookOpen aria-hidden="true" className="size-4 text-accent" />
                        {ui.cv.courses}
                      </p>
                      <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={`${ui.cv.courses}, ${item.institution}`}>
                        {item.courses.map((course) => (
                          <li key={course} className="tag">
                            {course}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </div>
            </article>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}

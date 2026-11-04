import { Award, BookOpen } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { ui } from "@/data/ui";
import type { Education } from "@/types";

export function EducationList({ items }: { items: Education[] }) {
  return (
    <Reveal>
      <ol className="entry-list">
        {items.map((item) => (
          <li key={item.id} className="entry">
            <p className="entry-when">
              <span>
                {item.start} – {item.end}
              </span>
            </p>
            <div className="entry-main">
              <h3 className="entry-title entry-title-lg">{item.field ? `${item.degree}, ${item.field}` : item.degree}</h3>
              <p className="entry-sub">
                {item.institution}
                <span>, {item.location}</span>
              </p>
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
                <div className="mt-5">
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
          </li>
        ))}
      </ol>
    </Reveal>
  );
}

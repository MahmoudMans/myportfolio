import Link from "next/link";
import type { CSSProperties } from "react";
import { Reveal } from "@/components/ui/reveal";
import { projects } from "@/data/projects";
import { ui } from "@/data/ui";
import { projectCountLabel, stackHref, stackUsage } from "@/lib/stack";

export function StackUsage({ limit = 8 }: { limit?: number }) {
  const total = projects.length;
  const rows = stackUsage(projects).slice(0, limit);

  return (
    <section className="usage" aria-labelledby="usage-title">
      <div className="usage-head">
        <h3 id="usage-title" className="usage-title">
          {ui.skills.usageTitle}
        </h3>
        <p className="usage-note">
          {ui.skills.usageNoteBefore} {total} {ui.skills.usageNoteAfter}
        </p>
      </div>
      <Reveal>
        <ol className="usage-list">
          {rows.map((row, index) => (
            <li key={row.name}>
              <Link href={stackHref(row.name)} className="usage-row" style={{ "--i": index } as CSSProperties}>
                <span className="usage-name">{row.name}</span>
                <span className="usage-bar" aria-hidden="true">
                  <span className="usage-fill" style={{ "--share": row.count / total } as CSSProperties} />
                </span>
                <span className="usage-count">{projectCountLabel(row.count)}</span>
              </Link>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  );
}

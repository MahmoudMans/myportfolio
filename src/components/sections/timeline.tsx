import { TimelineTrack } from "@/components/timeline/timeline-track";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { sections } from "@/data/sections";
import { timeline } from "@/data/timeline";
import type { TimelineKind } from "@/types";
import { cn, formatYearMonth } from "@/lib/utils";

const kindClass: Record<TimelineKind, string> = {
  Education: "timeline-node-education",
  Work: "timeline-node-work",
  Research: "timeline-node-research",
  Community: "timeline-node-community",
  Milestone: "timeline-node-milestone",
};

const kindBadge: Record<TimelineKind, string> = {
  Education: "badge",
  Work: "badge badge-accent",
  Research: "badge badge-accent",
  Community: "badge badge-success",
  Milestone: "badge badge-warning",
};

export function TimelineSection() {
  return (
    <Section {...sections.timeline} band>
      <div className="max-w-3xl">
        <TimelineTrack>
          <ol className="relative space-y-8">
            {timeline.map((entry) => (
              <li key={entry.id} className="relative pl-12">
                <span aria-hidden="true" className={cn("timeline-node", kindClass[entry.kind])} />
                <Reveal>
                  <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                    <time dateTime={entry.date} className="font-display font-semibold tabular-nums text-ink-2">
                      {formatYearMonth(entry.date, "long")}
                    </time>
                    <span className={kindBadge[entry.kind]}>{entry.kind}</span>
                  </p>
                  <h3 className="mt-1.5 font-display text-lg font-bold leading-snug tracking-tight text-ink sm:text-xl">{entry.title}</h3>
                  <p className="copy-sm mt-1 max-w-[62ch]">{entry.detail}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </TimelineTrack>
      </div>
    </Section>
  );
}

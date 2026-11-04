import { ChevronDown } from "lucide-react";
import { TimelineTrack } from "@/components/timeline/timeline-track";
import { Khatam } from "@/components/ui/khatam";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { sections } from "@/data/sections";
import { timeline } from "@/data/timeline";
import { ui } from "@/data/ui";
import type { TimelineEntry, TimelineKind } from "@/types";
import { cn, formatYearMonth } from "@/lib/utils";

const RECENT_STEPS = 6;

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

function TimelineStep({ entry }: { entry: TimelineEntry }) {
  return (
    <li className="relative pl-12">
      <Khatam className={cn("timeline-node", kindClass[entry.kind])} />
      <Reveal>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <time dateTime={entry.date} className="font-display font-semibold tabular-nums text-ink-2">
            {formatYearMonth(entry.date, "long")}
          </time>
          <span className={kindBadge[entry.kind]}>{entry.kind}</span>
        </p>
        <h3 className="mt-1.5 font-heading text-lg font-bold leading-snug tracking-[-0.006em] text-ink sm:text-xl">{entry.title}</h3>
        <p className="copy-sm mt-1 max-w-[62ch]">{entry.detail}</p>
      </Reveal>
    </li>
  );
}

export function TimelineSection() {
  const split = Math.max(0, timeline.length - RECENT_STEPS);
  const earlier = timeline.slice(0, split);
  const recent = timeline.slice(split);
  const firstYear = timeline[0]?.date.slice(0, 4) ?? "";

  return (
    <Section {...sections.timeline} band rail>
      <div className="max-w-3xl">
        <TimelineTrack>
          {earlier.length > 0 ? (
            <details className="more timeline-more">
              <summary className="more-toggle timeline-more-toggle">
                <Khatam className="timeline-node timeline-node-more" />
                <span className="more-closed">
                  {ui.more.show} {earlier.length} {ui.more.earlierSteps} {firstYear}
                </span>
                <span className="more-open">{ui.more.fewer}</span>
                <ChevronDown aria-hidden="true" className="more-icon size-4" />
              </summary>
              <ol className="timeline-earlier relative space-y-8">
                {earlier.map((entry) => (
                  <TimelineStep key={entry.id} entry={entry} />
                ))}
              </ol>
            </details>
          ) : null}
          <ol className="relative space-y-8">
            {recent.map((entry) => (
              <TimelineStep key={entry.id} entry={entry} />
            ))}
          </ol>
        </TimelineTrack>
      </div>
    </Section>
  );
}

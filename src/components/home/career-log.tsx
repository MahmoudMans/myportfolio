import { consoleCopy } from "@/data/console";
import { careerLog, type Segment } from "@/lib/console/content";
import { SectionHead } from "@/components/console/section-head";

function Segments({ segments }: { segments: Segment[] }) {
  return (
    <>
      {segments.map((segment, index) =>
        typeof segment === "string" ? (
          segment
        ) : (
          <span key={index} className={segment.className}>
            {segment.text}
          </span>
        ),
      )}
    </>
  );
}

export function CareerLogSection() {
  return (
    <section className="sec" id="experience" aria-labelledby="h-experience">
      <div className="wrap">
        <SectionHead copy={consoleCopy.sections.experience} headingId="h-experience" />
        <ol className="log" id="log">
          {careerLog().map((entry) => (
            <li key={entry.id} className={`log-entry reveal${entry.live ? " live" : ""}`}>
              <h3 className="log-line" id={entry.live ? "liveLine" : undefined}>
                <Segments segments={entry.segments} />
              </h3>
              {entry.meta ? <p className="log-meta">{entry.meta}</p> : null}
              {entry.items.length > 0 ? (
                <ul className="log-list">
                  {entry.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

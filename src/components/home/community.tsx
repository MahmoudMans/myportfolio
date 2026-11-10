import Link from "next/link";
import { consoleCopy } from "@/data/console";
import { communityCards, communityLog } from "@/lib/console/content";
import { vars } from "@/lib/console/style";
import { Icon } from "@/components/console/icon";
import { SectionHead } from "@/components/console/section-head";

export function CommunitySection() {
  const copy = consoleCopy.community;
  const events = communityLog();
  return (
    <section className="sec" id="community" aria-labelledby="h-community">
      <div className="wrap">
        <SectionHead copy={consoleCopy.sections.community} headingId="h-community" />
        <div className="community-grid">
          <div className="roles">
            {communityCards().map((role, index) => (
              <article className="panel role reveal" key={role.id} style={vars({ "--d": `${(index % 2) * 90}ms` })}>
                <div className="panel-head">
                  <span>
                    <Icon name={role.glyph} /> {role.period}
                  </span>
                </div>
                <div className="panel-body">
                  <h3>{role.role}</h3>
                  <p className="role-org">{role.organization}</p>
                  <p className="role-detail">{role.detail}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="panel events reveal" style={vars({ "--d": "120ms" })}>
            <div className="panel-head">
              <span>
                <Icon name="calendar" /> {copy.events}.log
              </span>
              <span>{events.length} entries</span>
            </div>
            <ol className="event-list">
              {events.map((event) => (
                <li key={event.id}>
                  <p className="event-when">{event.when}</p>
                  <p className="event-title">
                    <a href={event.href} target="_blank" rel="noopener noreferrer">
                      {event.title}
                    </a>
                  </p>
                  <p className="event-meta">
                    {event.role}, {event.place}
                  </p>
                </li>
              ))}
            </ol>
            <div className="panel-foot">
              <Link className="btn" href="/posts">
                <Icon name="file" /> {copy.allPosts}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

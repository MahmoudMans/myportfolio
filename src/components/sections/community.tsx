import { ArrowRight, MapPin } from "lucide-react";
import { LinkedInIcon } from "@/components/icons/brand-icons";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { ShowMore } from "@/components/ui/show-more";
import { communityEvents, communityRoles } from "@/data/community";
import { linkedInPosts } from "@/data/posts";
import { sections } from "@/data/sections";
import { ui } from "@/data/ui";
import { postUrl } from "@/lib/posts";
import type { CommunityEvent } from "@/types";

const VISIBLE_EVENTS = 4;

function EventRow({ event }: { event: CommunityEvent }) {
  return (
    <li>
      <article className="event-row">
        <p className="event-when">{event.when}</p>
        <div className="min-w-0">
          <h4 className="font-heading text-[1.0625rem] font-bold leading-snug tracking-[-0.006em] text-ink">{event.title}</h4>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-3">
            <MapPin aria-hidden="true" className="size-3.5 shrink-0" />
            <span>{event.place}</span>
          </p>
          <p className="copy-sm mt-2 max-w-[62ch]">{event.detail}</p>
        </div>
        <div className="event-meta">
          <span className={event.role === "Attendee" ? "event-role" : "event-role event-role-strong"}>{event.role}</span>
          <a href={postUrl(event.postId)} target="_blank" rel="noopener noreferrer" className="resource-link">
            <LinkedInIcon className="size-4 shrink-0" />
            <span>{ui.community.readPost}</span>
            <span className="sr-only">
              , {event.title} {ui.externalSuffix}
            </span>
          </a>
        </div>
      </article>
    </li>
  );
}

export function CommunitySection() {
  const firstEvents = communityEvents.slice(0, VISIBLE_EVENTS);
  const moreEvents = communityEvents.slice(VISIBLE_EVENTS);
  return (
    <Section
      {...sections.community}
      band
      rail
      action={
        <ButtonLink href="/posts" variant="secondary" icon={<ArrowRight aria-hidden="true" className="size-4" />}>
          {`${ui.community.allPosts} (${linkedInPosts.length})`}
        </ButtonLink>
      }
    >
      <h3 className="subsection-title">{ui.community.roles}</h3>
      <Reveal>
        <ul className="cell-panel cell-panel-2">
          {communityRoles.map((role) => (
            <li key={role.id} className="cell">
              <p className="cell-when">{role.period}</p>
              <div>
                <h4 className="entry-title">{role.role}</h4>
                <p className="entry-sub">{role.organization}</p>
              </div>
              <p className="cell-text">{role.detail}</p>
            </li>
          ))}
        </ul>
      </Reveal>

      <h3 className="subsection-title mt-12">{ui.community.events}</h3>
      <Reveal>
        <ol className="event-list">
          {firstEvents.map((event) => (
            <EventRow key={event.id} event={event} />
          ))}
        </ol>
        {moreEvents.length > 0 ? (
          <ShowMore count={moreEvents.length} noun={ui.more.events}>
            <ol className="event-list event-list-more">
              {moreEvents.map((event) => (
                <EventRow key={event.id} event={event} />
              ))}
            </ol>
          </ShowMore>
        ) : null}
      </Reveal>
    </Section>
  );
}

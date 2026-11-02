import { ArrowRight, CalendarDays, GraduationCap, MapPin, Network, Presentation, Users, type LucideIcon } from "lucide-react";
import { LinkedInIcon } from "@/components/icons/brand-icons";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { communityEvents, communityRoles } from "@/data/community";
import { linkedInPosts } from "@/data/posts";
import { sections } from "@/data/sections";
import { ui } from "@/data/ui";
import type { CommunityIcon } from "@/types";
import { postUrl } from "@/lib/posts";

const roleIcons: Record<CommunityIcon, LucideIcon> = {
  gdg: Users,
  meetup: Presentation,
  ieee: Network,
  student: GraduationCap,
};

export function CommunitySection() {
  return (
    <Section
      {...sections.community}
      band
      action={
        <ButtonLink href="/posts" variant="secondary" icon={<ArrowRight aria-hidden="true" className="size-4" />}>
          {`${ui.community.allPosts} (${linkedInPosts.length})`}
        </ButtonLink>
      }
    >
      <h3 className="subsection-title">{ui.community.roles}</h3>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {communityRoles.map((role, index) => {
          const Icon = roleIcons[role.icon];
          return (
            <li key={role.id}>
              <Reveal delay={(index % 2) * 60} className="h-full">
                <article className="card card-pad flex h-full gap-4">
                  <span className={index === 0 ? "tile-icon tile-icon-accent tile-icon-lg" : "tile-icon tile-icon-lg"}>
                    <Icon aria-hidden="true" className="size-6" />
                  </span>
                  <div className="min-w-0">
                    <h4 className="font-display text-lg font-bold leading-snug tracking-tight text-ink">{role.role}</h4>
                    <p className="mt-0.5 text-[0.9375rem] font-semibold text-ink-2">{role.organization}</p>
                    <p className="badge badge-outline mt-3">{role.period}</p>
                    <p className="copy-sm mt-3">{role.detail}</p>
                  </div>
                </article>
              </Reveal>
            </li>
          );
        })}
      </ul>

      <h3 className="subsection-title mt-12">{ui.community.events}</h3>
      <ol className="event-list">
        {communityEvents.map((event) => (
          <li key={event.id}>
            <Reveal>
              <article className="event-row">
                <p className="event-when">
                  <CalendarDays aria-hidden="true" className="size-4 shrink-0" />
                  <span>{event.when}</span>
                </p>
                <div className="min-w-0">
                  <h4 className="font-display text-[1.0625rem] font-bold leading-snug tracking-tight text-ink">{event.title}</h4>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-3">
                    <MapPin aria-hidden="true" className="size-3.5 shrink-0" />
                    <span>{event.place}</span>
                  </p>
                  <p className="copy-sm mt-2 max-w-[62ch]">{event.detail}</p>
                </div>
                <div className="event-meta">
                  <span className={event.role === "Attendee" ? "badge" : "badge badge-accent"}>{event.role}</span>
                  <a href={postUrl(event.postId)} target="_blank" rel="noopener noreferrer" className="resource-link">
                    <LinkedInIcon className="size-4 shrink-0" />
                    <span>{ui.community.readPost}</span>
                    <span className="sr-only">
                      , {event.title} {ui.externalSuffix}
                    </span>
                  </a>
                </div>
              </article>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}

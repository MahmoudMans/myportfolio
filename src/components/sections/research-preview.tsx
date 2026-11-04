import { ArrowDown, Bug, Brain, FlaskConical, Server, ShieldCheck, type LucideIcon } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { research } from "@/data/research";
import { sections } from "@/data/sections";
import { ui } from "@/data/ui";
import type { ResearchIcon } from "@/types";

const interestIcons: Record<ResearchIcon, LucideIcon> = {
  software: ShieldCheck,
  vulnerability: Bug,
  systems: Server,
  ai: Brain,
};

export function ResearchPreview() {
  const { interests, experience, goal } = research;
  return (
    <Section {...sections.research}>
      <h3 className="subsection-title">{ui.research.interests}</h3>
      <Reveal>
        <ul className="column-list column-list-4">
          {interests.map((interest) => {
            const Icon = interestIcons[interest.icon];
            return (
              <li key={interest.title} className="column-item">
                <h4 className="column-title">
                  <Icon aria-hidden="true" className="column-icon size-5" />
                  {interest.title}
                </h4>
                <p className="copy-sm">{interest.body}</p>
              </li>
            );
          })}
        </ul>
      </Reveal>

      <Reveal>
        <div className="research-pair mt-12">
          <article className="research-past">
            <h3 className="meta-label">{ui.research.experience}</h3>
            <p className="mt-4 flex items-center gap-2 font-display text-[0.9375rem] font-semibold tabular-nums text-ink-2">
              <FlaskConical aria-hidden="true" className="size-4 shrink-0 text-saffron-ink" />
              {experience.period}
            </p>
            <p className="mt-2 font-heading text-2xl font-bold leading-tight tracking-[-0.006em] text-ink">{experience.role}</p>
            <p className="mt-1 text-[0.96875rem] font-semibold text-ink-2">
              {experience.organization}
              <span className="font-normal text-ink-3">, {experience.location}</span>
            </p>
          </article>
          <article className="research-goal">
            <h3 className="meta-label">{ui.research.goal}</h3>
            <p className="mt-3 font-heading text-2xl font-bold leading-tight tracking-[-0.006em] text-ink">{goal.title}</p>
            <p className="copy mt-3 max-w-[60ch]">{goal.body}</p>
            <div className="mt-6">
              <ButtonLink href="/#contact" icon={<ArrowDown aria-hidden="true" className="size-4" />}>
                {ui.research.contact}
              </ButtonLink>
            </div>
          </article>
        </div>
      </Reveal>
    </Section>
  );
}

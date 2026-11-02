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
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {interests.map((interest, index) => {
          const Icon = interestIcons[interest.icon];
          return (
            <li key={interest.title}>
              <Reveal delay={index * 60} className="h-full">
                <article className="focus-card">
                  <span className="tile-icon tile-icon-accent">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <h4 className="font-display text-lg font-bold tracking-tight text-ink">{interest.title}</h4>
                  <p className="copy-sm">{interest.body}</p>
                </article>
              </Reveal>
            </li>
          );
        })}
      </ul>

      <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <Reveal className="h-full">
          <article className="card card-pad h-full">
            <h3 className="meta-label">{ui.research.experience}</h3>
            <div className="mt-4 flex items-start gap-4">
              <span className="tile-icon tile-icon-olive">
                <FlaskConical aria-hidden="true" className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="font-display text-xl font-bold tracking-tight text-ink">{experience.role}</p>
                <p className="mt-0.5 text-[0.96875rem] font-semibold text-ink-2">
                  {experience.organization}
                  <span className="font-normal text-ink-3">, {experience.location}</span>
                </p>
                <p className="badge badge-outline mt-3">{experience.period}</p>
              </div>
            </div>
          </article>
        </Reveal>
        <Reveal className="h-full">
          <article className="research-goal h-full">
            <h3 className="meta-label">{ui.research.goal}</h3>
            <p className="mt-3 font-display text-2xl font-bold leading-tight tracking-tight text-ink">{goal.title}</p>
            <p className="copy mt-3 max-w-[60ch]">{goal.body}</p>
            <div className="mt-6">
              <ButtonLink href="/#contact" icon={<ArrowDown aria-hidden="true" className="size-4" />}>
                {ui.research.contact}
              </ButtonLink>
            </div>
          </article>
        </Reveal>
      </div>
    </Section>
  );
}

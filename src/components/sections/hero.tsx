import { ArrowDown, Brain, Clock, Download, Languages, MapPin, MonitorSmartphone, ShieldCheck, Target, type LucideIcon } from "lucide-react";
import Image from "next/image";
import { HeroShowcaseArt } from "@/components/hero/hero-showcase";
import { GitHubIcon, LinkedInIcon } from "@/components/icons/brand-icons";
import { PaletteHint } from "@/components/palette/palette-trigger";
import { ButtonLink } from "@/components/ui/button-link";
import { Lattice } from "@/components/ui/lattice";
import { Reveal } from "@/components/ui/reveal";
import { TagList } from "@/components/ui/tags";
import { heroShowcase } from "@/data/hero";
import { profile } from "@/data/profile";
import { sections } from "@/data/sections";
import { site } from "@/data/site";
import { ui } from "@/data/ui";
import type { FocusIcon } from "@/types";
import { cn } from "@/lib/utils";

const availabilityTone = {
  "open-to-work": "status-dot-open",
  internships: "status-dot-open",
  collaborations: "status-dot-open",
  unavailable: "status-dot-busy",
} as const;

const factIcons = {
  location: MapPin,
  languages: Languages,
  timezone: Clock,
  availability: Target,
} as const;

const focusIcons: Record<FocusIcon, LucideIcon> = {
  web: MonitorSmartphone,
  security: ShieldCheck,
  ai: Brain,
};

export function Hero() {
  const github = profile.socials.find((social) => social.kind === "github");
  const linkedin = profile.socials.find((social) => social.kind === "linkedin");
  const facts = [
    { key: "location", term: ui.hero.facts.location, detail: profile.location },
    { key: "languages", term: ui.hero.facts.languages, detail: profile.languagesSpoken.join(", ") },
    { key: "timezone", term: ui.hero.facts.timezone, detail: profile.timezone },
    { key: "availability", term: ui.hero.facts.availability, detail: profile.availability.detail },
  ] as const;

  return (
    <section id={sections.about.id} aria-labelledby="about-heading" className="hero">
      <Lattice className="hero-lattice" />
      <div className="page-shell relative">
        <div className="grid grid-cols-1 items-center gap-x-12 gap-y-12 pt-12 pb-16 sm:pt-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:pt-20 lg:pb-24">
          <div className="hero-copy">
            <p className="availability">
              <span className={cn("status-dot", availabilityTone[profile.availability.status])} aria-hidden="true" />
              <span className="font-semibold text-ink">{profile.availability.label}</span>
              <span className="hidden text-ink-3 sm:inline lg:hidden xl:inline">{profile.availability.detail}</span>
            </p>
            <h1 id="about-heading" className="hero-name">
              {profile.name}
            </h1>
            <p className="hero-headline">{profile.headline}</p>
            <p className="hero-tagline">{profile.tagline}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href="/cv.pdf" download={site.cvFileName} icon={<Download aria-hidden="true" className="size-4" />}>
                {ui.hero.downloadCv}
              </ButtonLink>
              <ButtonLink href="/#contact" variant="secondary" icon={<ArrowDown aria-hidden="true" className="size-4" />}>
                {ui.hero.contact}
              </ButtonLink>
              <span className="flex items-center gap-2">
                {github ? (
                  <a
                    href={github.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon-button icon-button-outline"
                    aria-label={`${github.label} ${ui.externalSuffix}`}
                    title={github.label}
                  >
                    <GitHubIcon className="size-[18px]" />
                  </a>
                ) : null}
                {linkedin ? (
                  <a
                    href={linkedin.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon-button icon-button-outline"
                    aria-label={`${linkedin.label} ${ui.externalSuffix}`}
                    title={linkedin.label}
                  >
                    <LinkedInIcon className="size-[18px]" />
                  </a>
                ) : null}
              </span>
            </div>
            <div className="mt-8 hidden sm:block">
              <PaletteHint />
            </div>
          </div>
          <HeroShowcaseArt showcase={heroShowcase} />
        </div>
      </div>

      <div className="page-shell relative pb-[clamp(4.5rem,8vw,7rem)]">
        <div className="grid grid-cols-1 gap-8 border-t border-line pt-[clamp(3.5rem,7vw,5.5rem)] lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-14">
          <div className="min-w-0">
            <h2 className="section-title">{sections.about.title}</h2>
            <p className="section-intro">{sections.about.intro}</p>
            <div className="mt-6 space-y-4">
              {profile.bio.map((paragraph) => (
                <p key={paragraph} className="copy max-w-[68ch]">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <aside aria-label={ui.hero.profileCard} className="profile-card lg:self-start">
            <div className="profile-card-top">
              <div className="avatar">
                <Image
                  src={profile.photo.src}
                  alt={profile.photo.alt}
                  width={profile.photo.width}
                  height={profile.photo.height}
                  unoptimized
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="font-display text-lg font-bold leading-tight tracking-tight text-ink">{profile.name}</p>
                <p className="mt-1 text-sm text-ink-3">{profile.role}</p>
              </div>
            </div>
            <dl className="fact-list">
              {facts.map((fact) => {
                const Icon = factIcons[fact.key];
                return (
                  <div key={fact.term} className="fact">
                    <Icon aria-hidden="true" className="fact-icon size-4 shrink-0" />
                    <div className="min-w-0">
                      <dt className="meta-label">{fact.term}</dt>
                      <dd className="mt-0.5 text-[0.9375rem] font-medium leading-snug text-ink">{fact.detail}</dd>
                    </div>
                  </div>
                );
              })}
            </dl>
          </aside>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {profile.focus.map((area, index) => {
            const Icon = focusIcons[area.icon];
            return (
              <li key={area.title}>
                <Reveal delay={index * 70} className="h-full">
                  <article className="focus-card">
                    <span className="tile-icon tile-icon-accent">
                      <Icon aria-hidden="true" className="size-5" />
                    </span>
                    <h3 className="font-display text-lg font-bold tracking-tight text-ink">{area.title}</h3>
                    <p className="copy-sm">{area.body}</p>
                    {area.tools ? <TagList items={area.tools} label={`${ui.projects.stack}, ${area.title}`} className="mt-auto pt-1" /> : null}
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

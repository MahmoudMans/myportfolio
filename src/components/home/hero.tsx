import { consoleCopy } from "@/data/console";
import { profile } from "@/data/profile";
import { site } from "@/data/site";
import { heroMeta } from "@/lib/console/content";
import { Icon } from "@/components/console/icon";

export function HeroSection() {
  const copy = consoleCopy.hero;
  const titles = consoleCopy.titles;
  return (
    <section className="hero" id="top" aria-label="Introduction">
      <canvas id="net" aria-hidden="true" />
      <div className="wrap hero-inner">
        <p className="hero-status">
          <i className="pulse" />
          <span>{copy.status}</span> {copy.statusDetail}
        </p>
        <h1 className="hero-name" id="heroName" aria-label={profile.name}>
          <span aria-hidden="true">{profile.name}</span>
        </h1>
        <p className="hero-role">
          <span className="sr-only">{titles.join(", ")}</span>
          <span className="ps1" aria-hidden="true">
            &gt;
          </span>
          <span id="typed" aria-hidden="true">
            {titles[0]}
          </span>
          <span className="caret" aria-hidden="true" />
        </p>
        <p className="hero-bio">{profile.tagline}</p>
        <div className="hero-cta">
          <a className="btn btn-primary" href="#projects">
            {copy.projects}
          </a>
          <button className="btn" type="button" data-open-term="">
            {copy.terminal} <kbd>Ctrl + `</kbd>
          </button>
          <a className="btn" href="/cv.pdf" download={site.cvFileName}>
            <Icon name="download" /> {copy.cv}
          </a>
        </div>
        <dl className="hero-meta">
          {heroMeta().map((row) => (
            <div key={row.key}>
              <dt>{row.key}</dt>
              <dd>
                {row.live ? <i className="pulse" /> : null}
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

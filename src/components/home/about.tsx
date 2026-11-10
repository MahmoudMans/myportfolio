import { consoleCopy } from "@/data/console";
import { profile } from "@/data/profile";
import { HANDLE, identityRows, profileStats } from "@/lib/console/content";
import { vars } from "@/lib/console/style";
import { Icon } from "@/components/console/icon";
import { SectionHead } from "@/components/console/section-head";

export function AboutSection() {
  const copy = consoleCopy.about;
  return (
    <section className="sec" id="about" aria-labelledby="h-about">
      <div className="wrap">
        <SectionHead copy={consoleCopy.sections.about} headingId="h-about" />
        <div className="about-grid">
          <div className="about-text reveal">
            {profile.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <div className="stats">
              {profileStats().map((stat) => (
                <div className="stat" key={stat.label}>
                  <b data-scramble={stat.value}>{stat.value}</b>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
          <aside className="panel reveal" style={vars({ "--d": "120ms" })} aria-label="Profile summary">
            <div className="panel-head">
              <span>{copy.panel}</span>
              <span className="ok">
                <i className="pulse" /> {copy.verified}
              </span>
            </div>
            <div className="id-top">
              <div className="fp" aria-hidden="true">
                <Icon name="fingerprint" />
              </div>
              <div>
                <p className="id-name">{profile.name}</p>
                <p className="id-role">uid=1000({HANDLE}) groups=security,research,dev</p>
              </div>
            </div>
            <dl className="id-rows">
              {identityRows().map((row) => (
                <div key={row.key}>
                  <dt>{row.key}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </div>
    </section>
  );
}

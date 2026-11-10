import { consoleCopy } from "@/data/console";
import { badges } from "@/lib/console/content";
import { vars } from "@/lib/console/style";
import { Icon } from "@/components/console/icon";
import { SectionHead } from "@/components/console/section-head";

export function BadgesSection() {
  const copy = consoleCopy.badges;
  return (
    <section className="sec" id="certs" aria-labelledby="h-certs">
      <div className="wrap">
        <SectionHead copy={consoleCopy.sections.certs} headingId="h-certs" />
        <div className="badges" id="badges">
          {badges().map((badge, index) => (
            <div className="badge-wrap reveal" key={badge.id} style={vars({ "--d": `${(index % 4) * 90}ms` })}>
              <article className="badge" aria-label={`${badge.name}, ${badge.issuer}, ${badge.year}`}>
                <div className="badge-slot" aria-hidden="true" />
                <div className="badge-top">
                  <span>{badge.issuer}</span>
                  <span>{badge.year}</span>
                </div>
                <div className="badge-ico" aria-hidden="true">
                  <Icon name={badge.icon} />
                </div>
                <h3 className="badge-code">{badge.code}</h3>
                <p className="badge-name">{badge.name}</p>
                <dl className="badge-rows">
                  <div>
                    <dt>{copy.type}</dt>
                    <dd>{badge.type}</dd>
                  </div>
                  <div>
                    <dt>{copy.proof}</dt>
                    <dd>
                      {badge.proof ? (
                        <a href={badge.proof.href} target="_blank" rel="noopener noreferrer">
                          {badge.proof.label}
                        </a>
                      ) : (
                        copy.onRequest
                      )}
                    </dd>
                  </div>
                </dl>
                <div className="badge-bar" aria-hidden="true" />
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { consoleCopy } from "@/data/console";
import { research } from "@/data/research";
import { researchCards } from "@/lib/console/content";
import { slugify, vars } from "@/lib/console/style";
import { Icon } from "@/components/console/icon";
import { SectionHead } from "@/components/console/section-head";

export function ResearchSection() {
  const copy = consoleCopy.research;
  return (
    <section className="sec" id="research" aria-labelledby="h-research">
      <div className="wrap">
        <SectionHead copy={consoleCopy.sections.research} headingId="h-research" />
        <div className="research-grid">
          {researchCards().map((card, index) => (
            <article className="panel research-card reveal" key={card.title} style={vars({ "--d": `${(index % 4) * 80}ms` })}>
              <div className="panel-head">
                <span>
                  <Icon name={card.icon} /> {slugify(card.title)}.md
                </span>
              </div>
              <div className="panel-body">
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="research-foot">
          <article className="panel goal reveal">
            <div className="panel-head">
              <span>
                <Icon name="flag" /> {copy.goal}
              </span>
              <span className="ok">
                <i className="pulse" /> open
              </span>
            </div>
            <div className="panel-body">
              <h3>{research.goal.title}</h3>
              <p>{research.goal.body}</p>
              <div className="goal-actions">
                <a className="btn btn-primary" href="#contact">
                  <Icon name="lock" /> {copy.goalCta}
                </a>
              </div>
            </div>
          </article>
          <aside className="panel reveal" style={vars({ "--d": "120ms" })}>
            <div className="panel-head">
              <span>
                <Icon name="book" /> {copy.experience}
              </span>
            </div>
            <dl className="id-rows">
              <div>
                <dt>role</dt>
                <dd>{research.experience.role}</dd>
              </div>
              <div>
                <dt>lab</dt>
                <dd>{research.experience.organization}</dd>
              </div>
              <div>
                <dt>location</dt>
                <dd>{research.experience.location}</dd>
              </div>
              <div>
                <dt>period</dt>
                <dd>{research.experience.period}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>
    </section>
  );
}

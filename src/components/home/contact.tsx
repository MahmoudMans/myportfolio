import { consoleCopy } from "@/data/console";
import { languages } from "@/data/languages";
import { profile } from "@/data/profile";
import { site } from "@/data/site";
import { gitHub, linkedIn } from "@/lib/console/content";
import { prettyUrl, vars } from "@/lib/console/style";
import { Icon } from "@/components/console/icon";
import { SectionHead } from "@/components/console/section-head";

export function ContactSection() {
  const copy = consoleCopy.contact;
  return (
    <section className="sec" id="contact" aria-labelledby="h-contact">
      <div className="wrap">
        <SectionHead copy={consoleCopy.sections.contact} headingId="h-contact" />
        <div className="contact-grid">
          <div className="panel reveal">
            <div className="panel-head">
              <span>
                <Icon name="lock" /> {copy.channel}
              </span>
              <span id="chanState">{copy.idle}</span>
            </div>
            <form className="form" id="contactForm" noValidate>
              <div className="field">
                <label htmlFor="f-name">{copy.name}</label>
                <div className="inp">
                  <span aria-hidden="true">name&gt;</span>
                  <input id="f-name" name="name" type="text" autoComplete="name" required placeholder={copy.namePlaceholder} aria-describedby="e-name" />
                </div>
                <p className="field-err" id="e-name" hidden />
              </div>
              <div className="field">
                <label htmlFor="f-email">{copy.email}</label>
                <div className="inp">
                  <span aria-hidden="true">from&gt;</span>
                  <input id="f-email" name="email" type="email" autoComplete="email" required placeholder={copy.emailPlaceholder} aria-describedby="e-email" />
                </div>
                <p className="field-err" id="e-email" hidden />
              </div>
              <div className="field">
                <label htmlFor="f-msg">{copy.message}</label>
                <div className="inp">
                  <span aria-hidden="true">msg&gt;</span>
                  <textarea id="f-msg" name="message" rows={5} required placeholder={copy.messagePlaceholder} aria-describedby="e-msg" />
                </div>
                <p className="field-err" id="e-msg" hidden />
              </div>
              <div className="form-actions">
                <button className="btn btn-primary" type="submit" id="sendBtn">
                  <Icon name="lock" /> {copy.send}
                </button>
                <p className="form-note">{copy.note}</p>
              </div>
            </form>
            <ol className="tx" id="tx" aria-live="polite" hidden />
          </div>
          <div className="contact-side">
            <div className="panel reveal" style={vars({ "--d": "120ms" })}>
              <div className="panel-head">
                <span>
                  <Icon name="nodes" /> {copy.direct}
                </span>
              </div>
              <ul className="direct">
                <li>
                  <Icon name="mail" />
                  <a href={`mailto:${profile.email}`}>{profile.email}</a>
                  <button className="copy" type="button" data-copy={profile.email}>
                    <Icon name="copy" /> {copy.copy}
                  </button>
                </li>
                {linkedIn ? (
                  <li>
                    <Icon name="user" />
                    <a href={linkedIn.href} target="_blank" rel="noopener noreferrer">
                      {prettyUrl(linkedIn.href)}
                    </a>
                  </li>
                ) : null}
                {gitHub ? (
                  <li>
                    <Icon name="code" />
                    <a href={gitHub.href} target="_blank" rel="noopener noreferrer">
                      {prettyUrl(gitHub.href)}
                    </a>
                  </li>
                ) : null}
                <li>
                  <Icon name="file" />
                  <a href="/cv.pdf" download={site.cvFileName}>
                    {copy.cv}
                  </a>
                </li>
              </ul>
            </div>
            <div className="panel reveal" style={vars({ "--d": "200ms" })}>
              <div className="panel-head">
                <span>
                  <Icon name="key" /> {copy.status}
                </span>
                <span className="ok">
                  <i className="pulse" /> online
                </span>
              </div>
              <dl className="id-rows">
                <div>
                  <dt>{copy.statusRows.looking}</dt>
                  <dd>{profile.availability.detail}</dd>
                </div>
                <div>
                  <dt>{copy.statusRows.location}</dt>
                  <dd>{profile.location}</dd>
                </div>
                <div>
                  <dt>{copy.statusRows.timezone}</dt>
                  <dd>{profile.timezone}</dd>
                </div>
                <div>
                  <dt>{copy.statusRows.speaks}</dt>
                  <dd>{languages.map((language) => language.name).join(", ")}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { consoleCopy } from "@/data/console";
import { footerLinks } from "@/data/navigation";
import { profile } from "@/data/profile";
import { site } from "@/data/site";
import { gitHub, linkedIn } from "@/lib/console/content";
import { Icon } from "./icon";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="foot" id="foot" data-payload={consoleCopy.flagBase64}>
      <div className="wrap">
        <div className="foot-row">
          <p className="foot-secure">
            <Icon name="lock" />
            <span id="footText">
              {consoleCopy.footer.secured} · © {year} {profile.name}
            </span>
            <span className="caret" aria-hidden="true" />
          </p>
          <ul className="foot-links">
            {gitHub ? (
              <li>
                <a href={gitHub.href} target="_blank" rel="noopener noreferrer">
                  <Icon name="code" /> GitHub
                </a>
              </li>
            ) : null}
            {linkedIn ? (
              <li>
                <a href={linkedIn.href} target="_blank" rel="noopener noreferrer">
                  <Icon name="user" /> LinkedIn
                </a>
              </li>
            ) : null}
            <li>
              <a href={`mailto:${profile.email}`}>
                <Icon name="mail" /> Email
              </a>
            </li>
          </ul>
        </div>
        <div className="foot-row foot-sub">
          <ul className="foot-links">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label.toLowerCase()}</Link>
              </li>
            ))}
          </ul>
          <p className="foot-note">{site.footerNote}</p>
        </div>
        <p className="flag-badge" id="flagBadge" hidden>
          <Icon name="flag" /> {consoleCopy.footer.flag}
        </p>
      </div>
    </footer>
  );
}

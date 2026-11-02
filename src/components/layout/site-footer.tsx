import Link from "next/link";
import { GitHubIcon, LinkedInIcon, OctagramMark } from "@/components/icons/brand-icons";
import { footerLinks } from "@/data/navigation";
import { now } from "@/data/now";
import { profile } from "@/data/profile";
import { site } from "@/data/site";
import { ui } from "@/data/ui";
import { formatDate, yearOf } from "@/lib/utils";

export function SiteFooter() {
  const github = profile.socials.find((social) => social.kind === "github");
  const linkedin = profile.socials.find((social) => social.kind === "linkedin");
  return (
    <footer className="site-footer">
      <div className="page-shell grid grid-cols-1 gap-10 py-12 md:grid-cols-[minmax(0,1fr)_auto] md:py-14">
        <div>
          <p className="flex items-center gap-3 font-display text-lg font-bold text-ink">
            <span className="brand-mark" aria-hidden="true">
              <OctagramMark className="size-5" />
            </span>
            {profile.name}
          </p>
          <p className="copy-sm mt-4 max-w-[48ch]">{site.footerNote}</p>
        </div>
        <div className="flex flex-col gap-6 md:items-end">
          <nav aria-label={ui.footerNav}>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            {github ? (
              <a
                href={github.href}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-button icon-button-outline"
                aria-label={`${github.label} ${ui.externalSuffix}`}
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
              >
                <LinkedInIcon className="size-[18px]" />
              </a>
            ) : null}
          </div>
        </div>
      </div>
      <div className="page-shell">
        <div className="flex flex-col gap-2 border-t border-line py-6 text-sm text-ink-3 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {yearOf(now.lastUpdated)} {profile.name}
          </p>
          <p>
            {ui.lastUpdated} <time dateTime={now.lastUpdated}>{formatDate(now.lastUpdated)}</time>
          </p>
        </div>
      </div>
    </footer>
  );
}

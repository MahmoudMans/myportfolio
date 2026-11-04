import Link from "next/link";
import { GitHubIcon, LinkedInIcon, OctagramMark } from "@/components/icons/brand-icons";
import { MarkedName } from "@/components/ui/khatam";
import { footerLinks } from "@/data/navigation";
import { now } from "@/data/now";
import { profile } from "@/data/profile";
import { site } from "@/data/site";
import { ui } from "@/data/ui";
import { cn, formatDate, yearOf } from "@/lib/utils";

const availabilityTone = {
  "open-to-work": "status-dot-open",
  internships: "status-dot-open",
  collaborations: "status-dot-open",
  unavailable: "status-dot-busy",
} as const;

export function SiteFooter() {
  const github = profile.socials.find((social) => social.kind === "github");
  const linkedin = profile.socials.find((social) => social.kind === "linkedin");
  return (
    <footer className="site-footer">
      <div className="footer-border" aria-hidden="true" />
      <div className="page-shell grid grid-cols-1 gap-10 py-12 md:grid-cols-[minmax(0,1fr)_auto] md:py-16">
        <div>
          <p className="flex items-center gap-3.5">
            <span className="brand-mark brand-mark-lg" aria-hidden="true">
              <OctagramMark className="size-6" />
            </span>
            <span className="footer-name">
              <MarkedName name={profile.name} />
            </span>
          </p>
          <p className="mt-5 flex items-center gap-2.5 font-display text-[0.9375rem] font-semibold text-ink">
            <span className={cn("status-dot", availabilityTone[profile.availability.status])} aria-hidden="true" />
            {profile.availability.label}
          </p>
          <p className="copy-sm mt-3 max-w-[48ch]">{site.footerNote}</p>
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
          <p className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a href="/.well-known/security.txt" className="footer-meta-link">
              {ui.reportSecurity}
            </a>
            <span>
              {ui.lastUpdated} <time dateTime={now.lastUpdated}>{formatDate(now.lastUpdated)}</time>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}

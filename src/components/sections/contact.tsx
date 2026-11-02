import { ArrowUpRight } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/icons/brand-icons";
import { Lattice } from "@/components/ui/lattice";
import { profile } from "@/data/profile";
import { sections } from "@/data/sections";
import { ui } from "@/data/ui";
import type { SocialKind } from "@/types";

function SocialIcon({ kind }: { kind: SocialKind }) {
  if (kind === "github") return <GitHubIcon className="size-6" />;
  return <LinkedInIcon className="size-6" />;
}

export function ContactSection() {
  const headingId = `${sections.contact.id}-heading`;
  const order: SocialKind[] = ["linkedin", "github"];
  const links = order.flatMap((kind) => profile.socials.filter((social) => social.kind === kind));

  return (
    <section id={sections.contact.id} aria-labelledby={headingId} className="section-block pt-0 pb-24">
      <div className="page-shell">
        <div className="contact-panel">
          <Lattice className="contact-panel-lattice" />
          <div className="relative grid grid-cols-1 items-center gap-10 p-6 sm:p-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14 lg:p-14">
            <div className="min-w-0">
              <h2 id={headingId} className="section-title">
                {ui.contact.headline}
              </h2>
              <p className="section-intro">{sections.contact.intro}</p>
            </div>

            <div className="min-w-0">
              <p className="meta-label">{ui.contact.findMe}</p>
              <ul className="mt-3 space-y-3">
                {links.map((link) => (
                  <li key={link.kind}>
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="social-link social-link-large group">
                      <span className="social-icon">
                        <SocialIcon kind={link.kind} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-lg font-semibold text-ink">{link.label}</span>
                        <span className="block truncate text-sm text-ink-3">{link.handle}</span>
                      </span>
                      <ArrowUpRight aria-hidden="true" className="size-5 shrink-0 text-ink-3 transition-colors group-hover:text-accent" />
                      <span className="sr-only"> {ui.externalSuffix}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Award, BadgeCheck, Cloud, Network, Route, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { ResourceLinks } from "@/components/ui/resource-links";
import { Section } from "@/components/ui/section";
import { certifications } from "@/data/certifications";
import { sections } from "@/data/sections";
import { ui } from "@/data/ui";
import type { Certification, CertificationKind, ResourceLink } from "@/types";
import { postUrl } from "@/lib/posts";
import { formatYearMonth } from "@/lib/utils";

const kindIcons: Record<CertificationKind, LucideIcon> = {
  Certification: BadgeCheck,
  "Course certificate": Network,
  Recognition: Award,
  "Learning path": Route,
  "Skill badges": Cloud,
};

function certificationLinks(item: Certification): ResourceLink[] {
  const links: ResourceLink[] = [];
  if (item.link) links.push(item.link);
  if (item.postId) links.push({ kind: "linkedin", label: ui.certifications.readPost, href: postUrl(item.postId) });
  return links;
}

export function CertificationList({ items, headingLevel = "h3" }: { items: Certification[]; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item, index) => {
        const Icon = kindIcons[item.kind];
        const links = certificationLinks(item);
        return (
          <li key={item.id}>
            <Reveal delay={(index % 3) * 60} className="h-full">
              <article className="cert-card">
                <div className="flex items-start justify-between gap-3">
                  <span className={item.kind === "Certification" ? "tile-icon tile-icon-accent" : "tile-icon tile-icon-olive"}>
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <span className="badge badge-outline tabular-nums">
                    {item.date ? formatYearMonth(item.date) : ui.certifications.noDate}
                  </span>
                </div>
                <div className="min-w-0">
                  <Heading className="font-display text-lg font-bold leading-snug tracking-tight text-ink">{item.name}</Heading>
                  <p className="mt-1 text-[0.9375rem] font-semibold text-ink-2">
                    {item.issuer}
                    <span className="font-normal text-ink-3">, {item.kind.toLowerCase()}</span>
                  </p>
                </div>
                <p className="copy-sm">{item.detail}</p>
                {links.length > 0 ? (
                  <ResourceLinks links={links} label={`${item.name} links`} context={item.name} className="mt-auto border-t border-line pt-3" />
                ) : null}
              </article>
            </Reveal>
          </li>
        );
      })}
    </ul>
  );
}

export function CertificationsSection() {
  return (
    <Section {...sections.certifications}>
      <CertificationList items={certifications} />
    </Section>
  );
}

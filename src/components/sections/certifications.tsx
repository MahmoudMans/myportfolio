import { Reveal } from "@/components/ui/reveal";
import { ResourceLinks } from "@/components/ui/resource-links";
import { Section } from "@/components/ui/section";
import { ShowMore } from "@/components/ui/show-more";
import { certifications } from "@/data/certifications";
import { sections } from "@/data/sections";
import { ui } from "@/data/ui";
import type { Certification, ResourceLink } from "@/types";
import { postUrl } from "@/lib/posts";
import { formatYearMonth } from "@/lib/utils";

function certificationLinks(item: Certification): ResourceLink[] {
  const links: ResourceLink[] = [];
  if (item.link) links.push(item.link);
  if (item.postId) links.push({ kind: "linkedin", label: ui.certifications.readPost, href: postUrl(item.postId) });
  return links;
}

interface CertificationListProps {
  items: Certification[];
  headingLevel?: "h2" | "h3";
  visible?: number;
}

export function CertificationList({ items, headingLevel = "h3", visible }: CertificationListProps) {
  const Heading = headingLevel;
  const shown = visible === undefined ? items : items.slice(0, visible);
  const extra = visible === undefined ? [] : items.slice(visible);

  function renderItem(item: Certification) {
    const links = certificationLinks(item);
    return (
      <li key={item.id} className="entry cert-row">
        <p className="entry-when">
          <span>{item.date ? formatYearMonth(item.date, "long") : ui.certifications.noDate}</span>
        </p>
        <div className="entry-main">
          <Heading className="entry-title">{item.name}</Heading>
          <p className="entry-sub">
            {item.issuer}
            <span>, {item.kind.toLowerCase()}</span>
          </p>
          <p className="copy-sm mt-2 max-w-[64ch]">{item.detail}</p>
        </div>
        {links.length > 0 ? (
          <div className="entry-aside">
            <ResourceLinks links={links} label={`${item.name} links`} context={item.name} className="entry-links" />
          </div>
        ) : null}
      </li>
    );
  }

  return (
    <Reveal>
      <ul className="entry-list">{shown.map(renderItem)}</ul>
      {extra.length > 0 ? (
        <ShowMore count={extra.length} noun={ui.more.certifications}>
          <ul className="entry-list entry-list-more">{extra.map(renderItem)}</ul>
        </ShowMore>
      ) : null}
    </Reveal>
  );
}

export function CertificationsSection() {
  return (
    <Section {...sections.certifications} rail>
      <CertificationList items={certifications} visible={4} />
    </Section>
  );
}

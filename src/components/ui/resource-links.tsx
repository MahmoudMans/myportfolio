import {
  BadgeCheck,
  CirclePlay,
  CodeXml,
  Database,
  FileText,
  Globe,
  Image as ImageIcon,
  Presentation,
  type LucideIcon,
} from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/icons/brand-icons";
import { ui } from "@/data/ui";
import type { LinkKind, ResourceLink } from "@/types";
import { cn, isExternal } from "@/lib/utils";

const icons: Record<Exclude<LinkKind, "github" | "linkedin">, LucideIcon> = {
  demo: Globe,
  video: CirclePlay,
  paper: FileText,
  slides: Presentation,
  poster: ImageIcon,
  dataset: Database,
  code: CodeXml,
  report: FileText,
  verify: BadgeCheck,
};

export function LinkKindIcon({ kind, className }: { kind: LinkKind; className?: string }) {
  if (kind === "github") return <GitHubIcon className={className} />;
  if (kind === "linkedin") return <LinkedInIcon className={className} />;
  const Icon = icons[kind];
  return <Icon className={className} aria-hidden="true" />;
}

interface ResourceLinksProps {
  links: ResourceLink[];
  label: string;
  className?: string;
  context?: string;
}

export function ResourceLinks({ links, label, className, context }: ResourceLinksProps) {
  return (
    <ul aria-label={label} className={cn("flex flex-wrap gap-x-4 gap-y-2", className)}>
      {links.map((link) => {
        const external = isExternal(link.href);
        return (
          <li key={`${link.kind}-${link.href}`}>
            <a
              href={link.href}
              className="resource-link"
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
            >
              <LinkKindIcon kind={link.kind} className="size-4 shrink-0" />
              <span>{link.label}</span>
              {context ? <span className="sr-only">, {context}</span> : null}
              {external ? <span className="sr-only"> {ui.externalSuffix}</span> : null}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

import Link from "next/link";
import type { ReactNode } from "react";
import { ui } from "@/data/ui";
import { cn, isExternal } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary: "btn btn-primary",
  secondary: "btn btn-secondary",
  ghost: "btn btn-ghost",
};

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  download?: string;
  icon?: ReactNode;
}

export function ButtonLink({ href, children, variant = "primary", className, download, icon }: ButtonLinkProps) {
  const classes = cn(variants[variant], className);
  if (download !== undefined) {
    return (
      <a href={href} download={download} className={classes}>
        {icon}
        <span>{children}</span>
      </a>
    );
  }
  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {icon}
        <span>{children}</span>
        <span className="sr-only"> {ui.externalSuffix}</span>
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {icon}
      <span>{children}</span>
    </Link>
  );
}

interface TextLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function TextLink({ href, children, className }: TextLinkProps) {
  if (isExternal(href) || href.startsWith("mailto:")) {
    const external = isExternal(href);
    return (
      <a
        href={href}
        className={cn("text-link", className)}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {children}
        {external ? <span className="sr-only"> {ui.externalSuffix}</span> : null}
      </a>
    );
  }
  return (
    <Link href={href} className={cn("text-link", className)}>
      {children}
    </Link>
  );
}

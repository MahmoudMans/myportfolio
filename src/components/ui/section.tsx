import type { ReactNode } from "react";
import { Lattice } from "@/components/ui/lattice";
import { cn } from "@/lib/utils";

interface SectionProps {
  id: string;
  title: string;
  intro?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  band?: boolean;
}

export function Section({ id, title, intro, action, children, className, band = false }: SectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className={cn("section-block", band && "band", className)}>
      <div className="page-shell">
        <header className="section-head">
          <div className="min-w-0">
            <h2 id={headingId} className="section-title">
              {title}
            </h2>
            {intro ? <p className="section-intro">{intro}</p> : null}
          </div>
          {action ? <div className="flex flex-wrap items-center gap-3">{action}</div> : null}
        </header>
        {children}
      </div>
    </section>
  );
}

interface PageHeaderProps {
  title: string;
  intro: string;
  back?: ReactNode;
  actions?: ReactNode;
  meta?: ReactNode;
}

export function PageHeader({ title, intro, back, actions, meta }: PageHeaderProps) {
  return (
    <header className="page-header">
      <Lattice className="page-header-lattice" />
      <div className="page-shell relative pt-10 pb-12 sm:pt-14 sm:pb-16">
        {back ? <div className="mb-6">{back}</div> : null}
        <h1 className="font-display text-[clamp(2.5rem,6vw,4rem)] font-extrabold leading-[1] tracking-[-0.04em] text-ink text-balance">
          {title}
        </h1>
        <p className="lead mt-5 max-w-[62ch]">{intro}</p>
        {meta ? <div className="mt-5">{meta}</div> : null}
        {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </header>
  );
}

import type { ReactNode } from "react";
import { Lattice } from "@/components/ui/lattice";
import { RailProgress } from "@/components/ui/rail-progress";
import { cn } from "@/lib/utils";

interface SectionProps {
  id: string;
  title: string;
  intro?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  band?: boolean;
  deep?: boolean;
  rail?: boolean;
}

export function Section({ id, title, intro, action, children, className, band = false, deep = false, rail = false }: SectionProps) {
  const headingId = `${id}-heading`;
  const head = (
    <header className={cn("section-head", rail && "section-head-rail")}>
      <div className="min-w-0">
        <h2 id={headingId} className="section-title">
          {title}
        </h2>
        {intro ? <p className="section-intro">{intro}</p> : null}
      </div>
      {action ? <div className="section-actions">{action}</div> : null}
      {rail ? <RailProgress /> : null}
    </header>
  );
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn("section-block", band && "band", deep && "band-deep", rail && "section-rail", className)}
    >
      {deep ? <Lattice className="band-deep-lattice" /> : null}
      <div className={cn("page-shell", deep && "relative")}>
        {rail ? (
          <div className="rail-grid">
            {head}
            <div className="min-w-0">{children}</div>
          </div>
        ) : (
          <>
            {head}
            {children}
          </>
        )}
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
  deep?: boolean;
}

export function PageHeader({ title, intro, back, actions, meta, deep = false }: PageHeaderProps) {
  return (
    <header className={cn("page-header", deep && "page-header-deep")}>
      <Lattice className="page-header-lattice" />
      <div className="page-shell relative pt-10 pb-12 sm:pt-14 sm:pb-16">
        {back ? <div className="mb-6">{back}</div> : null}
        <h1 className="font-heading text-[clamp(2.5rem,6vw,4rem)] font-extrabold leading-[1] tracking-[-0.012em] text-ink text-balance">
          {title}
        </h1>
        <p className="lead mt-5 max-w-[62ch]">{intro}</p>
        {meta ? <div className="mt-5">{meta}</div> : null}
        {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </header>
  );
}

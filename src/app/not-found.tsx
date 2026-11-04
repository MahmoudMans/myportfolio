import { ArrowLeft, Layers } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Lattice } from "@/components/ui/lattice";
import { SearchSiteButton } from "@/components/ui/not-found-actions";
import { QuarantineWindow } from "@/components/ui/quarantine-window";
import { pageCopy } from "@/data/sections";
import { ui } from "@/data/ui";

export default function NotFound() {
  return (
    <section className="hero">
      <Lattice className="hero-lattice" />
      <div className="page-shell relative grid min-h-[70svh] grid-cols-1 items-center gap-x-14 gap-y-12 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:py-20">
        <div className="min-w-0">
          <p className="badge badge-outline w-fit">{ui.notFound.code}</p>
          <h1 className="mt-4 max-w-[18ch] font-heading text-[clamp(2.5rem,7vw,4.5rem)] font-extrabold leading-[0.98] tracking-[-0.012em] text-ink text-balance">
            {pageCopy.notFound.title}
          </h1>
          <p className="lead mt-5 max-w-[56ch]">{pageCopy.notFound.body}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/" icon={<ArrowLeft aria-hidden="true" className="size-4" />}>
              {ui.notFound.home}
            </ButtonLink>
            <SearchSiteButton label={ui.notFound.search} />
            <ButtonLink href="/projects" variant="ghost" icon={<Layers aria-hidden="true" className="size-4" />}>
              {ui.notFound.projects}
            </ButtonLink>
          </div>
        </div>
        <QuarantineWindow />
      </div>
    </section>
  );
}

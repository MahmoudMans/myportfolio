import { ArrowLeft, Layers } from "lucide-react";
import { OctagramMark } from "@/components/icons/brand-icons";
import { ButtonLink } from "@/components/ui/button-link";
import { Lattice } from "@/components/ui/lattice";
import { SearchSiteButton } from "@/components/ui/not-found-actions";
import { pageCopy } from "@/data/sections";
import { ui } from "@/data/ui";

export default function NotFound() {
  return (
    <section className="hero">
      <Lattice className="hero-lattice" />
      <div className="page-shell relative flex min-h-[70svh] flex-col justify-center py-20">
        <span className="brand-mark size-14 rounded-2xl" aria-hidden="true">
          <OctagramMark className="size-8" />
        </span>
        <p className="badge badge-outline mt-8 w-fit">{ui.notFound.code}</p>
        <h1 className="mt-4 max-w-[18ch] font-display text-[clamp(2.5rem,7vw,4.5rem)] font-extrabold leading-[0.98] tracking-[-0.04em] text-ink text-balance">
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
    </section>
  );
}

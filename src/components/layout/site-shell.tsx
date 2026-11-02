import type { ReactNode } from "react";
import { BackToTop } from "@/components/layout/back-to-top";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CommandPalette } from "@/components/palette/command-palette";
import { Providers } from "@/components/providers/providers";
import { mainNav } from "@/data/navigation";
import { profile } from "@/data/profile";
import { site } from "@/data/site";
import { ui } from "@/data/ui";
import { buildPaletteItems } from "@/lib/palette-items";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <a href="#main-content" className="skip-link">
        {ui.skipToContent}
      </a>
      <SiteHeader nav={mainNav} name={profile.name} role={profile.role} />
      <main id="main-content" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <SiteFooter />
      <BackToTop label={ui.backToTop} />
      <CommandPalette items={buildPaletteItems()} cvHref="/cv.pdf" cvFileName={site.cvFileName} />
    </Providers>
  );
}

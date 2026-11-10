import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Sora } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { Atmosphere, BootScreen, Overlays, ReportDialog, StatusStrip, TerminalWindow, ViewerDialog } from "@/components/console/chrome";
import { SiteFooter } from "@/components/console/footer";
import { Rail } from "@/components/console/rail";
import { RuntimeHost } from "@/components/console/runtime-host";
import { consoleCopy } from "@/data/console";
import { site } from "@/data/site";
import { consoleData, HOME } from "@/lib/console/content";
import { ogImage } from "@/lib/metadata";

const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-plex",
});

const sansFont = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  display: "swap",
  variable: "--font-sora",
});

/* Runs before the first paint: decides whether the boot sequence plays, and hides content that is typed in
   later. If the page script has not started after six seconds, everything is shown as plain text instead. */
const PREPAINT = `(function(){var d=document.documentElement;d.classList.add('js');var p=true;try{p=!localStorage.getItem('secfolio:boot')&&!matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){}if(p)d.classList.add('booting');setTimeout(function(){if(d.getAttribute('data-runtime')!=='ready'){d.setAttribute('data-fallback','1');d.classList.remove('js','booting')}},6000)})();`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords: site.keywords,
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: site.locale,
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: [ogImage.url],
  },
};

export const viewport: Viewport = {
  themeColor: "#05070a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const data = consoleData();
  return (
    <html lang="en" className={`${monoFont.variable} ${sansFont.variable}`} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREPAINT }} />
      </head>
      <body>
        <a className="skip" href="#main">
          {consoleCopy.skipToContent}
        </a>
        <Atmosphere />
        <BootScreen />
        <StatusStrip />
        <Rail home={HOME} sections={data.sections} cvFileName={site.cvFileName} />
        <div className="shell">
          <main id="main">{children}</main>
          <SiteFooter />
        </div>
        <TerminalWindow />
        <ReportDialog />
        <ViewerDialog />
        <Overlays />
        <RuntimeHost data={data} />
      </body>
    </html>
  );
}

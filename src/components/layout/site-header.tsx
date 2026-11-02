"use client";

import { m, useScroll, useSpring } from "motion/react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { OctagramMark } from "@/components/icons/brand-icons";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { PaletteTrigger } from "@/components/palette/palette-trigger";
import { useDialog } from "@/components/ui/use-dialog";
import { ui } from "@/data/ui";
import type { NavItem } from "@/types";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  nav: NavItem[];
  name: string;
  role: string;
}

function useActiveSection(key: string): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (key.length === 0) return;
    const ids = key.split(",");
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.35;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      let current: string | null = null;
      for (const id of ids) {
        const element = document.getElementById(id);
        if (element !== null && element.getBoundingClientRect().top <= line) current = id;
      }
      if (atBottom) current = ids[ids.length - 1] ?? current;
      setActive(current);
    };
    const schedule = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, [key]);

  return active;
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 160, damping: 30, restDelta: 0.001 });
  return <m.div aria-hidden="true" className="scroll-progress" style={{ scaleX }} />;
}

export function SiteHeader({ nav, name, role }: SiteHeaderProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const sectionKey = isHome ? nav.map((item) => item.section).join(",") : "";
  const activeSection = useActiveSection(sectionKey);
  const matched = nav.find((item) => item.match !== undefined && pathname.startsWith(item.match));
  const active = isHome ? activeSection : (matched?.section ?? null);

  const [menuPath, setMenuPath] = useState<string | null>(null);
  const menuOpen = menuPath === pathname;
  const closeMenu = useCallback(() => setMenuPath(null), []);
  const dialogRef = useDialog(menuOpen, closeMenu);

  return (
    <header className="site-header">
      <ScrollProgress />
      <div className="page-shell flex h-16 items-center gap-4">
        <Link href="/" className="brand-link" aria-label={ui.homeLabel}>
          <span className="brand-mark" aria-hidden="true">
            <OctagramMark className="size-5" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-[0.9375rem] font-bold tracking-tight text-ink">{name}</span>
            <span className="mt-1 hidden text-xs text-ink-3 sm:block">{role}</span>
          </span>
        </Link>

        <nav aria-label={ui.primaryNav} className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {nav.map((item) => {
              const current = active === item.section;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={current ? (isHome ? "location" : "page") : undefined}
                    className={cn("nav-link", current && "nav-link-active")}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1.5 lg:ml-2">
          <PaletteTrigger />
          <ThemeToggle />
          <button
            type="button"
            className="icon-button lg:hidden"
            aria-label={ui.openMenu}
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            onClick={() => setMenuPath(pathname)}
          >
            <Menu aria-hidden="true" className="size-5" />
          </button>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        aria-label={ui.menuTitle}
        className="mobile-menu"
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
      >
        <div className="mobile-menu-panel">
          <div className="flex h-16 items-center justify-between px-5">
            <p className="font-display text-sm font-semibold text-ink-3">{ui.menuTitle}</p>
            <button type="button" className="icon-button" aria-label={ui.closeMenu} onClick={() => dialogRef.current?.close()}>
              <X aria-hidden="true" className="size-5" />
            </button>
          </div>
          <nav aria-label={ui.primaryNav} className="px-5 pb-8">
            <ul className="flex flex-col">
              {nav.map((item, index) => {
                const current = active === item.section;
                return (
                  <li key={item.href} className="mobile-menu-item" style={{ animationDelay: `${60 + index * 35}ms` }}>
                    <Link
                      href={item.href}
                      onClick={() => dialogRef.current?.close()}
                      aria-current={current ? (isHome ? "location" : "page") : undefined}
                      className={cn("mobile-nav-link", current && "mobile-nav-link-active")}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </dialog>
    </header>
  );
}

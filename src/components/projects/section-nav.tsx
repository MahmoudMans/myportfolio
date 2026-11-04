"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/browser";
import { cn } from "@/lib/utils";

export interface SectionNavItem {
  id: string;
  label: string;
}

interface SectionNavProps {
  title: string;
  label: string;
  items: SectionNavItem[];
}

export function SectionNav({ title, label, items }: SectionNavProps) {
  const navRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const nav = navRef.current;
    if (nav === null || items.length === 0) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const stickyTop = parseFloat(window.getComputedStyle(nav).top) || 0;
      setStuck(nav.getBoundingClientRect().top <= stickyTop + 0.5);
      const line = window.innerHeight * 0.35;
      let current: string | null = null;
      for (const item of items) {
        const section = document.getElementById(item.id);
        if (section !== null && section.getBoundingClientRect().top <= line) current = item.id;
      }
      setActive(current);
      const first = document.getElementById(items[0].id);
      const last = document.getElementById(items[items.length - 1].id);
      if (first !== null && last !== null) {
        const start = first.getBoundingClientRect().top + window.scrollY - line;
        const end = last.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
        const read = end > start ? (window.scrollY - start) / (end - start) : 1;
        nav.style.setProperty("--read", Math.min(1, Math.max(0, read)).toFixed(3));
      }
    };
    const schedule = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, [items]);

  useEffect(() => {
    const list = listRef.current;
    if (list === null || active === null) return;
    const link = list.querySelector<HTMLElement>(`[data-section="${active}"]`);
    if (link === null) return;
    const left = link.offsetLeft;
    const right = left + link.offsetWidth;
    if (left < list.scrollLeft || right > list.scrollLeft + list.clientWidth) {
      list.scrollTo({ left: Math.max(0, left - 16), behavior: prefersReducedMotion() ? "auto" : "smooth" });
    }
  }, [active]);

  return (
    <nav ref={navRef} aria-label={label} className={cn("section-nav", stuck && "section-nav-stuck")}>
      <div className="page-shell section-nav-inner">
        <p className="section-nav-title" aria-hidden="true">
          {title}
        </p>
        <ol ref={listRef} className="section-nav-list">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                data-section={item.id}
                aria-current={active === item.id ? "location" : undefined}
                className={cn("section-nav-link", active === item.id && "section-nav-link-active")}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </div>
      <span className="section-nav-progress" aria-hidden="true" />
    </nav>
  );
}

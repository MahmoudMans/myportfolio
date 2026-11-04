"use client";

import { useEffect, useRef } from "react";

export function RailProgress() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const bar = ref.current;
    if (bar === null) return;
    const section = bar.closest("section");
    if (section === null) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const view = window.innerHeight;
      const span = rect.height - view * 0.4;
      const progress = span > 0 ? Math.min(1, Math.max(0, (view * 0.35 - rect.top) / span)) : 1;
      bar.style.setProperty("--progress", progress.toFixed(3));
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
  }, []);

  return (
    <span ref={ref} className="rail-progress" aria-hidden="true">
      <span />
    </span>
  );
}

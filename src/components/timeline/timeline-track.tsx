"use client";

import { m, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useRef, type ReactNode, type RefObject } from "react";
import { useHydrated } from "@/components/ui/use-hydrated";

function DrawnLine({ target }: { target: RefObject<HTMLDivElement | null> }) {
  const { scrollYProgress } = useScroll({ target, offset: ["start 75%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 26, restDelta: 0.001 });
  return <m.div aria-hidden="true" className="timeline-line timeline-line-drawn" style={{ scaleY }} />;
}

export function TimelineTrack({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const hydrated = useHydrated();
  const reduceMotion = useReducedMotion();

  return (
    <div ref={ref} className="relative">
      <div aria-hidden="true" className="timeline-line" />
      {hydrated && reduceMotion === false ? <DrawnLine target={ref} /> : null}
      {hydrated && reduceMotion ? <div aria-hidden="true" className="timeline-line timeline-line-static" /> : null}
      {children}
    </div>
  );
}

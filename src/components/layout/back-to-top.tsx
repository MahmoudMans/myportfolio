"use client";

import { AnimatePresence, m } from "motion/react";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/browser";

export function BackToTop({ label }: { label: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setVisible(window.scrollY > window.innerHeight * 1.2);
    };
    const schedule = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, []);

  function handleClick() {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    const target = document.getElementById("main-content");
    target?.focus({ preventScroll: true });
  }

  return (
    <AnimatePresence>
      {visible ? (
        <m.button
          key="back-to-top"
          type="button"
          onClick={handleClick}
          aria-label={label}
          title={label}
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.9 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: "spring", stiffness: 420, damping: 30 }}
          className="back-to-top"
        >
          <ArrowUp aria-hidden="true" className="size-5" />
        </m.button>
      ) : null}
    </AnimatePresence>
  );
}

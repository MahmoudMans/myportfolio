"use client";

import { m } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";

let hasNavigated = false;

export default function Template({ children }: { children: ReactNode }) {
  const [animateIn] = useState(() => hasNavigated);

  useEffect(() => {
    hasNavigated = true;
  }, []);

  return (
    <m.div
      initial={animateIn ? { opacity: 0, y: 10 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
    >
      {children}
    </m.div>
  );
}

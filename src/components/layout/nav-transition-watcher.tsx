"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { settleNavigation } from "@/lib/browser";

export function NavTransitionWatcher() {
  const pathname = usePathname();

  useEffect(() => {
    settleNavigation();
  }, [pathname]);

  return null;
}

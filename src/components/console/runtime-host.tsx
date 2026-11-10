"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import type { ConsoleData } from "@/lib/console/content";
import { startChrome, startPage } from "@/lib/console/runtime";

export function RuntimeHost({ data }: { data: ConsoleData }) {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const routerRef = useRef(router);

  useEffect(() => {
    routerRef.current = router;
  }, [router]);

  useEffect(() => startChrome({ data, navigate: (href: string) => routerRef.current.push(href) }), [data]);

  useEffect(() => startPage({ path: pathname }), [pathname]);

  return null;
}

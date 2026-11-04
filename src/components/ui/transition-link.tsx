"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";
import { startNavTransition } from "@/lib/browser";

interface TransitionLinkProps {
  href: string;
  cover?: string;
  className?: string;
  children: ReactNode;
}

export function TransitionLink({ href, cover, className, children }: TransitionLinkProps) {
  const router = useRouter();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (event.defaultPrevented) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (startNavTransition(() => router.push(href), cover ?? null)) event.preventDefault();
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}

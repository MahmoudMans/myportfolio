"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import type { MouseEvent } from "react";
import { useHydrated } from "@/components/ui/use-hydrated";
import { ui } from "@/data/ui";
import { switchTheme } from "@/lib/browser";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const hydrated = useHydrated();
  const isDark = hydrated && resolvedTheme === "dark";
  const label = hydrated ? (isDark ? ui.theme.toLight : ui.theme.toDark) : ui.theme.toggle;

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    switchTheme(isDark ? "light" : "dark", setTheme, {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
  }

  return (
    <button type="button" onClick={handleClick} aria-label={label} title={label} className={cn("icon-button theme-toggle", className)}>
      <Sun aria-hidden="true" className="theme-icon theme-icon-sun size-[18px]" />
      <Moon aria-hidden="true" className="theme-icon theme-icon-moon size-[18px]" />
    </button>
  );
}

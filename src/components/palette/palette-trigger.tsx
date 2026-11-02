"use client";

import { Search } from "lucide-react";
import { useIsApple } from "@/components/ui/use-hydrated";
import { ui } from "@/data/ui";
import { PALETTE_OPEN_EVENT } from "@/lib/palette";
import { cn } from "@/lib/utils";

export function openPalette(): void {
  window.dispatchEvent(new Event(PALETTE_OPEN_EVENT));
}

export function ShortcutKeys({ className }: { className?: string }) {
  const apple = useIsApple();
  return (
    <span className={cn("items-center gap-1", className ?? "inline-flex")} aria-hidden="true">
      <kbd className="kbd">{apple ? "⌘" : "Ctrl"}</kbd>
      <kbd className="kbd">K</kbd>
    </span>
  );
}

export function PaletteTrigger({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={openPalette}
      className={cn("palette-trigger", className)}
      aria-haspopup="dialog"
      aria-label={ui.palette.title}
      aria-keyshortcuts="Control+K Meta+K"
    >
      <Search aria-hidden="true" className="size-4" />
      <span className="hidden xl:inline">{ui.palette.open}</span>
      <ShortcutKeys className="hidden sm:inline-flex" />
    </button>
  );
}

export function PaletteHint() {
  return (
    <p className="flex flex-wrap items-center gap-2 text-sm text-ink-3">
      <span>{ui.hero.paletteHintBefore}</span>
      <button
        type="button"
        onClick={openPalette}
        className="rounded-md"
        aria-label={ui.palette.title}
        aria-keyshortcuts="Control+K Meta+K"
      >
        <ShortcutKeys />
      </button>
      <span>{ui.hero.paletteHintAfter}</span>
    </p>
  );
}

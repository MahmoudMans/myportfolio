"use client";

import {
  ArrowRight,
  CornerDownLeft,
  Download,
  Hash,
  Layers,
  Moon,
  Newspaper,
  Search,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useState, type KeyboardEvent } from "react";
import { useDialog } from "@/components/ui/use-dialog";
import { ui } from "@/data/ui";
import { downloadFile, switchTheme } from "@/lib/browser";
import { PALETTE_OPEN_EVENT, searchPalette } from "@/lib/palette";
import type { PaletteGroup, PaletteItem } from "@/types";
import { cn } from "@/lib/utils";

const groupIcons: Record<PaletteGroup, LucideIcon> = {
  Sections: Hash,
  Pages: ArrowRight,
  Projects: Layers,
  Posts: Newspaper,
  Actions: Zap,
};

const actionIcons: Partial<Record<NonNullable<PaletteItem["action"]>, LucideIcon>> = {
  "download-cv": Download,
  "theme-dark": Moon,
};

interface CommandPaletteProps {
  items: PaletteItem[];
  cvHref: string;
  cvFileName: string;
}

export function CommandPalette({ items, cvHref, cvFileName }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const listId = useId();
  const close = useCallback(() => setOpen(false), []);
  const dialogRef = useDialog(open, close);

  const results = useMemo(() => searchPalette(items, query), [items, query]);
  const filtered = query.trim().length > 0;
  const safeIndex = results.length === 0 ? -1 : Math.min(activeIndex, results.length - 1);
  const activeItem = safeIndex >= 0 ? results[safeIndex] : undefined;

  const show = useCallback(() => {
    setQuery("");
    setActiveIndex(0);
    setOpen(true);
  }, []);

  useEffect(() => {
    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (dialogRef.current?.open) dialogRef.current.close();
        else show();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener(PALETTE_OPEN_EVENT, show);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener(PALETTE_OPEN_EVENT, show);
    };
  }, [dialogRef, show]);

  useEffect(() => {
    if (activeItem === undefined) return;
    document.getElementById(`${listId}-${activeItem.id}`)?.scrollIntoView({ block: "nearest" });
  }, [activeItem, listId]);

  function run(item: PaletteItem) {
    dialogRef.current?.close();
    if (item.href !== undefined) {
      router.push(item.href);
      return;
    }
    switch (item.action) {
      case "toggle-theme":
        switchTheme(resolvedTheme === "dark" ? "light" : "dark", setTheme);
        break;
      case "theme-light":
        switchTheme("light", setTheme);
        break;
      case "theme-dark":
        switchTheme("dark", setTheme);
        break;
      case "theme-system":
        setTheme("system");
        break;
      case "download-cv":
        downloadFile(cvHref, cvFileName);
        break;
      default:
        break;
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex(results.length === 0 ? 0 : (safeIndex + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex(results.length === 0 ? 0 : (safeIndex - 1 + results.length) % results.length);
    } else if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(Math.max(0, results.length - 1));
    } else if (event.key === "Enter" && activeItem !== undefined) {
      event.preventDefault();
      run(activeItem);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label={ui.palette.title}
      className="palette"
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
    >
      <div className="palette-panel">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search aria-hidden="true" className="size-5 shrink-0 text-ink-3" />
          <input
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={activeItem ? `${listId}-${activeItem.id}` : undefined}
            aria-label={ui.palette.title}
            placeholder={ui.palette.placeholder}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoComplete="off"
            className="h-14 w-full bg-transparent font-display text-base text-ink outline-none placeholder:text-ink-3"
          />
          <kbd className="kbd hidden sm:inline-flex">Esc</kbd>
        </div>

        <p className="sr-only" aria-live="polite">
          {results.length} {ui.palette.results}
        </p>

        <ul id={listId} role="listbox" aria-label={ui.palette.title} className="palette-list">
          {results.map((item, index) => {
            const Icon = (item.action && actionIcons[item.action]) || groupIcons[item.group];
            const previous = index > 0 ? results[index - 1] : undefined;
            const showGroup = filtered === false && (previous === undefined || previous.group !== item.group);
            const selected = index === safeIndex;
            return (
              <li key={item.id} role="presentation">
                {showGroup ? (
                  <p className="px-3 pb-1.5 pt-4 font-display text-xs font-semibold text-ink-3" aria-hidden="true">
                    {item.group}
                  </p>
                ) : null}
                <div
                  id={`${listId}-${item.id}`}
                  role="option"
                  aria-selected={selected}
                  onMouseMove={() => {
                    if (index !== safeIndex) setActiveIndex(index);
                  }}
                  onClick={() => run(item)}
                  className={cn("palette-option", selected && "palette-option-active")}
                >
                  <Icon aria-hidden="true" className="size-4 shrink-0" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-[0.9375rem] font-medium">{item.label}</span>
                    <span className="block truncate text-xs text-ink-3">{filtered ? `${item.group}, ${item.hint}` : item.hint}</span>
                  </span>
                  {selected ? <CornerDownLeft aria-hidden="true" className="size-4 shrink-0 text-accent" /> : null}
                </div>
              </li>
            );
          })}
        </ul>

        {results.length === 0 ? <p className="px-5 py-10 text-center text-sm text-ink-2">{ui.palette.empty}</p> : null}

        <div className="hidden items-center gap-5 border-t border-line px-4 py-2.5 text-xs text-ink-3 sm:flex">
          <span className="inline-flex items-center gap-1.5">
            <kbd className="kbd">↑</kbd>
            <kbd className="kbd">↓</kbd>
            {ui.palette.navigate}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <kbd className="kbd">Enter</kbd>
            {ui.palette.select}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <kbd className="kbd">Esc</kbd>
            {ui.palette.close}
          </span>
        </div>
      </div>
    </dialog>
  );
}

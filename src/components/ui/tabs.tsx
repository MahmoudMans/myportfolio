"use client";

import { m } from "motion/react";
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  label: string;
  items: TabItem[];
}

export function Tabs({ label, items }: TabsProps) {
  const baseId = useId();
  const [active, setActive] = useState(items[0]?.id ?? "");
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());

  function focusTab(index: number) {
    const item = items[(index + items.length) % items.length];
    if (item === undefined) return;
    setActive(item.id);
    tabRefs.current.get(item.id)?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = items.findIndex((item) => item.id === active);
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      focusTab(index + 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      focusTab(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusTab(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusTab(items.length - 1);
    }
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={handleKeyDown}
        className="relative grid grid-cols-2 gap-1 overflow-x-auto rounded-2xl border border-line bg-surface p-1 shadow-[var(--shadow-soft)] [scrollbar-width:none] sm:inline-flex sm:w-fit sm:max-w-full sm:rounded-full"
      >
        {items.map((item) => {
          const selected = item.id === active;
          return (
            <button
              key={item.id}
              ref={(node) => {
                if (node === null) tabRefs.current.delete(item.id);
                else tabRefs.current.set(item.id, node);
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(item.id)}
              className={cn(
                "relative h-10 shrink-0 whitespace-nowrap rounded-xl px-4 font-display text-[0.9375rem] font-semibold transition-colors sm:rounded-full",
                selected ? "text-paper" : "text-ink-2 hover:text-ink",
              )}
            >
              {selected ? (
                <m.span
                  layoutId={`${baseId}-indicator`}
                  className="absolute inset-0 rounded-xl bg-ink sm:rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              ) : null}
              <span className="relative">{item.label}</span>
            </button>
          );
        })}
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${baseId}-panel-${item.id}`}
          aria-labelledby={`${baseId}-tab-${item.id}`}
          hidden={item.id !== active}
          tabIndex={0}
          className="pt-10 focus-visible:outline-offset-8"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}

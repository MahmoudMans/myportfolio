import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { ui } from "@/data/ui";

export function ShowMore({ count, noun, children }: { count: number; noun: string; children: ReactNode }) {
  return (
    <details className="more">
      <summary className="more-toggle">
        <span className="more-closed">
          {ui.more.show} {count} {ui.more.more} {noun}
        </span>
        <span className="more-open">{ui.more.fewer}</span>
        <ChevronDown aria-hidden="true" className="more-icon size-4" />
      </summary>
      {children}
    </details>
  );
}

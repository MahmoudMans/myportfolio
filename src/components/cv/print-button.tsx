"use client";

import { Icon } from "@/components/console/icon";

export function PrintButton({ label }: { label: string }) {
  return (
    <button className="btn" type="button" onClick={() => window.print()}>
      <Icon name="printer" /> {label}
    </button>
  );
}

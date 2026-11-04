"use client";

import { Printer } from "lucide-react";

export function PrintButton({ label }: { label: string }) {
  return (
    <button type="button" onClick={() => window.print()} className="btn btn-secondary">
      <Printer aria-hidden="true" className="size-4" />
      <span>{label}</span>
    </button>
  );
}

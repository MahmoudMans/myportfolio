"use client";

import { Search } from "lucide-react";
import { openPalette } from "@/components/palette/palette-trigger";

export function SearchSiteButton({ label }: { label: string }) {
  return (
    <button type="button" onClick={openPalette} className="btn btn-secondary">
      <Search aria-hidden="true" className="size-4" />
      <span>{label}</span>
    </button>
  );
}

import type { PaletteGroup, PaletteItem } from "@/types";
import { normalize } from "@/lib/utils";

export const PALETTE_OPEN_EVENT = "portfolio:open-palette";

export const paletteGroups: PaletteGroup[] = ["Sections", "Pages", "Projects", "Posts", "Actions"];

function score(item: PaletteItem, terms: string[]): number {
  const label = normalize(item.label);
  const haystack = [label, normalize(item.hint), ...item.keywords.map(normalize)].join(" ");
  if (terms.every((term) => haystack.includes(term)) === false) return 0;
  const first = terms[0] ?? "";
  if (label.startsWith(first)) return 4;
  if (label.split(" ").some((word) => word.startsWith(first))) return 3;
  if (label.includes(first)) return 2;
  return 1;
}

export function searchPalette(items: PaletteItem[], query: string): PaletteItem[] {
  const cleaned = normalize(query);
  if (cleaned.length === 0) return items;
  const terms = cleaned.split(/\s+/);
  return items
    .map((item, index) => ({ item, index, rank: score(item, terms) }))
    .filter((entry) => entry.rank > 0)
    .sort((a, b) => b.rank - a.rank || a.index - b.index)
    .map((entry) => entry.item);
}

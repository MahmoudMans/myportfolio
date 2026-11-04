import type { CSSProperties } from "react";
import { lattice } from "@/lib/geometry";
import { cn } from "@/lib/utils";

const SPACING = 96;

interface LatticeProps {
  className?: string;
  columns?: number;
  rows?: number;
  draw?: boolean;
}

export function Lattice({ className, columns = 9, rows = 7, draw = false }: LatticeProps) {
  const width = columns * SPACING;
  const height = rows * SPACING;
  const stars = lattice(columns, rows, SPACING, [width / 2, height / 2]);
  return (
    <svg className={cn(className, draw && "lattice-draw")} viewBox={`0 0 ${width} ${height}`} aria-hidden="true" focusable="false">
      {stars.map((star) =>
        draw ? (
          <path key={star.id} d={star.d} pathLength={1} style={{ "--d": star.delay } as CSSProperties} />
        ) : (
          <path key={star.id} d={star.d} />
        ),
      )}
    </svg>
  );
}

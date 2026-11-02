import { lattice } from "@/lib/geometry";

const SPACING = 96;

interface LatticeProps {
  className?: string;
  columns?: number;
  rows?: number;
}

export function Lattice({ className, columns = 9, rows = 7 }: LatticeProps) {
  const width = columns * SPACING;
  const height = rows * SPACING;
  const stars = lattice(columns, rows, SPACING, [width / 2, height / 2]);
  return (
    <svg className={className} viewBox={`0 0 ${width} ${height}`} aria-hidden="true" focusable="false">
      {stars.map((star) => (
        <path key={star.id} d={star.d} />
      ))}
    </svg>
  );
}

export type Point = [number, number];

const INNER_RATIO = Math.cos(Math.PI / 4) / Math.cos(Math.PI / 8);

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

export function octagram(cx: number, cy: number, outer: number): Point[] {
  const inner = outer * INNER_RATIO;
  return Array.from({ length: 16 }, (_, index) => {
    const angle = ((-90 + index * 22.5) * Math.PI) / 180;
    const radius = index % 2 === 0 ? outer : inner;
    const point: Point = [round(cx + radius * Math.cos(angle)), round(cy + radius * Math.sin(angle))];
    return point;
  });
}

export function toPath(points: Point[]): string {
  return `${points.map(([x, y], index) => `${index === 0 ? "M" : "L"}${x} ${y}`).join(" ")} Z`;
}

export interface LatticeStar {
  id: string;
  d: string;
  delay: number;
}

export function lattice(columns: number, rows: number, spacing: number, focus: Point): LatticeStar[] {
  const stars: LatticeStar[] = [];
  const radius = spacing / 2;
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const cx = column * spacing + radius;
      const cy = row * spacing + radius;
      const distance = Math.hypot(cx - focus[0], cy - focus[1]);
      stars.push({
        id: `${row}-${column}`,
        d: toPath(octagram(cx, cy, radius)),
        delay: Math.round(distance * 1.4),
      });
    }
  }
  return stars;
}

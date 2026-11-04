import { octagram, toPath } from "@/lib/geometry";
import { cn } from "@/lib/utils";

const SIZE = 600;
const CENTER = SIZE / 2;
const OUTER = toPath(octagram(CENTER, CENTER, 292));
const MIDDLE = toPath(octagram(CENTER, CENTER, 228));
const INNER = toPath(octagram(CENTER, CENTER, 150));

export function Rosette({ className }: { className?: string }) {
  return (
    <svg className={cn("rosette", className)} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true" focusable="false">
      <path d={OUTER} />
      <path d={OUTER} className="rosette-warm" transform={`rotate(22.5 ${CENTER} ${CENTER})`} />
      <path d={MIDDLE} className="rosette-soft" />
      <path d={INNER} className="rosette-soft rosette-warm" transform={`rotate(22.5 ${CENTER} ${CENTER})`} />
    </svg>
  );
}

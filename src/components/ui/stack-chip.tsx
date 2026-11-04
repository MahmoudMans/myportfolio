import Link from "next/link";
import { ui } from "@/data/ui";
import { stackHref } from "@/lib/stack";

export function StackChip({ name, count, minimum = 1 }: { name: string; count: number; minimum?: number }) {
  if (count < minimum) {
    return <span className="skill-chip">{name}</span>;
  }
  return (
    <Link href={stackHref(name)} className="skill-chip skill-chip-link">
      <span>{name}</span>
      <span className="skill-chip-count">
        {count}
        <span className="sr-only"> {count === 1 ? ui.skills.project : ui.skills.projects}</span>
      </span>
    </Link>
  );
}

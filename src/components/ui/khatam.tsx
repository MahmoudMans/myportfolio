import { octagram, toPath } from "@/lib/geometry";
import { cn } from "@/lib/utils";

const STAR = toPath(octagram(12, 12, 10));

export function Khatam({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={cn("khatam", className)}>
      <path d={STAR} />
    </svg>
  );
}

export function MarkedName({ name }: { name: string }) {
  const split = name.lastIndexOf(" ");
  const head = split === -1 ? "" : name.slice(0, split + 1);
  const tail = split === -1 ? name : name.slice(split + 1);
  return (
    <>
      {head}
      <span className="whitespace-nowrap">
        {tail}
        <Khatam className="name-mark" />
      </span>
    </>
  );
}

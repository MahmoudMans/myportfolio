import { cn } from "@/lib/utils";

interface TagListProps {
  items: string[];
  label: string;
  className?: string;
  tone?: "neutral" | "accent";
  variant?: "chips" | "inline";
}

export function TagList({ items, label, className, tone = "neutral", variant = "chips" }: TagListProps) {
  if (variant === "inline") {
    return (
      <ul aria-label={label} className={cn("inline-list", tone === "accent" && "inline-list-strong", className)}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }
  return (
    <ul aria-label={label} className={cn("flex flex-wrap gap-1.5", className)}>
      {items.map((item) => (
        <li key={item} className={tone === "accent" ? "tag tag-accent" : "tag"}>
          {item}
        </li>
      ))}
    </ul>
  );
}

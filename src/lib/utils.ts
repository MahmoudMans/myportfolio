const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter((value) => typeof value === "string" && value.length > 0).join(" ");
}

export function formatYearMonth(value: string, style: "short" | "long" = "short"): string {
  const [year, month] = value.split("-");
  if (month === undefined) return year;
  const name = MONTHS[Number(month) - 1] ?? "";
  return `${style === "short" ? name.slice(0, 3) : name} ${year}`;
}

export function formatRange(start: string, end: string | null, presentLabel: string): string {
  return `${formatYearMonth(start)} – ${end === null ? presentLabel : formatYearMonth(end)}`;
}

export function formatDate(value: string): string {
  const [year, month, day] = value.split("-");
  const name = MONTHS[Number(month) - 1] ?? "";
  return `${name} ${Number(day)}, ${year}`;
}

export function yearOf(value: string): string {
  return value.slice(0, 4);
}

export function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

export function isExternal(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

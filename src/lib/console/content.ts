import { certifications } from "@/data/certifications";
import { communityEvents, communityRoles } from "@/data/community";
import { consoleCopy } from "@/data/console";
import { education } from "@/data/education";
import { experience } from "@/data/experience";
import { languages } from "@/data/languages";
import { now } from "@/data/now";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { research } from "@/data/research";
import { skillGroups } from "@/data/skills";
import { timeline } from "@/data/timeline";
import type { IconName } from "@/lib/console/icons";
import { postUrl } from "@/lib/posts";
import { stackUsage } from "@/lib/stack";
import type { ImageAsset, Project, ProjectTag } from "@/types";

export const HANDLE = consoleCopy.handle;
export const HOME = `/home/${HANDLE}`;
export const PROMPT = `visitor@${HANDLE}:~$`;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function pad(value: number, length = 2): string {
  return String(value).padStart(length, "0");
}

export function caseNumber(index: number): string {
  return `#${pad(index + 1, 3)}`;
}

export function monthLabel(yearMonth: string): string {
  const [year, month] = yearMonth.split("-");
  if (month === undefined) return year;
  return `${MONTHS[Number(month) - 1] ?? ""} ${year}`;
}

function parseMonthYear(value: string): string | null {
  const match = /^([A-Za-z]{3})[a-z]*\s+(\d{4})$/.exec(value.trim());
  if (match === null) return null;
  const index = MONTHS.findIndex((month) => month.toLowerCase() === match[1].toLowerCase());
  return index < 0 ? null : `${match[2]}-${pad(index + 1)}`;
}

function tenure(start: string, end: string | null): string {
  const [startYear, startMonth] = start.split("-").map(Number);
  const reference = end ?? `${new Date().getUTCFullYear()}-${pad(new Date().getUTCMonth() + 1)}`;
  const [endYear, endMonth] = reference.split("-").map(Number);
  const months = Math.max(1, (endYear - startYear) * 12 + (endMonth - startMonth) + 1);
  const years = Math.floor(months / 12);
  const rest = months % 12;
  return [years ? `${years} yr${years > 1 ? "s" : ""}` : "", rest ? `${rest} mo${rest > 1 ? "s" : ""}` : ""].filter(Boolean).join(" ");
}

function shortInstitution(name: string): string {
  const match = /\(([^)]+)\)/.exec(name);
  return match ? match[1] : name;
}

function hostOf(href: string): string {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
}

/* ───────── Hero and profile ───────── */

const currentJob = experience.find((item) => item.end === null);
const currentStudy = education.find((item) => item.end.toLowerCase() === "present");

export const currentRole = currentJob ? `${currentJob.role}, ${currentJob.organization}` : profile.role;
export const studyLine = currentStudy ? `${currentStudy.degree}, ${shortInstitution(currentStudy.institution)}` : "";
export const linkedIn = profile.socials.find((social) => social.kind === "linkedin");
export const gitHub = profile.socials.find((social) => social.kind === "github");

export interface KeyValue {
  key: string;
  value: string;
  live?: boolean;
}

export function heroMeta(): KeyValue[] {
  const labels = consoleCopy.hero.meta;
  return [
    { key: labels.location, value: profile.location },
    { key: labels.role, value: currentRole },
    studyLine ? { key: labels.study, value: studyLine } : null,
    { key: labels.status, value: profile.availability.label, live: true },
  ].filter((row): row is KeyValue => row !== null);
}

export interface Stat {
  value: string;
  label: string;
}

export function profileStats(): Stat[] {
  const internships = experience.filter((item) => item.kind === "Internship" || item.kind === "Research");
  const since = Math.min(...internships.map((item) => Number(item.start.slice(0, 4))));
  return [
    { value: String(internships.length), label: `internships since ${since}` },
    { value: String(projects.length), label: "projects in the case files" },
    { value: String(certifications.length), label: "certificates and badges" },
  ];
}

export function identityRows(): KeyValue[] {
  const rows = consoleCopy.about.rows;
  return [
    { key: rows.role, value: profile.role },
    { key: rows.now, value: currentRole },
    studyLine ? { key: rows.study, value: studyLine } : null,
    { key: rows.location, value: profile.location },
    { key: rows.timezone, value: profile.timezone },
    { key: rows.focus, value: profile.focus.map((item) => item.title).join(", ") },
    { key: rows.speaks, value: languages.map((language) => language.name).join(", ") },
    { key: rows.status, value: profile.availability.label },
  ].filter((row): row is KeyValue => row !== null);
}

/* ───────── Skills ───────── */

export interface AuditRow {
  name: string;
  count: number;
  share: number;
}

export function auditRows(limit = 8): AuditRow[] {
  return stackUsage(projects)
    .slice(0, limit)
    .map((use) => ({ name: use.name, count: use.count, share: Math.round((use.count / projects.length) * 100) }));
}

export interface RadarAxis {
  axis: string;
  count: number;
  value: number;
}

export function radarAxes(): RadarAxis[] {
  const max = Math.max(...skillGroups.map((group) => group.skills.length));
  return skillGroups.map((group) => ({
    axis: consoleCopy.radarAxes[group.id] ?? group.title,
    count: group.skills.length,
    value: Math.round((group.skills.length / max) * 100),
  }));
}

export interface ToolGroup {
  id: string;
  title: string;
  items: string[];
}

export function toolGroups(): ToolGroup[] {
  return skillGroups.map((group) => ({ id: group.id, title: group.title, items: group.skills.map((skill) => skill.name) }));
}

/* ───────── Projects ───────── */

export interface CaseLink {
  label: string;
  href: string;
}

export interface CaseFile {
  index: number;
  no: string;
  slug: string;
  title: string;
  kind: string;
  summary: string;
  tags: ProjectTag[];
  tech: string[];
  status: string;
  statusClass: "deployed" | "archived";
  objective: string;
  approach: string;
  resultsTitle: string;
  results: string[];
  links: CaseLink[];
  cover: ImageAsset;
  search: string;
  featured: boolean;
}

function caseResults(project: Project): { title: string; items: string[] } {
  const labels = consoleCopy.report;
  if (project.caseStudy?.results && project.caseStudy.results.length > 0) return { title: labels.results, items: project.caseStudy.results };
  if (project.facts && project.facts.length > 0) return { title: labels.facts, items: project.facts.map((fact) => `${fact.label}: ${fact.value}`) };
  return { title: labels.features, items: project.features.slice(0, 5) };
}

export function toCaseFile(project: Project, index: number): CaseFile {
  const isPublic = project.links.some((link) => link.kind === "github");
  const results = caseResults(project);
  const objective = project.caseStudy?.problem[0] ?? project.description;
  const approach = project.caseStudy?.approach?.[0] ?? (project.caseStudy ? project.description : "");
  return {
    index,
    no: caseNumber(index),
    slug: project.slug,
    title: project.title,
    kind: project.kind,
    summary: project.summary,
    tags: project.tags,
    tech: project.stack,
    status: isPublic ? consoleCopy.cases.public : consoleCopy.cases.private,
    statusClass: isPublic ? "deployed" : "archived",
    objective,
    approach,
    resultsTitle: results.title,
    results: results.items,
    links: project.links.map((link) => ({ label: link.label, href: link.href })),
    cover: project.cover,
    search: [project.title, project.kind, ...project.stack, ...project.tags].join(" ").toLowerCase(),
    featured: project.featured,
  };
}

export const caseFiles: CaseFile[] = projects.map(toCaseFile);

export function tagCounts(files: CaseFile[]): { tag: string; count: number }[] {
  const order: string[] = [];
  const counts = new Map<string, number>();
  for (const file of files) {
    for (const tag of file.tags) {
      if (!counts.has(tag)) order.push(tag);
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  const preferred = ["Security", "AI", "Web", "Mobile", "DevOps"];
  order.sort((a, b) => (preferred.indexOf(a) + 99) % 99 - (preferred.indexOf(b) + 99) % 99);
  return order.map((tag) => ({ tag, count: counts.get(tag) ?? 0 }));
}

/* ───────── Career log ───────── */

export type Segment = string | { text: string; className: string };

export interface LogEntry {
  id: string;
  date: string;
  live?: boolean;
  segments: Segment[];
  meta: string;
  items: string[];
}

function stamp(date: string, time = "09:00:00"): Segment {
  return { text: `[${date.length === 7 ? `${date}-01` : date} ${time}]`, className: "ts" };
}

export function careerLog(): LogEntry[] {
  const words = consoleCopy.log;
  const entries: Array<LogEntry & { rank: number }> = [];

  experience.forEach((item, position) => {
    entries.push({
      id: `job-${item.id}`,
      date: item.start,
      rank: position,
      segments: [stamp(item.start), " ", { text: words.joined, className: "ev" }, " ", { text: item.organization, className: "who" }, ` ${words.as} `, { text: item.role, className: "who" }],
      meta: [`${monthLabel(item.start)} to ${item.end ? monthLabel(item.end) : words.present}`, tenure(item.start, item.end), item.location].join(", "),
      items: [...(item.highlights ?? []), ...(item.summary ? [item.summary] : [])],
    });
  });

  const graduations = new Set<string>();
  education.forEach((item, position) => {
    const start = parseMonthYear(item.start);
    const end = parseMonthYear(item.end);
    if (end === null && start !== null) {
      entries.push({
        id: `edu-${item.id}`,
        date: start,
        rank: 100 + position,
        segments: [stamp(start, "08:00:00"), " ", { text: words.enrolled, className: "ev" }, " ", { text: item.degree, className: "who" }, ` ${words.at} ${shortInstitution(item.institution)}`],
        meta: `${item.institution}, ${item.start} to ${words.present}, ${item.location}`,
        items: [],
      });
    } else if (end !== null) {
      graduations.add(end);
      const milestone = timeline.find((entry) => entry.kind === "Milestone" && entry.date === end);
      entries.push({
        id: `edu-${item.id}`,
        date: end,
        rank: 100 + position,
        segments: [stamp(end, "10:00:00"), " ", { text: words.graduated, className: "ev" }, " ", { text: item.degree, className: "who" }],
        meta: `${item.institution}, ${item.start} to ${item.end}, ${item.location}`,
        items: milestone ? [milestone.detail] : [],
      });
    }
  });

  timeline.forEach((entry, position) => {
    if (entry.kind !== "Community" && entry.kind !== "Milestone") return;
    if (entry.kind === "Milestone" && graduations.has(entry.date)) return;
    entries.push({
      id: `tl-${entry.id}`,
      date: entry.date,
      rank: 200 + position,
      segments: [stamp(entry.date, "18:00:00"), " ", { text: entry.kind === "Community" ? words.community : words.milestone, className: "ev" }, " ", { text: entry.title, className: "who" }],
      meta: entry.detail,
      items: [],
    });
  });

  entries.sort((a, b) => b.date.localeCompare(a.date) || a.rank - b.rank);
  const live: LogEntry = {
    id: "live",
    date: now.lastUpdated,
    live: true,
    segments: [stamp(now.lastUpdated, "09:00:00"), " ", { text: words.status, className: "ev" }, " ", { text: profile.availability.label, className: "who" }],
    meta: profile.availability.detail,
    items: [],
  };
  return [live, ...entries.map(({ rank: _rank, ...entry }) => entry)];
}

/* ───────── Badges ───────── */

export interface Badge {
  id: string;
  code: string;
  icon: IconName;
  name: string;
  issuer: string;
  year: string;
  type: string;
  proof: CaseLink | null;
}

export function badges(): Badge[] {
  const words = consoleCopy.badges;
  return certifications.map((item) => {
    const style = consoleCopy.badgeStyle[item.id];
    const proof: CaseLink | null = item.link
      ? { label: hostOf(item.link.href), href: item.link.href }
      : item.postId
        ? { label: words.linkedInPost, href: postUrl(item.postId) }
        : null;
    return {
      id: item.id,
      code: style?.code ?? item.name.split(/\s+/).slice(0, 2).join(" ").toUpperCase(),
      icon: style?.icon ?? "shield",
      name: item.name,
      issuer: item.issuer,
      year: item.date ? item.date.slice(0, 4) : words.undated,
      type: item.kind.toLowerCase(),
      proof,
    };
  });
}

/* ───────── Research and community ───────── */

export function researchCards(): { icon: IconName; title: string; body: string }[] {
  return research.interests.map((interest) => ({
    icon: consoleCopy.researchIcons[interest.icon] ?? "radar",
    title: interest.title,
    body: interest.body,
  }));
}

export function communityCards() {
  return communityRoles.map((role) => ({ ...role, glyph: consoleCopy.communityIcons[role.icon] ?? "nodes" }));
}

export function communityLog() {
  return communityEvents.map((event) => ({ ...event, href: postUrl(event.postId) }));
}

/* ───────── Data handed to the browser runtime ───────── */

export interface ConsoleData {
  name: string;
  handle: string;
  home: string;
  titles: string[];
  tagline: string;
  bio: string[];
  location: string;
  timezone: string;
  currentRole: string;
  study: string;
  focus: string[];
  availability: string;
  languages: string[];
  research: { title: string; body: string }[];
  goal: { title: string; body: string };
  skills: AuditRow[];
  toolGroups: ToolGroup[];
  projects: Array<Omit<CaseFile, "search" | "kind">>;
  experience: { date: string; line: string; meta: string }[];
  certifications: { code: string; name: string; issuer: string; year: string }[];
  community: { role: string; organization: string; period: string }[];
  contact: { email: string; linkedin: string; github: string };
  resumeUrl: string;
  sections: { id: string; label: string }[];
  soc: { home: { label: string; lon: number; lat: number }; uptime: string; responseTime: string };
  flagBase64: string;
  boot: string[];
}

export const HOME_SECTIONS = ["about", "research", "skills", "soc", "projects", "experience", "certs", "community", "contact"] as const;

function segmentText(segments: Segment[]): string {
  return segments.map((segment) => (typeof segment === "string" ? segment : segment.text)).join("");
}

export function consoleData(): ConsoleData {
  const sectionCopy = consoleCopy.sections as Record<string, { title: string }>;
  return {
    name: profile.name,
    handle: HANDLE,
    home: HOME,
    titles: consoleCopy.titles,
    tagline: profile.tagline,
    bio: profile.bio,
    location: profile.location,
    timezone: profile.timezone,
    currentRole,
    study: studyLine,
    focus: profile.focus.map((item) => item.title),
    availability: profile.availability.label,
    languages: languages.map((language) => language.name),
    research: research.interests.map((interest) => ({ title: interest.title, body: interest.body })),
    goal: { title: research.goal.title, body: research.goal.body },
    skills: auditRows(),
    toolGroups: toolGroups(),
    projects: caseFiles.map(({ search: _search, kind: _kind, ...file }) => file),
    experience: careerLog()
      .filter((entry) => !entry.live)
      .map((entry) => ({ date: entry.date, line: segmentText(entry.segments.slice(2)), meta: entry.meta })),
    certifications: badges().map((badge) => ({ code: badge.code, name: badge.name, issuer: badge.issuer, year: badge.year })),
    community: communityRoles.map((role) => ({ role: role.role, organization: role.organization, period: role.period })),
    contact: { email: profile.email, linkedin: linkedIn?.href ?? "", github: gitHub?.href ?? "" },
    resumeUrl: "/cv.pdf",
    sections: HOME_SECTIONS.map((id) => ({ id, label: sectionCopy[id]?.title ?? id })),
    soc: { home: consoleCopy.soc.home, uptime: consoleCopy.soc.uptime, responseTime: consoleCopy.soc.responseTime },
    flagBase64: consoleCopy.flagBase64,
    boot: [...consoleCopy.boot, `Identity verified: ${profile.name}`],
  };
}

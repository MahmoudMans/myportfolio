import type { PaletteItem } from "@/types";
import { mainNav, pages } from "@/data/navigation";
import { linkedInPosts } from "@/data/posts";
import { projects } from "@/data/projects";
import { sections } from "@/data/sections";
import { ui } from "@/data/ui";
import { formatDate } from "@/lib/utils";

export function buildPaletteItems(): PaletteItem[] {
  const sectionItems: PaletteItem[] = Object.values(sections).map((section) => ({
    id: `section-${section.id}`,
    group: "Sections",
    label: section.title,
    hint: section.intro ?? "",
    href: `/#${section.id}`,
    keywords: [section.id],
  }));

  const pageItems: PaletteItem[] = pages.map((page) => ({
    id: `page-${page.href}`,
    group: "Pages",
    label: page.label,
    hint: page.hint,
    href: page.href,
    keywords: page.keywords,
  }));

  const projectItems: PaletteItem[] = projects.map((project) => ({
    id: `project-${project.slug}`,
    group: "Projects",
    label: project.title,
    hint: project.summary,
    href: `/projects/${project.slug}`,
    keywords: [...project.tags, ...project.stack],
  }));

  const postItems: PaletteItem[] = linkedInPosts.map((post) => ({
    id: `post-${post.id}`,
    group: "Posts",
    label: post.title,
    hint: `${post.kind}, ${formatDate(post.date)}`,
    href: `/posts#post-${post.id}`,
    keywords: [post.kind, post.summary],
  }));

  const actionItems: PaletteItem[] = [
    { id: "action-toggle-theme", group: "Actions", label: ui.actions.toggleTheme, hint: "Theme", action: "toggle-theme", keywords: ["dark", "light", "mode"] },
    { id: "action-light", group: "Actions", label: ui.actions.lightTheme, hint: "Theme", action: "theme-light", keywords: ["light", "day"] },
    { id: "action-dark", group: "Actions", label: ui.actions.darkTheme, hint: "Theme", action: "theme-dark", keywords: ["dark", "night"] },
    { id: "action-system", group: "Actions", label: ui.actions.systemTheme, hint: "Theme", action: "theme-system", keywords: ["system", "auto", "os"] },
    { id: "action-download-cv", group: "Actions", label: ui.actions.downloadCv, hint: "PDF", action: "download-cv", keywords: ["resume", "cv", "pdf"] },
  ];

  const navKeywords = new Map(mainNav.map((item) => [item.section, item.label.toLowerCase()]));
  for (const item of sectionItems) {
    const extra = navKeywords.get(item.keywords[0] ?? "");
    if (extra) item.keywords.push(extra);
  }

  return [...sectionItems, ...pageItems, ...projectItems, ...postItems, ...actionItems];
}

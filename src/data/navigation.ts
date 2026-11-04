import type { NavItem } from "@/types";

export const mainNav: NavItem[] = [
  { label: "About", href: "/#about", section: "about" },
  { label: "Experience", href: "/#experience", section: "experience" },
  { label: "Projects", href: "/projects", section: "projects", match: "/projects" },
  { label: "Research", href: "/#research", section: "research" },
  { label: "Community", href: "/#community", section: "community", match: "/posts" },
  { label: "CV", href: "/cv", section: "cv", match: "/cv" },
  { label: "Contact", href: "/#contact", section: "contact" },
];

export const pages: { label: string; href: string; hint: string; keywords: string[] }[] = [
  { label: "Home", href: "/", hint: "Start page", keywords: ["start", "index", "landing"] },
  { label: "All projects", href: "/projects", hint: "Filter and search", keywords: ["work", "portfolio"] },
  { label: "CV", href: "/cv", hint: "Experience, education, skills, print", keywords: ["resume", "cv", "education", "print"] },
  { label: "LinkedIn posts", href: "/posts", hint: "Events, certifications, milestones", keywords: ["posts", "linkedin", "news", "activity"] },
];

export const footerLinks: { label: string; href: string }[] = [
  { label: "Projects", href: "/projects" },
  { label: "Research", href: "/#research" },
  { label: "Posts", href: "/posts" },
  { label: "CV", href: "/cv" },
  { label: "Contact", href: "/#contact" },
];

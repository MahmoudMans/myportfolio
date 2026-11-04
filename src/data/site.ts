import type { SiteConfig } from "@/types";

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");
  const host = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (host) return `https://${host}`;
  return "http://localhost:3000";
}

export const site: SiteConfig = {
  name: "Mahmoud Mansouri",
  title: "Mahmoud Mansouri, software engineer and cybersecurity student",
  description:
    "Software engineer and Master's student in cybersecurity at UIT, currently a cybersecurity intern at NoBreach, open to research opportunities and app development. Experience, projects, research interests, community work and CV.",
  url: resolveSiteUrl(),
  locale: "en_US",
  keywords: [
    "Mahmoud Mansouri",
    "cybersecurity",
    "software security",
    "vulnerability discovery",
    "systems security",
    "AI-assisted cybersecurity",
    "software engineer",
    "GDG Carthage",
    "Google Developer Groups",
    "Tunisia",
  ],
  ogImageAlt: "Mahmoud Mansouri, software engineer and cybersecurity student",
  ogTagline: "Software engineer and Master's student in cybersecurity.",
  footerNote: "Designed and built in Tunisia. Set in Bricolage Grotesque and Schibsted Grotesk.",
  cvFileName: "Mahmoud-Mansouri-CV.pdf",
};

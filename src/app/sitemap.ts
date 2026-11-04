import type { MetadataRoute } from "next";
import { now } from "@/data/now";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(`${now.lastUpdated}T00:00:00Z`);
  const pages: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/projects`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/cv`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/posts`, lastModified, changeFrequency: "monthly", priority: 0.5 },
  ];
  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${site.url}/projects/${project.slug}`,
    lastModified,
    changeFrequency: "yearly",
    priority: project.featured ? 0.8 : 0.6,
  }));
  return [...pages, ...projectPages];
}

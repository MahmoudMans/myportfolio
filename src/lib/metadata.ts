import type { Metadata } from "next";
import { site } from "@/data/site";

interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  tags?: string[];
}

export const ogImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: site.ogImageAlt,
};

export function pageMetadata({ title, description, path, type = "website", publishedTime, tags }: PageMetadataInput): Metadata {
  const openGraphBase = {
    title,
    description,
    url: path,
    siteName: site.name,
    locale: site.locale,
    images: [ogImage],
  };
  return {
    title,
    description,
    keywords: tags,
    alternates: { canonical: path },
    openGraph:
      type === "article"
        ? { ...openGraphBase, type: "article", publishedTime, authors: [site.name], tags }
        : { ...openGraphBase, type: "website" },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
  };
}

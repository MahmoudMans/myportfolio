import { linkedInPosts } from "@/data/posts";
import type { LinkedInPost } from "@/types";

export function postUrl(id: string): string {
  return `https://www.linkedin.com/feed/update/urn:li:activity:${id}/`;
}

export function getPost(id: string): LinkedInPost | undefined {
  return linkedInPosts.find((post) => post.id === id);
}

export function sortedPosts(): LinkedInPost[] {
  return [...linkedInPosts].sort((a, b) => b.date.localeCompare(a.date));
}

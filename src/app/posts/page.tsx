import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PostsExplorer } from "@/components/posts/posts-explorer";
import { PageHeader } from "@/components/ui/section";
import { postKinds } from "@/data/posts";
import { pageCopy, sections } from "@/data/sections";
import { pageMetadata } from "@/lib/metadata";
import { sortedPosts } from "@/lib/posts";

export const metadata: Metadata = pageMetadata({
  title: pageCopy.posts.title,
  description: pageCopy.posts.description,
  path: "/posts",
});

export default function PostsPage() {
  return (
    <>
      <PageHeader
        title={pageCopy.posts.title}
        intro={pageCopy.posts.intro}
        back={
          <Link href={`/#${sections.community.id}`} className="back-link">
            <ArrowLeft aria-hidden="true" className="size-4" />
            <span>{sections.community.title}</span>
          </Link>
        }
      />
      <div className="page-shell py-12 pb-24 sm:py-16">
        <PostsExplorer posts={sortedPosts()} kinds={postKinds} />
      </div>
    </>
  );
}

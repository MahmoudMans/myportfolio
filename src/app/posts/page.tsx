import type { Metadata } from "next";
import { SectionHead } from "@/components/console/section-head";
import { consoleCopy } from "@/data/console";
import { postKinds } from "@/data/posts";
import { pageCopy } from "@/data/sections";
import { pageMetadata } from "@/lib/metadata";
import { postUrl, sortedPosts } from "@/lib/posts";

export const metadata: Metadata = pageMetadata({
  title: pageCopy.posts.title,
  description: pageCopy.posts.description,
  path: "/posts",
});

export default function PostsPage() {
  const posts = sortedPosts();
  const copy = consoleCopy.posts;
  return (
    <section className="sec page-sec" id="posts" aria-labelledby="h-posts">
      <div className="wrap">
        <SectionHead copy={consoleCopy.pages.posts} headingId="h-posts" level={1} />
        <div className="filters" id="postFilters" role="group" aria-label={copy.filterLabel}>
          <button className="filter" type="button" data-filter="All" aria-pressed="true">
            {consoleCopy.cases.all}
            <span>{posts.length}</span>
          </button>
          {postKinds.map((kind) => (
            <button className="filter" type="button" data-filter={kind} aria-pressed="false" key={kind}>
              {kind}
              <span>{posts.filter((post) => post.kind === kind).length}</span>
            </button>
          ))}
        </div>
        <ol className="log posts-log" id="postLog">
          {posts.map((post) => (
            <li key={post.id} className="log-entry post reveal" data-cat={post.kind}>
              <h2 className="log-line">
                <span className="ts">[{post.date}]</span> <span className="ev">{post.kind.toUpperCase()}:</span>{" "}
                <span className="who">{post.title}</span>
              </h2>
              <p className="post-summary">{post.summary}</p>
              {post.sharedFrom ? (
                <p className="log-meta">
                  {copy.sharedFrom} {post.sharedFrom}
                </p>
              ) : null}
              <p className="post-links">
                <a href={postUrl(post.id)} target="_blank" rel="noopener noreferrer">
                  {copy.readOnLinkedIn}
                </a>
                {(post.links ?? []).map((link) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </a>
                ))}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

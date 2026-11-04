"use client";

import { m } from "motion/react";
import { useMemo, useState } from "react";
import { ResourceLinks } from "@/components/ui/resource-links";
import { ui } from "@/data/ui";
import type { LinkedInPost, PostKind, ResourceLink } from "@/types";
import { postUrl } from "@/lib/posts";
import { cn, formatDate, yearOf } from "@/lib/utils";

type Filter = PostKind | "All";

const kindBadge: Record<PostKind, string> = {
  Community: "badge badge-accent",
  Certification: "badge badge-success",
  Learning: "badge",
  Milestone: "badge badge-warning",
};

interface PostsExplorerProps {
  posts: LinkedInPost[];
  kinds: PostKind[];
}

function postLinks(post: LinkedInPost): ResourceLink[] {
  return [{ kind: "linkedin", label: ui.posts.readOnLinkedIn, href: postUrl(post.id) }, ...(post.links ?? [])];
}

export function PostsExplorer({ posts, kinds }: PostsExplorerProps) {
  const [filter, setFilter] = useState<Filter>("All");

  const visible = useMemo(() => posts.filter((post) => filter === "All" || post.kind === filter), [posts, filter]);
  const counts = useMemo(() => {
    const result = new Map<Filter, number>([["All", posts.length]]);
    for (const kind of kinds) result.set(kind, posts.filter((post) => post.kind === kind).length);
    return result;
  }, [posts, kinds]);
  const years = useMemo(() => {
    const groups = new Map<string, LinkedInPost[]>();
    for (const post of visible) {
      const year = yearOf(post.date);
      groups.set(year, [...(groups.get(year) ?? []), post]);
    }
    return [...groups.entries()];
  }, [visible]);

  const filters: Filter[] = ["All", ...kinds];

  return (
    <div>
      <div role="group" aria-label={ui.posts.filterLabel} className="flex flex-wrap gap-2">
        {filters.map((item) => {
          const selected = filter === item;
          return (
            <button
              key={item}
              type="button"
              aria-pressed={selected}
              onClick={() => setFilter(item)}
              className={cn("filter-chip", selected && "filter-chip-active")}
            >
              {selected ? (
                <m.span
                  layoutId="post-filter-highlight"
                  className="absolute inset-0 rounded-full bg-ink"
                  transition={{ type: "spring", stiffness: 480, damping: 38 }}
                />
              ) : null}
              <span className="relative">{item === "All" ? ui.posts.all : item}</span>
              <span className="relative tabular-nums opacity-70">{counts.get(item) ?? 0}</span>
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        {visible.length} {ui.posts.shown}
      </p>

      {years.map(([year, items]) => (
        <section key={year} aria-labelledby={`posts-${year}`} className="posts-group">
          <h2 id={`posts-${year}`} className="posts-year">
            <span className="sr-only">{ui.posts.year} </span>
            {year}
          </h2>
          <ol className="posts-list">
            {items.map((post) => (
              <li key={post.id}>
                <article id={`post-${post.id}`} className="post-card">
                  <p className="post-when">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                  </p>
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm">
                      <span className={kindBadge[post.kind]}>{post.kind}</span>
                      {post.sharedFrom ? (
                        <span className="text-ink-3">
                          {ui.posts.sharedFrom} {post.sharedFrom}
                        </span>
                      ) : null}
                    </p>
                    <h3 className="mt-2 font-heading text-lg font-bold leading-snug tracking-[-0.006em] text-ink sm:text-xl">{post.title}</h3>
                    <p className="copy-sm mt-1.5 max-w-[66ch]">{post.summary}</p>
                  </div>
                  <ResourceLinks links={postLinks(post)} label={`${post.title} links`} context={post.title} className="post-links" />
                </article>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}

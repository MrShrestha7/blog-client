import { posts } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";
import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";

/**
 * Tags page displays posts that have a specific tag
 * URL format: /tags/[tag] (e.g., /tags/dev-tools)
 * Tags are case-insensitive and spaces are replaced with hyphens
 */
export default async function Page({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;

  // Filter posts by:
  // 1. Active status (only show published posts)
  // 2. Tag match (split comma-separated tags and check each one)
  const filteredPosts = posts.filter((post) => {
    if (!post.active) return false;

    // Split tags and check if any tag matches (case-insensitive)
    const postTags = post.tags.split(",").map((t) => t.trim().toLowerCase());
    return postTags.some((value) => toUrlPath(value) === tag.toLowerCase());
  });

  return (
    <AppLayout>
      <Main posts={filteredPosts} />
    </AppLayout>
  );
}

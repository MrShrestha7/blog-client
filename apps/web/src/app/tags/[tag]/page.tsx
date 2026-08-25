import { posts } from "@repo/db/data";
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

  // Convert the URL tag format back to the original format
  // URL tags use hyphens instead of spaces, converted to uppercase with spaces
  const normalizedTag = tag
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Filter posts by:
  // 1. Active status (only show published posts)
  // 2. Tag match (split comma-separated tags and check each one)
  const filteredPosts = posts.filter((post) => {
    if (!post.active) return false;

    // Split tags and check if any tag matches (case-insensitive)
    const postTags = post.tags.split(",").map((t) => t.trim().toLowerCase());
    return postTags.some((t) => t === normalizedTag.toLowerCase());
  });

  return (
    <AppLayout>
      <Main posts={filteredPosts} />
    </AppLayout>
  );
}

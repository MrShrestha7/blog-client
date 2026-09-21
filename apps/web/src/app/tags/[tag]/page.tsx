import { client } from "@repo/db/client";
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
  searchParams,
}: {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { tag } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const posts = await client.db.post.findMany({
    where: { active: true },
    orderBy: { date: "desc" },
    include: { _count: { select: { Likes: true } } },
  });

  const filteredPosts = posts.filter((post) => {
    const postTags = post.tags.split(",").map((t) => t.trim().toLowerCase());
    return postTags.some((value) => toUrlPath(value) === tag.toLowerCase());
  });

  const mappedPosts = filteredPosts.map((post) => ({
    ...post,
    date: new Date(post.date),
    likes: post._count.Likes,
  }));

  return (
    <AppLayout>
      <Main posts={mappedPosts} page={page} paginationPath={`/tags/${tag}`} />
    </AppLayout>
  );
}

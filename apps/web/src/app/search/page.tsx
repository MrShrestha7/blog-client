import { client } from "@repo/db/client";
import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";

type SearchParams = {
  q?: string;
  tag?: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q = "", tag = "" } = await searchParams;
  const searchTerm = q.trim().toLowerCase();
  const tagTerm = tag.trim().toLowerCase();

  const posts = await client.db.post.findMany({
    where: { active: true },
    orderBy: { date: "desc" },
    include: { _count: { select: { Likes: true } } },
  });

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      !searchTerm ||
      post.title.toLowerCase().includes(searchTerm) ||
      post.description.toLowerCase().includes(searchTerm);

    const matchesTag =
      !tagTerm ||
      post.tags
        .split(",")
        .map((value) => value.trim().toLowerCase())
        .includes(tagTerm);

    return matchesSearch && matchesTag;
  });

  const mappedPosts = filteredPosts.map((post) => ({
    ...post,
    date: new Date(post.date),
    likes: post._count.Likes,
  }));

  return (
    <AppLayout query={q}>
      <Main posts={mappedPosts} />
    </AppLayout>
  );
}
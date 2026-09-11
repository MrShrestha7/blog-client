import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { client } from "@repo/db/client";

export default async function Page({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const { year, month } = await params;

  const posts = await client.db.post.findMany({
    where: { active: true },
    orderBy: { date: "desc" },
    include: { _count: { select: { Likes: true } } },
  });

  const filteredPosts = posts.filter((post) => {
    const date = new Date(post.date);

    return (
      date.getFullYear() === Number(year) &&
      date.getMonth() + 1 === Number(month)
    );
  });

  const mappedPosts = filteredPosts.map((post) => ({
    ...post,
    date: new Date(post.date),
    likes: post._count.Likes,
  }));

  return (
    <AppLayout>
      <Main posts={mappedPosts} />
    </AppLayout>
  );
}
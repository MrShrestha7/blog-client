import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { posts } from "@repo/db/data";

export default async function Page({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const { year, month } = await params;

  const filteredPosts = posts.filter((post) => {
    const date = new Date(post.date);

    return (
      post.active &&
      date.getFullYear() === Number(year) &&
      date.getMonth() + 1 === Number(month)
    );
  });

  return (
    <AppLayout>
      <Main posts={filteredPosts} />
    </AppLayout>
  );
}
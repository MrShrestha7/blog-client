import { posts } from "@repo/db/data";
import { client } from "@repo/db/client";
import { notFound } from "next/navigation";
import { AppLayout } from "@/components/Layout/AppLayout";
import { BlogDetail } from "@/components/Blog/Detail";

export default async function Page({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const { urlId } = await params;

  const post = posts.find(
    (item) => item.urlId === urlId && item.active,
  );

  if (!post) {
    notFound();
  }

  const updatedPost = await client.db.post.update({
    where: { id: post.id },
    data: { views: { increment: 1 } },
    include: { _count: { select: { Likes: true } } },
  });

  return (
    <AppLayout>
      <BlogDetail
        post={{
          ...post,
          views: updatedPost.views,
          likes: updatedPost._count.Likes,
        }}
      />
    </AppLayout>
  );
}
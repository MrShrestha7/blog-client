import { client } from "@repo/db/client";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { AppLayout } from "@/components/Layout/AppLayout";
import { BlogDetail } from "@/components/Blog/Detail";

function getClientIp(headersList: Headers) {
  const forwardedFor = headersList.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return headersList.get("x-real-ip") ?? "127.0.0.1";
}

export default async function Page({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const { urlId } = await params;
  const headerList = await headers();
  const ip = getClientIp(headerList);

  const post = await client.db.post.findFirst({
    where: { urlId, active: true },
    include: { _count: { select: { Likes: true } } },
  });

  if (!post) {
    notFound();
  }

  const liked = await client.db.like.findUnique({
    where: {
      postId_userIP: {
        postId: post.id,
        userIP: ip,
      },
    },
  });

  const updatedPost = await client.db.post.update({
    where: { id: post.id },
    data: { views: { increment: 1 } },
    include: { _count: { select: { Likes: true } } },
  });

  return (
    <AppLayout>
      <BlogDetail
        post={{
          ...updatedPost,
          date: new Date(updatedPost.date),
          likes: updatedPost._count.Likes,
          liked: Boolean(liked),
        }}
      />
    </AppLayout>
  );
}
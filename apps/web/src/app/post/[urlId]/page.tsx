import { posts } from "@repo/db/data";
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

  return (
    <AppLayout>
      <BlogDetail post={post} />
    </AppLayout>
  );
}
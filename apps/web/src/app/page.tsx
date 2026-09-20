import { client } from "@repo/db/client";
import { AppLayout } from "../components/Layout/AppLayout";
import { Main } from "../components/Main";
import styles from "./page.module.css";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const pageSize = params.page ? 2 : 4;
  const totalPosts = await client.db.post.count({ where: { active: true } });
  const posts = await client.db.post.findMany({
    where: { active: true },
    orderBy: { date: "desc" },
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: { _count: { select: { Likes: true } } },
  });

  const mappedPosts = posts.map((post) => ({
    ...post,
    date: new Date(post.date),
    likes: post._count.Likes,
  }));

  return (
    <AppLayout>
      <Main
        posts={mappedPosts}
        page={page}
        hasNextPage={page * pageSize < totalPosts}
        className={styles.main}
      />
    </AppLayout>
  );
}

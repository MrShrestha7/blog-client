import { client } from "@repo/db/client";
import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import styles from "./page.module.css";

type SearchParams = {
  q?: string;
  tag?: string;
  page?: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q = "", tag = "", page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
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
      <section className={styles.searchResults}>
        <p className={styles.eyebrow}>Search results</p>
        <Main
          posts={mappedPosts}
          page={page}
          view="grid"
          paginationPath={`/search?q=${encodeURIComponent(q)}${tag ? `&tag=${encodeURIComponent(tag)}` : ""}`}
        />
      </section>
    </AppLayout>
  );
}
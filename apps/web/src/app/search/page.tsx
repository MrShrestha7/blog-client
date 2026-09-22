import { client } from "@repo/db/client";
import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import styles from "./page.module.css";

type SearchParams = {
  q?: string;
  tag?: string;
  page?: string;
};

function normalizeSearchValue(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q = "", tag = "", page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const searchTerm = normalizeSearchValue(q);
  const tagTerm = normalizeSearchValue(tag);

  const posts = await client.db.post.findMany({
    where: { active: true },
    orderBy: { date: "desc" },
    include: { _count: { select: { Likes: true } } },
  });

  const filteredPosts = posts.filter((post) => {
    const searchableText = normalizeSearchValue(
      `${post.title} ${post.description} ${post.category} ${post.tags}`,
    );
    const searchTerms = searchTerm ? searchTerm.split(/\s+/).filter(Boolean) : [];

    const matchesSearch =
      searchTerms.length === 0 ||
      searchTerms.every((term) => searchableText.includes(term));

    const matchesTag =
      !tagTerm ||
      post.tags
        .split(",")
        .map((value) => normalizeSearchValue(value))
        .includes(tagTerm) ||
      normalizeSearchValue(post.category).includes(tagTerm);

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
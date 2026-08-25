import { posts } from "@repo/db/data";
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

  const filteredPosts = posts.filter((post) => {
    if (!post.active) {
      return false;
    }

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

  return (
    <AppLayout query={q}>
      <Main posts={filteredPosts} />
    </AppLayout>
  );
}
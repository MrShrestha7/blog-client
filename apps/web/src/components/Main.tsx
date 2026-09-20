import type { Post } from "@repo/db/data";
import BlogList from "./Blog/List";

export function Main({
  posts,
  page = 1,
  hasNextPage = false,
  className,
}: {
  posts: Post[];
  page?: number;
  hasNextPage?: boolean;
  className?: string;
}) {
  return (
    <main className={className}>
      <BlogList posts={posts} />
      <nav aria-label="Post pages" data-test-id="pagination" className="mx-auto flex max-w-4xl justify-center gap-4 py-8">
        <a aria-disabled={page === 1} className={page === 1 ? "pointer-events-none opacity-40" : "underline"} href={page > 1 ? `/?page=${page - 1}` : "/"}>Previous</a>
        <span>Page {page}</span>
        <a aria-disabled={!hasNextPage} className={!hasNextPage ? "pointer-events-none opacity-40" : "underline"} href={hasNextPage ? `/?page=${page + 1}` : `/?page=${page}`}>Next</a>
      </nav>
    </main>
  );
}

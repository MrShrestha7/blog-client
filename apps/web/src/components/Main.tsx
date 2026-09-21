import type { Post } from "@repo/db/data";
import BlogList from "./Blog/List";

const POSTS_PER_PAGE = 4;

export function Main({
  posts,
  page = 1,
  className,
  view = "list",
  paginationPath = "/search",
}: {
  posts: Post[];
  page?: number;
  className?: string;
  view?: "list" | "grid";
  paginationPath?: string;
}) {
  const currentPage = Math.max(1, page);
  const visiblePosts = posts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  );
  const hasNextPage = currentPage * POSTS_PER_PAGE < posts.length;
  const pageUrl = (targetPage: number) =>
    `${paginationPath}${paginationPath.includes("?") ? "&" : "?"}page=${targetPage}`;

  return (
    <main className={className}>
      <BlogList posts={visiblePosts} view={view} />
      <nav aria-label="Post pages" data-test-id="pagination" className="mx-auto flex max-w-4xl justify-center gap-4 py-8">
        <a aria-disabled={currentPage === 1} className={currentPage === 1 ? "pointer-events-none opacity-40" : "underline"} href={currentPage > 1 ? pageUrl(currentPage - 1) : pageUrl(1)}>Previous</a>
        <span>Page {currentPage}</span>
        <a aria-disabled={!hasNextPage} className={!hasNextPage ? "pointer-events-none opacity-40" : "underline"} href={hasNextPage ? pageUrl(currentPage + 1) : pageUrl(currentPage)}>Next</a>
      </nav>
    </main>
  );
}

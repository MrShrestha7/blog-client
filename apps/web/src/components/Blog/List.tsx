import type { Post } from "@repo/db/data";
import { BlogListItem } from "./ListItem";

export function BlogList({ posts, view = "list" }: { posts: Post[]; view?: "list" | "grid" }) {
  const activePosts = posts.filter((post) => post.active);

  return (
    <section aria-labelledby="blog-heading" className="mx-auto max-w-5xl">
      <header className="mb-9 border-b border-[#e4e8ef] pb-7">
        <p className="font-sans text-xs font-bold uppercase text-[#bb4c45]">Field notes</p>
        <h1 id="blog-heading" className="mt-2 font-serif text-4xl font-bold text-[#17213b] md:text-5xl">
          Stories and ideas
        </h1>
        <p className="mt-3 max-w-xl font-serif text-lg leading-7 text-[#657086]">
          Observations, practical lessons, and the work behind better digital products.
        </p>
      </header>

      <p className="mb-2 font-sans text-xs uppercase tracking-wide text-[#657086]">
        {activePosts.length}{" "}
        {activePosts.length === 1 ? "Post" : "Posts"}
      </p>

      <div className={view === "grid" ? "grid grid-cols-1 gap-x-9 gap-y-12 sm:grid-cols-2" : ""}>
        {activePosts.map((post) => (
          <BlogListItem key={post.id} post={post} view={view} />
        ))}
      </div>
    </section>
  );
}

export default BlogList;
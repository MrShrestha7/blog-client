import type { Post } from "@repo/db/data";
import { BlogListItem } from "./ListItem";

export function BlogList({ posts }: { posts: Post[] }) {
  const activePosts = posts.filter((post) => post.active);

  return (
    <section aria-labelledby="blog-heading" className="mx-auto max-w-5xl">
      <header className="mb-8">
        <h1 id="blog-heading" className="text-4xl font-bold text-primary">
          From the blog
        </h1>
        <p className="mt-3 text-lg text-secondary">
          Learn how to grow your business with our expert advice.
        </p>
      </header>

      <p className="mb-2 text-sm text-secondary">
        {activePosts.length}{" "}
        {activePosts.length === 1 ? "Post" : "Posts"}
      </p>

      <div>
        {activePosts.map((post) => (
          <BlogListItem key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}

export default BlogList;
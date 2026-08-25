import type { Post } from "@repo/db/data";
import Link from "next/link";

function formatDate(date: Date) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return `${String(date.getDate()).padStart(2, "0")} ${
    months[date.getMonth()]
  } ${date.getFullYear()}`;
}

export function BlogListItem({ post }: { post: Post }) {
  const postTags = post.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return (
    <article
      className="grid gap-6 border-b border-gray-200 py-8 md:grid-cols-[240px_1fr]"
      data-test-id={`blog-post-${post.id}`}
    >
      <Link href={`/post/${post.urlId}`} aria-label={post.title}>
        <img
          src={post.imageUrl}
          alt={post.title}
          className="h-56 w-full rounded-xl object-cover"
        />
      </Link>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3 text-sm text-secondary">
          <time dateTime={post.date.toISOString()}>
            {formatDate(post.date)}
          </time>
          <span>{post.category}</span>
        </div>

        <h2 className="mt-3 text-2xl font-semibold text-primary">
          <Link href={`/post/${post.urlId}`} className="hover:text-wsu">
            {post.title}
          </Link>
        </h2>

        <p className="mt-3 leading-7 text-secondary">{post.description}</p>

        <div className="mt-4 flex flex-wrap gap-3">
          {postTags.map((tag) => (
            <span key={tag} className="text-sm text-secondary">
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-5 flex gap-6 border-t border-gray-200 pt-4 text-sm text-secondary">
          <span>{post.views} views</span>
          <span>{post.likes} likes</span>
        </div>
      </div>
    </article>
  );
}
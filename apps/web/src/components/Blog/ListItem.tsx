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
      className="grid gap-6 border-b border-[#e4e8ef] py-8 md:grid-cols-[280px_1fr]"
      data-test-id={`blog-post-${post.id}`}
    >
      <Link href={`/post/${post.urlId}`} aria-label={post.title}>
        <img
          src={post.imageUrl}
          alt={post.title}
          className="h-52 w-full object-cover md:h-44"
        />
      </Link>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3 font-sans text-xs uppercase tracking-wide text-[#657086]">
          <time dateTime={post.date.toISOString()}>
            {formatDate(post.date)}
          </time>
          <span>{post.category}</span>
        </div>

        <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-[#17213b]">
          <Link href={`/post/${post.urlId}`} className="hover:text-[#247ea1]">
            {post.title}
          </Link>
        </h2>

        <p className="mt-3 font-serif leading-7 text-[#657086]">{post.description}</p>

        <div className="mt-4 flex flex-wrap gap-3">
          {postTags.map((tag) => (
            <span key={tag} className="font-sans text-xs text-[#61708a]">
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-5 flex gap-6 border-t border-[#e4e8ef] pt-4 font-sans text-xs text-[#657086]">
          <span>{post.views} views</span>
          <span>{post.likes} likes</span>
        </div>
      </div>
    </article>
  );
}
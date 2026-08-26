import type { Post } from "@repo/db/data";
import Link from "next/link";
import { marked } from "marked";

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

export async function BlogDetail({ post }: { post: Post }) {
  const content = await marked.parse(post.content);

  const postTags = post.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return (
    <article
      data-test-id={`blog-post-${post.id}`}
      className="mx-auto max-w-4xl py-8"
    >
      <Link
        href="/"
        className="text-sm text-secondary hover:text-wsu"
      >
        ← Back to posts
      </Link>

      <div className="mt-8">
        <div className="flex flex-wrap gap-3 text-sm text-secondary">
          <time dateTime={post.date.toISOString()}>
            {formatDate(post.date)}
          </time>
          <span>{post.category}</span>
        </div>

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-primary">
          <Link href={`/post/${post.urlId}`} className="hover:text-wsu">
            {post.title}
          </Link>
        </h1>

        <img
          src={post.imageUrl}
          alt=""
          className="mt-8 max-h-[ thirtyrem ] w-full rounded-2xl object-cover"
        />

        <div className="mt-6 flex flex-wrap gap-3 text-sm text-secondary">
          {postTags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>

        <div className="mt-4 flex gap-6 text-sm text-secondary">
          <span>{post.views} views</span>
          <span>{post.likes} likes</span>
        </div>

        <div
          data-test-id="content-markdown"
          className="prose prose-lg mt-10 max-w-none text-primary"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </article>
  );
}
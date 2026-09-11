"use client";

import type { Post } from "@repo/db/data";
import Link from "next/link";
import { marked } from "marked";
import { useState } from "react";

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

export function BlogDetail({ post }: { post: Post & { liked?: boolean } }) {
  const [liked, setLiked] = useState(Boolean(post.liked));
  const [likes, setLikes] = useState(post.likes);
  const content = marked.parse(post.content);

  const postTags = post.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const handleLikeToggle = async () => {
    const method = liked ? "DELETE" : "POST";
    const response = await fetch("/api/likes", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: post.id }),
    });

    if (!response.ok) {
      return;
    }

    const data = (await response.json()) as { liked: boolean; likes: number };
    setLiked(data.liked);
    setLikes(data.likes);
  };

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
          className="mt-8 max-h-[30rem] w-full rounded-2xl object-cover"
        />

        <div className="mt-6 flex flex-wrap gap-3 text-sm text-secondary">
          {postTags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>

        <div className="mt-4 flex gap-6 text-sm text-secondary">
          <span>{post.views} views</span>
          <span>{likes} likes</span>
        </div>

        <button
          type="button"
          data-test-id="like-button"
          onClick={handleLikeToggle}
          className="mt-4 rounded-md border border-primary px-4 py-2 text-sm font-medium"
        >
          {liked ? "Unlike" : "Like"}
        </button>

        <div
          data-test-id="content-markdown"
          className="prose prose-lg mt-10 max-w-none text-primary"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </article>
  );
}
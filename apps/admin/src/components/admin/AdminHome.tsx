"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getPosts, toggleActive as toggleActivePost, type AdminPost } from "../../utils/posts-actions";

const formatDate = (value: Date | string) => {
  const date = new Date(value);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const normaliseTags = (tags: string) =>
  tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

export default function AdminHome() {
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [contentFilter, setContentFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");

  useEffect(() => {
    getPosts().then(setPosts);
  }, []);

  const visiblePosts = useMemo(() => {
    const nextPosts = [...posts];

    const contentTerm = contentFilter.trim().toLowerCase();
    const tagTerm = tagFilter.trim().toLowerCase();
    const dateTerm = dateFilter.trim();

    const parseDateTerm = (value: string) => {
      const normalized = value.replace(/\s+/g, "").replace(/\//g, "").replace(/-/g, "");
      if (!normalized) return null;

      if (/^\d{8}$/.test(normalized)) {
        const day = normalized.slice(0, 2);
        const month = normalized.slice(2, 4);
        const year = normalized.slice(4, 8);
        return new Date(`${year}-${month}-${day}`);
      }

      const candidate = new Date(value);
      return Number.isNaN(candidate.getTime()) ? null : candidate;
    };

    const filtered = nextPosts.filter((post) => {
      const matchesContent =
        !contentTerm ||
        [post.title, post.content, post.description].some((value) =>
          value.toLowerCase().includes(contentTerm),
        );

      const matchesTag =
        !tagTerm ||
        normaliseTags(post.tags).some((tag) => tag.toLowerCase().includes(tagTerm));

      const minimumDate = parseDateTerm(dateTerm);
      const matchesDate =
        !minimumDate ||
        new Date(post.date).getTime() >= minimumDate.getTime();

      return matchesContent && matchesTag && matchesDate;
    });

    filtered.sort((a, b) => {
      if (sortBy === "title-asc") return a.title.localeCompare(b.title);
      if (sortBy === "title-desc") return b.title.localeCompare(a.title);
      if (sortBy === "date-asc") return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === "date-desc") return new Date(b.date).getTime() - new Date(a.date).getTime();
      return 0;
    });

    return filtered;
  }, [contentFilter, dateFilter, posts, sortBy, tagFilter]);

  async function handleLogout() {
    await fetch("/api/auth", { method: "DELETE" });
    window.location.href = "/";
  }

  async function toggleActive(postId: number) {
    const updatedPost = await toggleActivePost(postId);
    setPosts((current) =>
      current.map((post) => (post.id === postId ? updatedPost : post)),
    );
  }

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 20px 80px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 42 }}>Admin of Full Stack Blog</h1>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          style={{ background: "#111827", color: "white", border: "none", borderRadius: 8, padding: "10px 16px", cursor: "pointer" }}
        >
          Logout
        </button>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 20 }}>
        <label style={{ display: "grid", gap: 6, fontWeight: 600 }}>
          Filter by Content:
          <input
            type="text"
            value={contentFilter}
            onChange={(event) => setContentFilter(event.target.value)}
            style={{ border: "1px solid #d1d5db", borderRadius: 8, padding: "8px 10px" }}
          />
        </label>

        <label style={{ display: "grid", gap: 6, fontWeight: 600 }}>
          Filter by Tag:
          <input
            type="text"
            value={tagFilter}
            onChange={(event) => setTagFilter(event.target.value)}
            style={{ border: "1px solid #d1d5db", borderRadius: 8, padding: "8px 10px" }}
          />
        </label>

        <label style={{ display: "grid", gap: 6, fontWeight: 600 }}>
          Filter by Date Created:
          <input
            type="text"
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
            placeholder="e.g. 2024"
            style={{ border: "1px solid #d1d5db", borderRadius: 8, padding: "8px 10px" }}
          />
        </label>

        <label style={{ display: "grid", gap: 6, fontWeight: 600 }}>
          Sort By:
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            style={{ border: "1px solid #d1d5db", borderRadius: 8, padding: "8px 10px" }}
          >
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
            <option value="date-asc">Date oldest first</option>
            <option value="date-desc">Date newest first</option>
          </select>
        </label>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
        <Link href="/posts/create" style={{ background: "#2563eb", color: "white", borderRadius: 8, padding: "10px 16px", textDecoration: "none", display: "inline-block" }}>
          Create Post
        </Link>
      </div>

      <div style={{ display: "grid", gap: 18 }}>
        {visiblePosts.length === 0 && posts.length === 0 ? (
          <p style={{ color: "#6b7280", textAlign: "center", padding: "40px 20px" }}>Loading posts...</p>
        ) : visiblePosts.length === 0 ? (
          <p style={{ color: "#6b7280", textAlign: "center", padding: "40px 20px" }}>No posts found matching your filters.</p>
        ) : (
          visiblePosts.map((post) => (
            <article key={post.id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 20, display: "grid", gridTemplateColumns: "200px 1fr", gap: 18 }}>
              <img src={post.imageUrl} alt={post.title} style={{ width: 200, height: 140, objectFit: "cover", borderRadius: 12 }} />

              <div>
                <Link href={`/post/${post.urlId}`} style={{ fontSize: 26, fontWeight: 700, color: "#111827", textDecoration: "none" }}>
                  {post.title}
                </Link>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, fontSize: 13, marginTop: 12, color: "#4b5563" }}>
                  <span>{post.category}</span>
                  <span>•</span>
                  <time dateTime={new Date(post.date).toISOString()}>Posted on {formatDate(post.date)}</time>
                  <span>•</span>
                  <span>{normaliseTags(post.tags).map((tag) => `#${tag}`).join(", ")}</span>
                </div>

                <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12 }}>
                  <button
                    type="button"
                    onClick={() => toggleActive(post.id)}
                    style={{
                      background: post.active ? "#16a34a" : "#9ca3af",
                      color: "white",
                      border: "none",
                      borderRadius: 999,
                      padding: "8px 14px",
                      cursor: "pointer",
                      fontWeight: 700,
                    }}
                  >
                    {post.active ? "Active" : "Inactive"}
                  </button>
                  <span style={{ color: "#6b7280" }}>{post.active ? "Visible" : "Hidden"}</span>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </main>
  );
}

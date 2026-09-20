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
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [contentFilter, setContentFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    getPosts()
      .then(setPosts)
      .catch(() => setLoadError("Posts could not be loaded. Check the database connection and try again."))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    setTheme(savedTheme);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", nextTheme);
    document.cookie = `theme=${nextTheme}; path=/; max-age=31536000; samesite=lax`;
    localStorage.setItem("theme", nextTheme);
    setTheme(nextTheme);
  }

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
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 80px", fontFamily: "Georgia, 'Times New Roman', serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, paddingBottom: 24, borderBottom: "1px solid var(--text-secondary)" }}>
        <div>
          <p style={{ margin: "0 0 6px", color: "var(--wsu)", fontFamily: "system-ui", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>Field notes</p>
          <h1 style={{ margin: 0, fontSize: 42 }}>Editorial desk</h1>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button type="button" onClick={toggleTheme} style={{ background: "transparent", color: "var(--text)", border: "1px solid var(--text-secondary)", borderRadius: 6, padding: "10px 14px", cursor: "pointer" }}>{theme === "light" ? "Dark mode" : "Light mode"}</button>
          <button type="button" onClick={handleLogout} style={{ background: "var(--text)", color: "var(--background)", border: "none", borderRadius: 6, padding: "10px 16px", cursor: "pointer" }}>Logout</button>
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 20, padding: 18, border: "1px solid var(--text-secondary)", background: "var(--background)" }}>
        <label style={{ display: "grid", gap: 6, fontWeight: 600 }}>
          Filter by Content:
          <input
            type="text"
            value={contentFilter}
            onChange={(event) => setContentFilter(event.target.value)}
            style={{ border: "1px solid var(--text-secondary)", borderRadius: 4, padding: "8px 10px", background: "var(--background)", color: "var(--text)" }}
          />
        </label>

        <label style={{ display: "grid", gap: 6, fontWeight: 600 }}>
          Filter by Tag:
          <input
            type="text"
            value={tagFilter}
            onChange={(event) => setTagFilter(event.target.value)}
            style={{ border: "1px solid var(--text-secondary)", borderRadius: 4, padding: "8px 10px", background: "var(--background)", color: "var(--text)" }}
          />
        </label>

        <label style={{ display: "grid", gap: 6, fontWeight: 600 }}>
          Filter by Date Created:
          <input
            type="text"
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
            placeholder="e.g. 2024"
            style={{ border: "1px solid var(--text-secondary)", borderRadius: 4, padding: "8px 10px", background: "var(--background)", color: "var(--text)" }}
          />
        </label>

        <label style={{ display: "grid", gap: 6, fontWeight: 600 }}>
          Sort By:
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            style={{ border: "1px solid var(--text-secondary)", borderRadius: 4, padding: "8px 10px", background: "var(--background)", color: "var(--text)" }}
          >
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
            <option value="date-asc">Date oldest first</option>
            <option value="date-desc">Date newest first</option>
          </select>
        </label>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
        <Link href="/posts/create" style={{ background: "#247ea1", color: "white", borderRadius: 6, padding: "10px 16px", textDecoration: "none", display: "inline-block" }}>
          Create Post
        </Link>
      </div>

      <div style={{ display: "grid", gap: 18 }}>
        {isLoading ? (
          <p style={{ color: "#6b7280", textAlign: "center", padding: "40px 20px" }}>Loading posts...</p>
        ) : loadError ? (
          <p role="alert" style={{ color: "#b91c1c", textAlign: "center", padding: "40px 20px" }}>{loadError}</p>
        ) : visiblePosts.length === 0 && posts.length === 0 ? (
          <p style={{ color: "#6b7280", textAlign: "center", padding: "40px 20px" }}>No posts yet. Create your first post to get started.</p>
        ) : visiblePosts.length === 0 ? (
          <p style={{ color: "#6b7280", textAlign: "center", padding: "40px 20px" }}>No posts found matching your filters.</p>
        ) : (
          visiblePosts.map((post) => (
            <article key={post.id} style={{ background: "var(--background)", border: "1px solid var(--text-secondary)", borderRadius: 6, padding: 20, display: "grid", gridTemplateColumns: "200px 1fr", gap: 18 }}>
              <img src={post.imageUrl} alt={post.title} style={{ width: 200, height: 140, objectFit: "cover", borderRadius: 2 }} />

              <div>
                <Link href={`/post/${post.urlId}`} style={{ fontSize: 26, fontWeight: 700, color: "var(--text)", textDecoration: "none" }}>
                  {post.title}
                </Link>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, fontSize: 13, marginTop: 12, color: "var(--text-secondary)" }}>
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
                  <span style={{ color: "var(--text-secondary)" }}>{post.active ? "Visible" : "Hidden"}</span>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </main>
  );
}

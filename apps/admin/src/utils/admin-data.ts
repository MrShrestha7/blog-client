import { posts as seedPosts, type Post } from "@repo/db/data";

export type AdminPost = Post & { date: Date };

const STORAGE_KEY = "admin-posts";

const toDate = (value: Date | string) => new Date(value);

const normalizePost = (post: Partial<AdminPost> & { id: number }): AdminPost => ({
  id: post.id,
  urlId: post.urlId ?? `post-${post.id}`,
  title: post.title ?? `Post ${post.id}`,
  content: post.content ?? "",
  description: post.description ?? "",
  imageUrl: post.imageUrl ?? "",
  date: toDate(post.date ?? new Date()),
  category: post.category ?? "General",
  views: post.views ?? 0,
  likes: post.likes ?? 0,
  tags: post.tags ?? "",
  active: post.active ?? true,
});

export function getInitialPosts(): AdminPost[] {
  return seedPosts.map((post) => normalizePost(post));
}

export function getStoredPosts(): AdminPost[] {
  if (typeof window === "undefined") {
    return getInitialPosts();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(getInitialPosts()));
      return getInitialPosts();
    }

    const parsed = JSON.parse(raw) as Array<Partial<AdminPost>>;
    if (!Array.isArray(parsed) || parsed.length === 0) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(getInitialPosts()));
      return getInitialPosts();
    }

    return parsed.map((post) => normalizePost(post as Partial<AdminPost> & { id: number }));
  } catch {
    return getInitialPosts();
  }
}

export function saveStoredPosts(posts: AdminPost[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

export function getPostByUrlId(urlId: string): AdminPost | undefined {
  return getStoredPosts().find((post) => post.urlId === urlId);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

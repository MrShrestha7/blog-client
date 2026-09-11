import { client } from "@repo/db/client";
import { CategoryList } from "./CategoryList";
import { HistoryList } from "./HistoryList";
import { TagList } from "./TagList";

export async function LeftMenu() {
  const posts = await client.db.post.findMany({
    where: { active: true },
    orderBy: { date: "desc" },
    include: { _count: { select: { Likes: true } } },
  });

  const mappedPosts = posts.map((post) => ({
    ...post,
    date: new Date(post.date),
    likes: post._count.Likes,
  }));

  return (
    <aside className="w-full border-b border-gray-200 bg-[var(--background)] px-4 py-6 dark:border-gray-800 md:fixed md:inset-y-0 md:left-0 md:w-72 md:overflow-y-auto md:border-b-0 md:border-r">
      <div className="mb-8">
        <a
          href="/"
          className="text-xl font-bold tracking-tight text-primary"
        >
          Full-Stack Blog
        </a>
      </div>

      <nav aria-label="Blog navigation">
        <div className="space-y-8">
          <CategoryList posts={mappedPosts} />
          <HistoryList posts={mappedPosts} />
          <TagList posts={mappedPosts} />
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-800">
          <a
            href="http://localhost:3002"
            className="text-sm text-secondary hover:text-wsu"
          >
            Admin
          </a>
        </div>
      </nav>
    </aside>
  );
}
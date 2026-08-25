import { posts } from "@repo/db/data";
import { CategoryList } from "./CategoryList";
import { HistoryList } from "./HistoryList";
import { TagList } from "./TagList";

export function LeftMenu() {
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
          <CategoryList posts={posts} />
          <HistoryList posts={posts} />
          <TagList posts={posts} />
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
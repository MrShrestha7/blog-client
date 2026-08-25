import { categories } from "@/functions/categories";
import type { Post } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";
import { LinkList } from "./LinkList";
import { SummaryItem } from "./SummaryItem";

export function CategoryList({
  posts,
  selectedCategory = "",
}: {
  posts: Post[];
  selectedCategory?: string;
}) {
  const categoryItems = categories(posts);

  return (
    <LinkList title="Categories">
      {categoryItems.map((item) => {
        const categoryPath = toUrlPath(item.name);

        return (
          <SummaryItem
            key={item.name}
            count={item.count}
            name={item.name}
            isSelected={
              categoryPath.toLowerCase() === selectedCategory.toLowerCase()
            }
            link={`/category/${categoryPath}`}
            title={`Posts in ${item.name}`}
          />
        );
      })}
    </LinkList>
  );
}
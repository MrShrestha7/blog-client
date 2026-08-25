import type { Post } from "@repo/db/data";
import { tags } from "@/functions/tags";
import { LinkList } from "./LinkList";
import { SummaryItem } from "./SummaryItem";

export function TagList({
  selectedTag = "",
  posts,
}: {
  selectedTag?: string;
  posts: Post[];
}) {
  const postTags = tags(posts);

  return (
    <LinkList title="Tags">
      {postTags.map((tag) => {
        const count = posts.filter(
          (post) =>
            post.active &&
            post.tags
              .split(",")
              .map((value) => value.trim().toLowerCase())
              .includes(tag.toLowerCase()),
        ).length;

        return (
          <SummaryItem
            key={tag}
            count={count}
            name={tag}
            isSelected={tag.toLowerCase() === selectedTag.toLowerCase()}
            link={`/search?tag=${encodeURIComponent(tag)}`}
            title={`Posts tagged ${tag}`}
          />
        );
      })}
    </LinkList>
  );
}
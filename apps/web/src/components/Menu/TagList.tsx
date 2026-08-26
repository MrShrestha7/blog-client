import type { Post } from "@repo/db/data";
import { tags } from "@/functions/tags";
import { toUrlPath } from "@repo/utils/url";
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
        return (
          <SummaryItem
            key={tag.name}
            count={tag.count}
            name={tag.name}
            isSelected={tag.name.toLowerCase() === selectedTag.toLowerCase()}
            link={`/tags/${toUrlPath(tag.name)}`}
            title={`Tag / ${tag.name}`}
          />
        );
      })}
    </LinkList>
  );
}
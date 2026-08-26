export function tags(
  posts: { tags: string; active: boolean }[],
): { name: string; count: number }[] {
  const tagCounts = new Map<string, number>();

  for (const post of posts) {
    if (!post.active) continue;

    for (const tag of post.tags.split(",")) {
      const cleanedTag = tag.trim();

      if (cleanedTag) {
        tagCounts.set(cleanedTag, (tagCounts.get(cleanedTag) ?? 0) + 1);
      }
    }
  }

  return [...tagCounts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((tagA, tagB) => tagA.name.localeCompare(tagB.name));
}
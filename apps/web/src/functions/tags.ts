export function tags(
  posts: { tags: string; active: boolean }[],
): string[] {
  const uniqueTags = new Set<string>();

  for (const post of posts) {
    if (!post.active) continue;

    for (const tag of post.tags.split(",")) {
      const cleanedTag = tag.trim();

      if (cleanedTag) {
        uniqueTags.add(cleanedTag);
      }
    }
  }

  return [...uniqueTags].sort((a, b) => a.localeCompare(b));
}
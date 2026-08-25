export function categories<T extends { category: string; active: boolean }>(
  posts: T[],
): { name: string; count: number }[] {
  return posts
    .filter((post) => post.active)
    .sort((a, b) => a.category.localeCompare(b.category))
    .reduce(
      (result, post) => {
        const existingCategory = result.find(
          (category) => category.name === post.category,
        );

        if (existingCategory) {
          existingCategory.count += 1;
        } else {
          result.push({
            name: post.category,
            count: 1,
          });
        }

        return result;
      },
      [] as { name: string; count: number }[],
    );
}
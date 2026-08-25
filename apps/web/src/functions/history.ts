const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function history(posts: { date: Date; active: boolean }[]): string[] {
  const values = posts
    .filter((post) => post.active)
    .map((post) => {
      const date = new Date(post.date);

      return {
        date,
        value: `${monthNames[date.getMonth()]}, ${date.getFullYear()}`,
      };
    });

  const unique = new Map<string, Date>();

  for (const item of values) {
    if (!unique.has(item.value)) {
      unique.set(item.value, item.date);
    }
  }

  return [...unique.entries()]
    .sort(([, dateA], [, dateB]) => dateB.getTime() - dateA.getTime())
    .map(([value]) => value);
}
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

export function history(
  posts: { date: Date; active: boolean }[],
): { month: number; year: number; count: number }[] {
  const grouped = new Map<string, { month: number; year: number; count: number }>();

  for (const post of posts) {
    if (!post.active) continue;

    const date = new Date(post.date);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const key = `${year}-${month}`;
    const current = grouped.get(key);

    if (current) {
      current.count += 1;
    } else {
      grouped.set(key, { month, year, count: 1 });
    }
  }

  return [...grouped.values()].sort(
    (historyA, historyB) =>
      historyB.year - historyA.year || historyB.month - historyA.month,
  );
}
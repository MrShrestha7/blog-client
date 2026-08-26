import { history } from "@/functions/history";
import type { Post } from "@repo/db/data";
import { LinkList } from "./LinkList";
import { SummaryItem } from "./SummaryItem";

export function HistoryList({
  selectedYear = "",
  selectedMonth = "",
  posts,
}: {
  selectedYear?: string;
  selectedMonth?: string;
  posts: Post[];
}) {
  const historyItems = history(posts);

  return (
    <LinkList title="History">
      {historyItems.map((item) => {
        const month = new Date(2000, item.month - 1).toLocaleString("en", {
          month: "long",
        });
        const year = String(item.year);
        const monthNumber = String(item.month);
        const label = `${month}, ${year}`;

        const isSelected =
          selectedYear === year &&
          (selectedMonth === monthNumber ||
            selectedMonth.toLowerCase() === month.toLowerCase());

        return (
          <SummaryItem
            key={`${item.year}-${item.month}`}
            count={item.count}
            name={label}
            isSelected={isSelected}
            link={`/history/${year}/${monthNumber}`}
            title={`History / ${label}`}
          />
        );
      })}
    </LinkList>
  );
}
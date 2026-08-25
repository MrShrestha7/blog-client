import { history } from "@/functions/history";
import type { Post } from "@repo/db/data";
import { LinkList } from "./LinkList";
import { SummaryItem } from "./SummaryItem";

const monthNumbers: Record<string, string> = {
  January: "1",
  February: "2",
  March: "3",
  April: "4",
  May: "5",
  June: "6",
  July: "7",
  August: "8",
  September: "9",
  October: "10",
  November: "11",
  December: "12",
};

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
        const [month, year] = item.split(",").map((value) => value.trim());
        const monthNumber = monthNumbers[month];

        if (!month || !year || !monthNumber) {
          return null;
        }

        const count = posts.filter((post) => {
          const date = new Date(post.date);

          return (
            post.active &&
            date.getFullYear() === Number(year) &&
            date.getMonth() + 1 === Number(monthNumber)
          );
        }).length;

        const isSelected =
          selectedYear === year &&
          (selectedMonth === monthNumber ||
            selectedMonth.toLowerCase() === month.toLowerCase());

        return (
          <SummaryItem
            key={`${year}-${monthNumber}`}
            count={count}
            name={item}
            isSelected={isSelected}
            link={`/history/${year}/${monthNumber}`}
            title={`Posts from ${item}`}
          />
        );
      })}
    </LinkList>
  );
}
import Link from "next/link";

export function SummaryItem({
  name,
  link,
  count,
  isSelected,
  title,
}: {
  name: string;
  link: string;
  count: number;
  isSelected: boolean;
  title?: string;
}) {
  return (
    <li>
      <Link
        href={link}
        title={title || name}
        aria-current={isSelected ? "page" : undefined}
        className={[
          "flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
          isSelected
            ? "selected bg-gray-100 font-semibold text-primary dark:bg-gray-800"
            : "text-secondary hover:bg-gray-100 hover:text-primary dark:hover:bg-gray-800",
        ].join(" ")}
      >
        <span>{name}</span>
        <span
          data-test-id="post-count"
          className="rounded-full bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-800"
        >
          {count}
        </span>
      </Link>
    </li>
  );
}
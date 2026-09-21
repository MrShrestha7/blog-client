import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import { SummaryItem } from "./SummaryItem";

test("renders non-selected summary item with count (jsdom + RTL)", () => {
  render(
    <SummaryItem
      count={10}
      isSelected={false}
      link="/my/link"
      name="Link to Content"
      title="Content Title"
    />,
  );

  expect(screen.getByText("10")).toBeInTheDocument();
  const link = screen.getByText("Link to Content");
  expect(link).toBeInTheDocument();
  expect(link.parentElement).toHaveAttribute("href", "/my/link");
  expect(link.parentElement).not.toHaveClass("selected");
});

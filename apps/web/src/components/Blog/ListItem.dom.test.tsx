import type { Post } from "@repo/db/data";
import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";

import { BlogListItem } from "./ListItem";

const post1: Post = {
  title: "Hello, World!",
  date: new Date("01 Oct 2024"),
  tags: "Hello,World",
  category: "Cat",
  content: "Content of Hello World",
  description: "Description of Hello World",
  id: 1,
  imageUrl: "https://example.com/image.jpg",
  likes: 30,
  active: true,
  urlId: "hello-world",
  views: 200,
};

test("render blog post data (jsdom + RTL)", () => {
  render(<BlogListItem post={post1} />);

  const heading = screen.getByRole("heading", { name: post1.title });
  expect(within(heading).getByRole("link")).toHaveAttribute(
    "href",
    "/post/hello-world",
  );
  expect(screen.getByText("Cat")).toBeInTheDocument();
  expect(screen.getByText("#Hello")).toBeInTheDocument();
  expect(screen.getByText("#World")).toBeInTheDocument();
  expect(screen.getByText("01 Oct 2024")).toBeInTheDocument();
  expect(screen.getByText("200 views")).toBeInTheDocument();
  expect(screen.getByText("30 likes")).toBeInTheDocument();
});

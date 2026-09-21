import type { Post } from "@repo/db/data";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import { BlogList } from "./List";

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

const post2: Post = {
  title: "Hola, Mundo!",
  date: new Date("01 May 2022"),
  tags: "Hola,Mundo",
  category: "Kat",
  content: "Contento del Hola Mundo",
  description: "Descripcion de Hola Mundo",
  id: 2,
  imageUrl: "https://example.com/image.jpg",
  likes: 550,
  active: true,
  urlId: "hola-mundo",
  views: 1000,
};

test("renders 0 posts when no posts are present (jsdom + RTL)", () => {
  render(<BlogList posts={[]} />);
  expect(screen.getByText("0 Posts")).toBeInTheDocument();
});

test("renders multiple active posts, skipping inactive ones", () => {
  render(
    <BlogList posts={[post1, post2, { ...post1, id: 3, active: false }]} />,
  );

  expect(screen.getByText("2 Posts")).toBeInTheDocument();
  expect(screen.getByText(post1.title)).toBeInTheDocument();
  expect(screen.getByText(post2.title)).toBeInTheDocument();
});

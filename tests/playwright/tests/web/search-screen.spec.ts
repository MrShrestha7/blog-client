import { client } from "@repo/db/client";
import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

test.describe("SEARCH SCREEN", () => {
  test.beforeEach(async () => {
    await seed();
  });

  test(
    "Pagination works across search results",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await client.db.post.createMany({
        data: [
          {
            id: 5,
            title: "Pagination test 1",
            urlId: "pagination-test-1",
            description: "Extra post for pagination",
            content: "This is an extra post for pagination testing.",
            imageUrl: "https://example.com/1.jpg",
            date: new Date("2025-01-01T00:00:00.000Z"),
            category: "React",
            tags: "Front-End,Pagination",
            views: 5,
            active: true,
          },
          {
            id: 6,
            title: "Pagination test 2",
            urlId: "pagination-test-2",
            description: "Extra post for pagination",
            content: "This is an extra post for pagination testing.",
            imageUrl: "https://example.com/2.jpg",
            date: new Date("2025-01-02T00:00:00.000Z"),
            category: "React",
            tags: "Front-End,Pagination",
            views: 6,
            active: true,
          },
          {
            id: 7,
            title: "Pagination test 3",
            urlId: "pagination-test-3",
            description: "Extra post for pagination",
            content: "This is an extra post for pagination testing.",
            imageUrl: "https://example.com/3.jpg",
            date: new Date("2025-01-03T00:00:00.000Z"),
            category: "React",
            tags: "Front-End,Pagination",
            views: 7,
            active: true,
          },
          {
            id: 8,
            title: "Pagination test 4",
            urlId: "pagination-test-4",
            description: "Extra post for pagination",
            content: "This is an extra post for pagination testing.",
            imageUrl: "https://example.com/4.jpg",
            date: new Date("2025-01-04T00:00:00.000Z"),
            category: "React",
            tags: "Front-End,Pagination",
            views: 8,
            active: true,
          },
          {
            id: 9,
            title: "Pagination test 5",
            urlId: "pagination-test-5",
            description: "Extra post for pagination",
            content: "This is an extra post for pagination testing.",
            imageUrl: "https://example.com/5.jpg",
            date: new Date("2025-01-05T00:00:00.000Z"),
            category: "React",
            tags: "Front-End,Pagination",
            views: 9,
            active: true,
          },
        ],
      });

      await page.goto("/search");

      const articles = page.locator('[data-test-id^="blog-post-"]');
      await expect(articles).toHaveCount(4);
      await expect(page.getByText("Page 1")).toBeVisible();
      await expect(page.getByRole("navigation", { name: "Post pages" })).toBeVisible();

      await page.getByRole("link", { name: "Next" }).click();

      await expect(page).toHaveURL(/\/search\?q=&page=2$/);
      await expect(page.getByText("Page 2")).toBeVisible();

      await page.getByRole("link", { name: "Previous" }).click();

      await expect(page).toHaveURL(/\/search\?q=&page=1$/);
      await expect(page.getByText("Page 1")).toBeVisible();
    },
  );

  test(
    "Existing search result",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/search?q=Fat");

      // SEARCH SCREEN > Displays results based on search string stored in the query string (e.g. /search?q=Fat)

      // console.log(await page.innerHTML("body"));

      const articles = await page.locator('[data-test-id^="blog-post-"]');
      await expect(articles).toHaveCount(1);

      await expect(page.getByTestId("blog-post-2")).toBeVisible();
      await expect(
        page.getByText("Better front ends with Fatboy Slim"),
      ).toBeVisible();
    },
  );

  test(
    "Search finds multiple posts",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/search?q=front");

      // SEARCH SCREEN > Displays results based on search string stored in the query string (e.g. /search?q=Fat)

      const articles = await page.locator('[data-test-id^="blog-post-"]');
      await expect(articles).toHaveCount(2);

      await expect(page.getByTestId("blog-post-2")).toBeVisible();
      await expect(
        page.getByText("Better front ends with Fatboy Slim"),
      ).toBeVisible();

      await expect(page.getByTestId("blog-post-3")).toBeVisible();
      await expect(
        page.getByText("No front end framework is the best"),
      ).toBeVisible();
    },
  );

  test(
    "Invalid Search",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/search?q=abc");

      // SEARCH SCREEN > Displays "0 Posts" when search does not find anything

      const articles = await page.locator('[data-test-id^="blog-post-"]');
      await expect(articles).toHaveCount(0);

      await expect(page.getByText("0 Posts")).toBeVisible();
    },
  );
});

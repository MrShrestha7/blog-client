"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import ThemeSwitch from "../Themes/ThemeSwitcher";

function debounce(
  callback: (event: ChangeEvent<HTMLInputElement>) => void,
  delay = 300,
) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return (event: ChangeEvent<HTMLInputElement>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      callback(event);
    }, delay);
  };
}

export function TopMenu({ query = "" }: { query?: string }) {
  const router = useRouter();

  const handleSearch = debounce(
    (event: ChangeEvent<HTMLInputElement>) => {
      const search = event.target.value.trim();

      if (search) {
        router.push(`/search?q=${encodeURIComponent(search)}`);
      } else {
        router.push("/");
      }
    },
    300,
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const search = String(formData.get("q") ?? "").trim();

    if (search) {
      router.push(`/search?q=${encodeURIComponent(search)}`);
    } else {
      router.push("/");
    }
  }

  return (
    <header className="flex items-center gap-4 border-b border-gray-200 px-6 py-4 dark:border-gray-800">
      <form
        action="/search"
        method="GET"
        onSubmit={handleSubmit}
        className="relative flex-1"
      >
        <label htmlFor="blog-search" className="sr-only">
          Search blog posts
        </label>

        <input
          id="blog-search"
          name="q"
          type="search"
          defaultValue={query}
          onChange={handleSearch}
          placeholder="Search blog posts"
          autoComplete="off"
          className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-primary outline-none focus:border-wsu focus:ring-2 focus:ring-wsu/20 dark:border-gray-700"
        />
      </form>

      <ThemeSwitch />
    </header>
  );
}
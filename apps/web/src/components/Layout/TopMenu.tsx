"use client";

import type { ChangeEvent, FormEvent } from "react";
import Link from "next/link";
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
    <header className="mx-auto grid max-w-[1180px] grid-cols-[auto_1fr_auto] items-center gap-5 border-b border-[var(--rule)] bg-[var(--surface)] px-6 py-6 md:px-12">
      <Link href="/" className="flex items-center gap-2.5 whitespace-nowrap font-serif text-2xl font-bold italic text-[var(--text)] no-underline md:text-3xl">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-[#1f537b] font-sans text-base not-italic text-[#72d1de]">fs</span>
        field notes
      </Link>
      <form
        action="/search"
        method="GET"
        onSubmit={handleSubmit}
        className="relative min-w-0"
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
          placeholder="Search the archive"
          autoComplete="off"
          className="w-full border-b border-[var(--rule)] bg-transparent px-1 py-2 font-sans text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-secondary)] focus:border-[var(--accent)]"
        />
      </form>

      <div className="flex items-center gap-3">
        <Link href="/" className="hidden font-sans text-xs text-[var(--text-secondary)] no-underline sm:block">Latest stories</Link>
        <Link href="/about" className="font-sans text-xs text-[var(--text-secondary)] no-underline hover:text-[var(--accent)]">About</Link>
        <Link href="/contact" className="font-sans text-xs text-[var(--text-secondary)] no-underline hover:text-[var(--accent)]">Contact</Link>
        <ThemeSwitch />
      </div>
    </header>
  );
}
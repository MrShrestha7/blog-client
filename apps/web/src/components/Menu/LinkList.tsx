import type { PropsWithChildren } from "react";

export function LinkList({
  title,
  children,
}: PropsWithChildren<{ title: string }>) {
  return (
    <section>
      <h2 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-secondary">
        {title}
      </h2>

      <ul role="list" className="space-y-1">
        {children}
      </ul>
    </section>
  );
}
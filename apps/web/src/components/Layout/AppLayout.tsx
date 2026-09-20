import type { PropsWithChildren } from "react";
import { Content } from "../Content";
import { TopMenu } from "./TopMenu";

export function AppLayout({
  children,
  query,
}: PropsWithChildren<{ query?: string }>) {
  return (
    <div className="min-h-screen bg-[var(--canvas)] text-[var(--text)]">
      <Content>
        <TopMenu query={query} />
        <div className="mx-auto max-w-[1180px] bg-[var(--surface)] px-6 py-8 md:px-12 md:py-10">
          {children}
        </div>
      </Content>
    </div>
  );
}
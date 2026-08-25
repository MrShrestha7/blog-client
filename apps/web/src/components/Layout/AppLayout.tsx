import type { PropsWithChildren } from "react";
import { Content } from "../Content";
import { LeftMenu } from "../Menu/LeftMenu";
import { TopMenu } from "./TopMenu";

export function AppLayout({
  children,
  query,
}: PropsWithChildren<{ query?: string }>) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)] md:flex">
      <LeftMenu />

      <div className="min-w-0 flex-1 md:pl-72">
        <Content>
          <TopMenu query={query} />
          {children}
        </Content>
      </div>
    </div>
  );
}
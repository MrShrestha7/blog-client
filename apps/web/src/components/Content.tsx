import type { PropsWithChildren } from "react";

export function Content({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen w-full">
      {children}
    </div>
  );
}
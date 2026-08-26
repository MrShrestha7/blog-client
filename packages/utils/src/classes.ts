export type ClassValue =
  | string
  | null
  | undefined
  | false
  | Record<string, boolean | null | undefined>;

export function classes(...values: ClassValue[]): string {
  return values
    .flatMap((value) => {
      if (!value) {
        return [];
      }

      if (typeof value === "string") {
        return [value];
      }

      return Object.entries(value)
        .filter(([, enabled]) => Boolean(enabled))
        .map(([className]) => className);
    })
    .join(" ");
}

export const cx = classes;
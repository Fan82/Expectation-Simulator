// src/application/quickChanges.ts
export type QuickChange = "halve" | "minus30";

export function isQuickChange(value: string | undefined): value is QuickChange {
  return value === "halve" || value === "minus30";
}

export function applyQuickChange(available: number, change: QuickChange): number {
  switch (change) {
    case "halve":
      return Math.floor(available / 2);
    case "minus30":
        return Math.max(0, available - 30)
  }
}
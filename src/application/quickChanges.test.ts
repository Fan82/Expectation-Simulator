import { it, expect } from "vitest";
import { applyQuickChange } from "../application/quickChanges";

it("halve: 60 → 30", () => {
  expect(applyQuickChange(60, "halve")).toBe(30);
});

it("halve: 45 → 22, rounded down", () => {
  expect(applyQuickChange(45, "halve")).toBe(22);
});

it("halve: 0 → 0", () => {
  expect(applyQuickChange(0, "halve")).toBe(0);
});
import { it, expect } from "vitest";
import { applyQuickChange } from "./quickChanges";

it("halve: 60 → 30", () => {
  expect(applyQuickChange(60, "halve")).toBe(30);
});

it("halve: 45 → 22, rounded down", () => {
  expect(applyQuickChange(45, "halve")).toBe(22);
});

it("halve: 0 → 0", () => {
  expect(applyQuickChange(0, "halve")).toBe(0);
});

it("halve: 15 → integer", () => {
  expect(Number.isInteger(applyQuickChange(15, "halve"))).toBe(true);
});

it("minus30: 20 → 0, never negative", () => {
  expect(applyQuickChange(20, "minus30")).toBe(0);
});

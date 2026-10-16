import { describe, it, expect } from "vitest";
import { convertMinutes, hoursToMinutes, MINUTES_PER_DAY } from "./time";

describe("hoursToMinutes", () => {
  it("1.5 hr = 90 min", () => {
    expect(hoursToMinutes(1.5)).toBe(90);
  });
});

describe("MINUTES_PER_DAY", () => {
  it("A day is 1440 min", () => {
    expect(MINUTES_PER_DAY).toBe(1440);
  });
});

describe("convertMinutes", () => {
  it("Every 30 min = Every week 210 min", () => {
    expect(convertMinutes(30, "day", "week")).toBe(210);
  });

  it("Every week 210 min = Every 30 min", () => {
    expect(convertMinutes(210, "week", "day")).toBe(30);
  });

  it("The value will not change during the same period.", () => {
    expect(convertMinutes(45, "day", "day")).toBe(45);
  });

  it("0 min is still 0 after conversion.", () => {
    expect(convertMinutes(0, "day", "week")).toBe(0);
  });

  it("Changing the unit will not change the value.", () => {
    const weekly = convertMinutes(30, "day", "week");
    expect(convertMinutes(weekly, "week", "day")).toBe(30);
  });
});
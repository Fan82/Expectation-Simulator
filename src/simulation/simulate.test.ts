import { it, expect } from "vitest";
import { simulate } from "./simulate";
import type { Goal, TimeBudget, Scenario } from "../domain/types";

const makeScenario = (
  goal: Partial<Goal> = {},
  timeBudget: Partial<TimeBudget> = {},
): Scenario => ({
  goal: { id: "g1", title: "Practice", plannedMinutes: 300, period: "week", ...goal },
  timeBudget: { period: "week", availableMinutes: 240, bufferMinutes: 0, ...timeBudget },
});

it("Available 240, buffer 30, target 300, gap is 90.", () => {
  const result = simulate(makeScenario({}, { bufferMinutes: 30 }));
  expect(result.schedulableMinutes).toBe(210);
  expect(result.gapMinutes).toBe(90);
});

it("When enough time is available, the difference is 0.", () => {
  const result = simulate(makeScenario({}, { availableMinutes: 400 }));
  expect(result.gapMinutes).toBe(0);
});

it("When the buffer exceeds the available time, the available time is 0.", () => {
  const result = simulate(
    makeScenario({}, { availableMinutes: 20, bufferMinutes: 30 }),
  );
  expect(result.schedulableMinutes).toBe(0);
  expect(result.gapMinutes).toBe(300);
});
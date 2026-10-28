import { describe, it, expect } from "vitest";
import {
  createInitialLabState,
  setWeekCount,
  updateWeek,
  MIN_WEEKS,
  MAX_WEEKS,
} from "./scenarioLabState";
import { multiWeekScenarioSchema } from "../domain/multi-week.schema";

describe("scenarioLabState", () => {
  it("creates a valid initial scenario with one week", () => {
    const state = createInitialLabState();

    expect(state.scenario.weeks).toHaveLength(1);
    expect(multiWeekScenarioSchema.safeParse(state.scenario).success).toBe(true);
  });

  it("keeps existing weeks and copies the last week when adding", () => {
    let state = updateWeek(createInitialLabState(), 0, "plannedMinutes", 300);
    state = setWeekCount(state, 3);

    const weeks = state.scenario.weeks;
    expect(weeks).toHaveLength(3);
    expect(weeks[0]?.plannedMinutes).toBe(300);
    expect(weeks[2]?.plannedMinutes).toBe(300);
  });

  it("gives every week a unique id, even after removing and adding", () => {
    let state = setWeekCount(createInitialLabState(), 4);
    state = setWeekCount(state, 2);
    state = setWeekCount(state, 5);

    const ids = state.scenario.weeks.map((week) => week.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(multiWeekScenarioSchema.safeParse(state.scenario).success).toBe(true);
  });

  it("keeps only the first weeks when removing", () => {
    let state = setWeekCount(createInitialLabState(), 3);
    state = updateWeek(state, 0, "availableMinutes", 240);

    const result = setWeekCount(state, 1);

    expect(result.scenario.weeks).toHaveLength(1);
    expect(result.scenario.weeks[0]?.availableMinutes).toBe(240);
  });

  it("clamps the week count to the allowed range", () => {
    const state = createInitialLabState();

    expect(setWeekCount(state, 0).scenario.weeks).toHaveLength(MIN_WEEKS);
    expect(setWeekCount(state, 99).scenario.weeks).toHaveLength(MAX_WEEKS);
  });

  it("updates one week without mutating the original state", () => {
    const state = createInitialLabState();

    const result = updateWeek(state, 0, "plannedMinutes", 120);

    expect(result.scenario.weeks[0]?.plannedMinutes).toBe(120);
    expect(state.scenario.weeks[0]?.plannedMinutes).toBe(0);
    expect(result).not.toBe(state);
  });

  it.each([NaN, -30, 1.5, 99999])("returns the same state for invalid value %s", (value) => {
    const state = createInitialLabState();

    expect(updateWeek(state, 0, "plannedMinutes", value)).toBe(state);
  });

  it("returns the same state for an out-of-range index", () => {
    const state = createInitialLabState();

    expect(updateWeek(state, 5, "plannedMinutes", 120)).toBe(state);
  });
});
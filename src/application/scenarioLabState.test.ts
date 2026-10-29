import { describe, it, expect } from "vitest";
import {
  createInitialLabState,
  setWeekCount,
} from "./scenarioLabState";

describe("setWeekCount", () => {
  it("When increasing the number of weeks, the original number of weeks remains unchanged.", () => {
    const initial = createInitialLabState();
    const grown = setWeekCount(initial, 4);

    expect(grown.scenario.weeks).toHaveLength(4);
    expect(grown.scenario.weeks[0]).toEqual(initial.scenario.weeks[0]);
  });
});
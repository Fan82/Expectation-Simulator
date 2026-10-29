import { describe, it, expect } from "vitest";
import { createInitialLabState, setWeekCount, getActive } from "./scenarioLabState";

describe("setWeekCount", () => {
  it("When increasing the number of weeks, the original number of weeks remains unchanged.", () => {
    const initial = createInitialLabState();
    const grown = setWeekCount(initial, 4);

    expect(getActive(grown).scenario.weeks).toHaveLength(4);
    expect(getActive(grown).scenario.weeks[0]).toEqual(getActive(initial).scenario.weeks[0]);
  });
});
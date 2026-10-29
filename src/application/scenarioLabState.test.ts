import { describe, it, expect } from "vitest";
import {
  createInitialLabState,
  setWeekCount,
} from "./scenarioLabState";

describe("setWeekCount", () => {
  it("增加週數時，原本的週保持不變", () => {
    const initial = createInitialLabState();
    const grown = setWeekCount(initial, 4);

    expect(grown.scenario.weeks).toHaveLength(4);
    expect(grown.scenario.weeks[0]).toEqual(initial.scenario.weeks[0]);
  });
});
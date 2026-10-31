import { describe, it, expect } from "vitest";
import {
  createInitialLabState,
  createExperiment,
  discardExperiment,
  updateWeek,
  updateReserve,
  setWeekCount,
  getActive,
} from "./scenarioLabState";

function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object") {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
}
describe("setWeekCount", () => {
  it("增加週數時保留原本的週", () => {
    const initial = createInitialLabState();
    const grown = setWeekCount(initial, 4);

    expect(getActive(grown).scenario.weeks).toHaveLength(4);
    expect(getActive(grown).scenario.weeks[0]).toEqual(
      getActive(initial).scenario.weeks[0],
    );
  });
});

describe("baseline and experiment", () => {
  it("建立實驗後，內容相同但不是同一個物件", () => {
    const state = createExperiment(createInitialLabState());

    expect(state.experiment).toEqual(state.baseline);
    expect(state.experiment).not.toBe(state.baseline);
    expect(state.active).toBe("experiment");
  });

  it("修改實驗的保留設定，基準不變", () => {
    const withExperiment = createExperiment(createInitialLabState());
    const changed = updateReserve(withExperiment, {
      restDaysPerWeek: 1,
      bufferPercent: 15,
    });

    expect(changed.experiment?.reserve).toEqual({
      restDaysPerWeek: 1,
      bufferPercent: 15,
    });
    expect(changed.baseline.reserve).toEqual({
      restDaysPerWeek: 0,
      bufferPercent: 0,
    });
  });

  it("捨棄實驗後，回到基準", () => {
    const withExperiment = createExperiment(createInitialLabState());
    const discarded = discardExperiment(withExperiment);

    expect(discarded.experiment).toBeNull();
    expect(discarded.active).toBe("baseline");
  });

  it("沒有實驗時，修改會作用在基準上", () => {
    const changed = updateWeek(
      createInitialLabState(),
      0,
      "plannedMinutes",
      999,
    );

    expect(changed.experiment).toBeNull();
    expect(changed.baseline.scenario.weeks[0]?.plannedMinutes).toBe(999);
  });

  it("基準被凍結時修改實驗不會報錯（證明程式完全沒碰基準）", () => {
    const initial = createInitialLabState();
    deepFreeze(initial.baseline);

    expect(() =>
      updateWeek(createExperiment(initial), 0, "plannedMinutes", 999),
    ).not.toThrow();
  });
});

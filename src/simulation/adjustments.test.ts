import { describe, it, expect } from "vitest";
import { simulate } from "./simulate";
import { suggestAdjustments } from "./adjustments";

// 用 Quick Check 的設定（以天計、沒有緩衝）產生結果
const resultFor = (planned: number, available: number) =>
  simulate({
    goal: { id: "g1", title: "Test", plannedMinutes: planned, period: "day" },
    timeBudget: { period: "day", availableMinutes: available, bufferMinutes: 0 },
  });

describe("suggestAdjustments", () => {
  it("returns shorten and reschedule in order", () => {
    const kinds = suggestAdjustments(resultFor(90, 30)).map((a) => a.kind);
    expect(kinds).toEqual(["shorten", "reschedule"]);
  });

  it("shorten lets go of the gap", () => {
    const [shorten] = suggestAdjustments(resultFor(90, 30));
    expect(shorten).toEqual({ kind: "shorten", todayMinutes: 30, deferredMinutes: 0, letGoMinutes: 60 });
  });

  it("reschedule moves the gap to later", () => {
    const [, reschedule] = suggestAdjustments(resultFor(90, 30));
    expect(reschedule).toEqual({ kind: "reschedule", todayMinutes: 30, deferredMinutes: 60, letGoMinutes: 0 });
  });

  it("returns no adjustments when there is no gap", () => {
    expect(suggestAdjustments(resultFor(30, 60))).toEqual([]);
  });

  it("handles zero schedulable time", () => {
    const [shorten] = suggestAdjustments(resultFor(60, 0));
    expect(shorten).toMatchObject({ todayMinutes: 0, letGoMinutes: 60 });
  });

  it("every option adds up to the planned minutes", () => {
    for (const a of suggestAdjustments(resultFor(90, 30))) {
      expect(a.todayMinutes + a.deferredMinutes + a.letGoMinutes).toBe(90);
    }
  });
});
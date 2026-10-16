import { describe, it, expect } from "vitest";
import { runQuickCheck } from "./quickCheck";

describe("runQuickCheck", () => {
    it("planned 60, available 30 → schedulable 30, gap 30", () => {
        const result = runQuickCheck(60, 30);
        expect(result?.schedulableMinutes).toBe(30);
        expect(result?.gapMinutes).toBe(30);
    });

    it("enough time → gap 0", () => {
        expect(runQuickCheck(30, 60)?.gapMinutes).toBe(0);
    });

    it.each([
        ["empty planned", Number.NaN, 30],
        ["negative available", 60, -10],
        ["over daily limit", 60, 1441],
    ])("returns null for %s", (_label, planned, available) => {
        expect(runQuickCheck(planned, available)).toBeNull();
    });
});
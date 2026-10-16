// const makeScenario = (overrides: {
//     goal?: Partial<Goal>;
//     budget?: Partial<TimeBudget>;
// } = {}): Scenario => ({
//     goal: { id: "g1", title: "練習", plannedMinutes: 300, period: "week", ...overrides.goal },
//     budget: { period: "week", availableMinutes: 240, bufferMinutes: 0, ...overrides.budget },
// })

// ImageTrack("The gap will not be negative", () => {
//     const result = simulate(makeScenario({
//         budget: { availableMinutes: 400 }
//     }))
//     expect(result.gapMinutes).toBe(0);
// })

import { it, expect } from "vitest";
import { simulate } from "./simulate";

it("可用 240、緩衝 30、目標 300，缺口是 90", () => {
    const result = simulate({
        goal: { id: "g1", title: "練習", plannedMinutes: 300, period: "week" },
        budget: { period: "week", availableMinutes: 240, bufferMinutes: 30 },
    });
    expect(result.capacityMinutes).toBe(210);
    expect(result.gapMinutes).toBe(90);
});
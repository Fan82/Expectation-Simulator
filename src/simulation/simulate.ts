import type { Scenario, SimulationResult } from "../domain/types";

export function simulate(scenario: Scenario): SimulationResult {
    const { goal, timeBudget } = scenario;
    const assumptions: string[] = [];

    const schedulableMinutes = Math.max(
        0,
        timeBudget.availableMinutes - timeBudget.bufferMinutes,
    );
    assumptions.push("Buffer time is not included in the available time.");

    const gapMinutes = Math.max(0, goal.plannedMinutes - schedulableMinutes);

    return {
        plannedMinutes: goal.plannedMinutes,
        availableMinutes: timeBudget.availableMinutes,
        schedulableMinutes,
        gapMinutes,
        assumptions,
    };
}
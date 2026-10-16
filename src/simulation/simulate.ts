import { convertMinutes } from "../domain/time";
import type { Scenario, SimulationResult } from "../domain/types";

export function simulate(scenario: Scenario): SimulationResult {
    const { goal, timeBudget } = scenario;
    const assumptions: string[] = [];

    const period = goal.period === timeBudget.period ? goal.period : "week";

    if (goal.period !== timeBudget.period) {
        assumptions.push("Every Week is 7 days")
    }

    const plannedMinutes = convertMinutes(goal.plannedMinutes, goal.period, period);
    const availableMinutes = convertMinutes(timeBudget.availableMinutes, timeBudget.period, period);
    const bufferMinutes = convertMinutes(timeBudget.bufferMinutes, timeBudget.period, period);

    const schedulableMinutes = Math.max(0, availableMinutes - bufferMinutes);
    assumptions.push("Buffer time is not included in the available time.");

    const gapMinutes = Math.max(0, plannedMinutes - schedulableMinutes);

    return{
        period,
        plannedMinutes,
        availableMinutes,
        schedulableMinutes,
        gapMinutes,
        assumptions
    }


}
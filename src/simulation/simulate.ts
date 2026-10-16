export function simulate(scenario: Scenario): SimulationResult {
    const assumptions: string[] = [];
    const capacityMinutes = Math.max(
        0, scenario.budget.availableMinutes - scenario.budget.bufferMinutes,
    );
    assumptions.push("Buffer time is not included in the available time.")

    const gapMinutes = Math.max(
        0, scenario.goal.plannedMinutes - capacityMinutes,
    )

    return {
        period: scenario.goal.period,
        plannedMinutes: scenario.goal.plannedMinutes,
        capacityMinutes,
        gapMinutes,
        assumptions
    }
}
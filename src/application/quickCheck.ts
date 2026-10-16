import type { Goal, TimeBudget, SimulationResult } from "../domain/types";
import { GoalSchema, TimeBudgetSchema } from "../domain/schemas";
import { simulate } from "../simulation/simulate";

export function runQuickCheck(planned: number, available: number): SimulationResult | null {
    const goal: Goal = { id: "quick-check", title: "Today Plan", plannedMinutes: planned, period: "day" };
    const timeBudget: TimeBudget = { period: "day", availableMinutes: available, bufferMinutes: 0 };

    const goalOk = GoalSchema.safeParse(goal).success;
    const budgetOk = TimeBudgetSchema.safeParse(timeBudget).success;
    if (!goalOk || !budgetOk) {
        return null;
    }

    return simulate({ goal, timeBudget });
}
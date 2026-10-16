import type { Goal, TimeBudget, SimulationResult } from "../domain/types";
import { GoalSchema, TimeBudgetSchema } from "../domain/schemas";
import { simulate } from "../simulation/simulate";

export type QuickCheckField = "planned" | "available";
export type QuickCheckIssue = { field: QuickCheckField; message: string };
export type QuickCheckOutcome =
    | { status: "empty" }
    | { status: "invalid"; issues: QuickCheckIssue[] }
    | { status: "ok"; result: SimulationResult };

export function runQuickCheck(planned: number, available: number): QuickCheckOutcome {
    const goal: Goal = { id: "quick-check", title: "Today Plan", plannedMinutes: planned, period: "day" };
    const timeBudget: TimeBudget = { period: "day", availableMinutes: available, bufferMinutes: 0 };
    const issues: QuickCheckIssue[] = [];

    if (!Number.isNaN(planned)) {
        const check = GoalSchema.safeParse(goal);
        if (!check.success) {
            issues.push({ field: "planned", message: check.error.issues[0]?.message ?? "Please check this value" });
        }
    }
    if (!Number.isNaN(available)) {
        const check = TimeBudgetSchema.safeParse(timeBudget);
        if (!check.success) {
            issues.push({
                field: "available",
                message: check.error.issues[0]?.message ?? "Please check this value",
            });
        }
    }

    if (issues.length > 0) return { status: "invalid", issues };
    if (Number.isNaN(planned) || Number.isNaN(available)) return { status: "empty" };
    return { status: "ok", result: simulate({ goal, timeBudget }) };
}
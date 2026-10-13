import * as z from "zod";
import type { PeriodSchema, TimeBudgetSchema } from "./schemas";

export type Minutes = number;
// export type Period = 'day' | 'week';
export type Period = z.infer<typeof PeriodSchema>;
export type Goal = {
    readonly id: string;
    readonly title: string;
    readonly plannedMinutes: Minutes;
    readonly period: Period;
};

// export type TimeBudget = {
//     readonly availableMinutes: Minutes;
//     readonly period: Period;
//     readonly bufferMinutes?: Minutes;
// };

export type Scenario = {
    readonly goal: Goal;
    readonly timeBudget: TimeBudget;
};
export type SimulationResult = {
    readonly plannedMinutes: Minutes;
    readonly availableMinutes: Minutes;
    readonly schedulableMinutes: Minutes;
    readonly gapMinutes: Minutes;
    readonly assumptions: readonly string[];
};

export type TimeBudget = z.infer<typeof TimeBudgetSchema>;
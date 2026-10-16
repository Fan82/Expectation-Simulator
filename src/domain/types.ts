import * as z from "zod";
import type { PeriodSchema, TimeBudgetSchema, GoalSchema } from "./schemas";

export type Minutes = number;
// export type Period = 'day' | 'week';
export type Period = z.infer<typeof PeriodSchema>;
export type Goal = z.infer<typeof GoalSchema>;

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
  readonly period: Period;
};

export type TimeBudget = z.infer<typeof TimeBudgetSchema>;

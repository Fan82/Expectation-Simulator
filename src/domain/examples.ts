// src/domain/examples.ts
import type { Goal, TimeBudget, Scenario, SimulationResult } from './types';

export const exampleGoal = {
  id: 'goal-practice',
  title: 'Daily Practice',
  plannedMinutes: 60,
  period: 'day',
} as const satisfies Goal;

export const exampleBudget  ={
    availableMinutes: 60,
    period: 'day',
    bufferMinutes: 20,
} as const satisfies TimeBudget

export const exampleScenario = {
    goal: exampleGoal,
    timeBudget: exampleBudget,
} as const satisfies Scenario

export const exampleResult = {
    period: "day",
    plannedMinutes: 60,
    availableMinutes: 60,
    schedulableMinutes: 40, // 可安排 = 可用 60 − 緩衝 20 = 40
    gapMinutes: 20,
    assumptions: ['Buffer time will be reserved from available time', 'Scheduled input uses the same time unit as available time'],
} as const satisfies SimulationResult;

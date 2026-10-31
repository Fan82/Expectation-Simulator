import type { Goal } from "./types";

export const PRESET_GOALS = [
  { id: "goal-reading", title: "Reading", plannedMinutes: 30, period: "day" },
  {
    id: "goal-running",
    title: "Weekly Running",
    plannedMinutes: 120,
    period: "week",
  },
  {
    id: "goal-learning",
    title: "Learning English",
    plannedMinutes: 60,
    period: "day",
  },
] as const satisfies readonly Goal[];

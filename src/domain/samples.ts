import type { MultiWeekScenario } from "./multi-week.ts"

export const sampleMultiWeekScenario: MultiWeekScenario = {
    id: "scenario-sample-1",
    goalId: "goal-sample-1",
    label: "4 weeks practice plan",
    weeks: [
        { weekIndex: 1, plannedMinutes: 300, availableMinutes: 300 },
        { weekIndex: 2, plannedMinutes: 300, availableMinutes: 300 },
        { weekIndex: 3, plannedMinutes: 300, availableMinutes: 120, note: "Business trip week" },
        { weekIndex: 4, plannedMinutes: 300, availableMinutes: 300 },
    ],
}
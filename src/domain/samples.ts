import type { MultiWeekScenario } from "./multi-week.ts"

export const sampleMultiWeekScenario: MultiWeekScenario = {
    id: "scenario-sample-1",
    goalId: "goal-sample-1",
    label: 'Business trip week FOR 4 WEEKS',
    weeks: [
        { id: 'w1', plannedMinutes: 300, availableMinutes: 300 },
        { id: 'w2', plannedMinutes: 300, availableMinutes: 300 },
        { id: 'w3', plannedMinutes: 300, availableMinutes: 120, note: 'Business trip week' },
        { id: 'w4', plannedMinutes: 300, availableMinutes: 300 },
    ],
}
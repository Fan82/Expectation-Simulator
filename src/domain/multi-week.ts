export const MAX_WEEKS = 12

export type WeekPlan = {
    readonly weekIndex: number;
    readonly plannedMinutes: number;
    readonly availableMinutes: number;
    readonly note?: string | undefined;
}

export type MultiWeekScenario = {
    readonly id: string;
    readonly goalId: string;
    readonly label: string;
    readonly weeks: readonly WeekPlan[];
}

export const getWeekCount = (s: MultiWeekScenario ): number => s.weeks.length;
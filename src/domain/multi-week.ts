export const MAX_WEEKS = 12

export type WeekCapacity = Readonly<{
    id: string;
    plannedMinutes: number;
    availableMinutes: number;
    note?: string | undefined;
}>

export type WeekPlan = {
    readonly weekIndex: number;
    readonly plannedMinutes: number;
    readonly availableMinutes: number;
    readonly note?: string | undefined;
}

export type MultiWeekScenario = Readonly<{
    id: string;
    goalId: string;
    label: string;
    weeks: readonly WeekCapacity[];
}>;

export const getWeekCount = (s: MultiWeekScenario): number => s.weeks.length;
export const MAX_WEEKS = 12;

export type WeekCapacity = Readonly<{
    id: string;
    plannedMinutes: number;
    availableMinutes: number;
    note?: string | undefined;
}>;

// multi-week.schema.ts 還在使用，今天先保留
export type WeekPlan = {
    readonly weekIndex: number;
    readonly plannedMinutes: number;
    readonly availableMinutes: number;
    readonly note?: string | undefined;
};

export type MultiWeekScenario = Readonly<{
    id: string;
    goalId: string;
    label: string;
    weeks: readonly WeekCapacity[];
}>;

export type WeekResult = Readonly<{
    weekId: string;
    weekIndex: number;
    plannedMinutes: number;
    availableMinutes: number;
    investedMinutes: number;
    unallocatedMinutes: number;
    spareMinutes: number;
    cumulativeInvestedMinutes: number;
}>;

export type MultiWeekResult = Readonly<{
    scenarioId: string;
    weeks: readonly WeekResult[];
    totals: Readonly<{
        plannedMinutes: number;
        availableMinutes: number;
        investedMinutes: number;
        unallocatedMinutes: number;
        spareMinutes: number;
    }>;
    assumptions: readonly string[];
}>;

export const getWeekCount = (s: MultiWeekScenario): number => s.weeks.length;
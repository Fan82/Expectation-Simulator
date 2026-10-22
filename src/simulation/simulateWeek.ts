import type { WeekCapacity, WeekResult } from '../domain/multi-week';

export function simulateWeek(
    week: WeekCapacity,
    weekIndex: number,
): Omit<WeekResult, 'cumulativeInvestedMinutes'> {
    const investedMinutes = Math.min(week.plannedMinutes, week.availableMinutes);
    return {
        weekId: week.id,
        weekIndex,
        plannedMinutes: week.plannedMinutes,
        availableMinutes: week.availableMinutes,
        investedMinutes,
        unallocatedMinutes: week.plannedMinutes - investedMinutes,
        spareMinutes: week.availableMinutes - investedMinutes,
    }
}
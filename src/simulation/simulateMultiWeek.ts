import type { MultiWeekScenario, WeekResult } from '../domain/multi-week';
import { simulateWeek } from './simulateWeek';
import { applyReserve, type ReserveSettings } from './reserve';

export function simulateMultiWeek(
    scenario: MultiWeekScenario,
    settings: ReserveSettings = { restDaysPerWeek: 0, bufferPercent: 0 },
) {
    let cumulative = 0;
    const weeks = scenario.weeks.map((week, i) => {
        const reserve = applyReserve(week.availableMinutes, settings); 
        const reservedWeek = { ...week, availableMinutes: reserve.usableMinutes };

        const result = simulateWeek(reservedWeek, i);
        cumulative += result.investedMinutes;
        return { ...result, reserve, cumulativeInvestedMinutes: cumulative };
    });

    const sum = (key: keyof Omit<WeekResult, 'weekId' | 'weekIndex' | 'cumulativeInvestedMinutes'>) =>
        weeks.reduce((total, week) => total + week[key], 0);

    const totals = {
        plannedMinutes: sum('plannedMinutes'),
        availableMinutes: sum('availableMinutes'),
        investedMinutes: sum('investedMinutes'),
        unallocatedMinutes: sum('unallocatedMinutes'),
        spareMinutes: sum('spareMinutes'),
    };

    const assumptions = ['weeks-independent'] as const;

    return { scenarioId: scenario.id, weeks, totals, assumptions };
}
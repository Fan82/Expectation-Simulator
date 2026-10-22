import type { MultiWeekScenario, MultiWeekResult, WeekResult } from '../domain/multi-week';
import { simulateWeek } from './simulateWeek';

export function simulateMultiWeek(scenario: MultiWeekScenario): MultiWeekResult {
    let cumulative = 0;
    const weeks = scenario.weeks.map((week, i) => {
        const result = simulateWeek(week, i);
        cumulative += result.investedMinutes;
        return { ...result, cumulativeInvestedMinutes: cumulative };
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
import { describe, it, expect } from 'vitest';
import { simulateMultiWeek } from './simulateMultiWeek';
import type { MultiWeekScenario } from '../domain/multi-week';

const scenario: MultiWeekScenario = {
    id: 's1',
    goalId: 'g1',
    label: '容量變化',
    weeks: [
        { id: 'w1', plannedMinutes: 480, availableMinutes: 600 },
        { id: 'w2', plannedMinutes: 480, availableMinutes: 300 },
        { id: 'w3', plannedMinutes: 480, availableMinutes: 600 },
    ],
};

describe('simulateMultiWeek', () => {
    it('每週投入受當週可用時間限制，總投入為各週加總', () => {
        const result = simulateMultiWeek(scenario);
        expect(result.totals.investedMinutes).toBe(1260);
        expect(result.totals.unallocatedMinutes).toBe(180);
        expect(result.totals.spareMinutes).toBe(240);
        expect(result.weeks.map((w) => w.cumulativeInvestedMinutes)).toEqual([480, 780, 1260]);
    });
});
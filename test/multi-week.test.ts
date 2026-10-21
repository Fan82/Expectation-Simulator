import { describe, it, expect } from 'vitest';
import { multiWeekScenarioSchema } from '../src/domain/multi-week.schema';
import type { MultiWeekScenario } from '../src/domain/multi-week';

const businessTrip: MultiWeekScenario = {
    id: 'scenario-1',
    goalId: 'goal-1',
    label: 'Business trip week FOR 4 WEEKS',
    weeks: [
        { id: 'w1', plannedMinutes: 300, availableMinutes: 300 },
        { id: 'w2', plannedMinutes: 300, availableMinutes: 300 },
        { id: 'w3', plannedMinutes: 300, availableMinutes: 120, note: 'Business trip week' },
        { id: 'w4', plannedMinutes: 300, availableMinutes: 300 },
    ],
};

describe('multiWeekScenarioSchema', () => {
    it('接受正常的多週資料', () => {
        expect(multiWeekScenarioSchema.safeParse(businessTrip).success).toBe(true);
    });

    it('拒絕空的 weeks', () => {
        const result = multiWeekScenarioSchema.safeParse({ ...businessTrip, weeks: [] });
        expect(result.success).toBe(false);
    });

    it('拒絕負的分鐘數', () => {
        const result = multiWeekScenarioSchema.safeParse({
            ...businessTrip,
            weeks: [{ id: 'w1', plannedMinutes: 300, availableMinutes: -30 }],
        });
        expect(result.success).toBe(false);
    });

    it('拒絕重複的週 id', () => {
        const result = multiWeekScenarioSchema.safeParse({
            ...businessTrip,
            weeks: [
                { id: 'w1', plannedMinutes: 300, availableMinutes: 300 },
                { id: 'w1', plannedMinutes: 300, availableMinutes: 300 },
            ],
        });
        expect(result.success).toBe(false);
        expect(result.error?.issues[0]?.path).toEqual(['weeks', 1, 'id']);
    });
});
import { z } from "zod"
import { MAX_WEEKS, type WeekPlan, type MultiWeekScenario } from "./multi-week.ts"
import { MINUTES_PER_WEEK } from "./time.ts"

export const weekPlanSchema = z.object({
    weekIndex: z.number().int().min(1),
    plannedMinutes: z.number().int().min(0).max(MINUTES_PER_WEEK),
    availableMinutes: z.number().int().min(0).max(MINUTES_PER_WEEK),
    note: z.string().optional(),
})


export const WeekCapacitySchema = z.object({
    id: z.string().min(1),
    plannedMinutes: z.int().min(0).max(MINUTES_PER_WEEK),
    availableMinutes: z.int().min(0).max(MINUTES_PER_WEEK),
    note: z.string().max(80).optional()
})

export const multiWeekScenarioSchema = z.object({
    id: z.string().min(1),
    goalId: z.string().min(1),
    label: z.string(),
    weeks: z.array(WeekCapacitySchema).min(1).max(MAX_WEEKS),
})
    .superRefine((scenario, ctx) => {
        const seen = new Set<string>();
        scenario.weeks.forEach((week, i) => {
            if (seen.has(week.id)) {
                ctx.addIssue({
                    code: 'custom',
                    message: 'Weeks id can not repeat',
                    path: ['weeks', i, 'id'],
                });
            }
            seen.add(week.id);
        });
    });

export const _weekPlanCheck: WeekPlan = {} as z.infer<typeof weekPlanSchema>
export const _scenarioCheck: MultiWeekScenario = {} as z.infer<typeof multiWeekScenarioSchema>
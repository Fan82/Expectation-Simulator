import { z } from "zod"
import { MAX_WEEKS, type WeekPlan, type MultiWeekScenario } from "./multi-week.ts"
import { MINUTES_PER_WEEK } from "./time.ts"

export const weekPlanSchema = z.object({
    weekIndex: z.number().int().min(1),
    plannedMinutes: z.number().int().min(0).max(MINUTES_PER_WEEK),
    availableMinutes: z.number().int().min(0).max(MINUTES_PER_WEEK),
    note: z.string().optional(),
})

export const multiWeekScenarioSchema = z.object({
    id: z.string().min(1),
    goalId: z.string().min(1),
    label: z.string(),
    weeks: z
        .array(weekPlanSchema)
        .min(1)
        .max(MAX_WEEKS)
        .refine(
            (weeks) => weeks.every((week, index) => week.weekIndex === index + 1),
            {
                error: "Weeks must start at 1 and be consecutive",
            }
        )
})

export const _weekPlanCheck: WeekPlan = {} as z.infer<typeof weekPlanSchema>
export const _scenarioCheck: MultiWeekScenario = {} as z.infer<typeof multiWeekScenarioSchema>
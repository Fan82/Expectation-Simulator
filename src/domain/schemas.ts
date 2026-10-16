import * as z from "zod";
import { LIMITS } from "./limits";

export const PeriodSchema = z.enum(["day", "week"]);
type Period = z.infer<typeof PeriodSchema>;

const fitsPeriod = (minutes: number, period: Period): boolean =>
  minutes <=
  (period === "day" ? LIMITS.maxMinutesPerDay : LIMITS.maxMinutesPerWeek);

const periodLimitMessage = `Up to ${LIMITS.maxMinutesPerDay} minutes per day, ${LIMITS.maxMinutesPerWeek} per week`;

export const MinutesSchema = z
  .number({ error: "Please enter number" })
  .int({ error: "Please enter number" })
  .min(0, { error: "Start by 0" })
  .max(LIMITS.maxMinutesPerWeek, { error: "Most 1440 minutes in a day" });

export const TimeBudgetSchema = z
  .strictObject({
    period: PeriodSchema,
    availableMinutes: MinutesSchema,
    bufferMinutes: MinutesSchema,
  })
  .refine((b) => fitsPeriod(b.availableMinutes, b.period), {
    path: ["availableMinutes"],
    error: periodLimitMessage,
  })
  .readonly();
export const GoalSchema = z
  .strictObject({
    id: z.string().min(1, { error: "Goal ID is required" }),
    title: z.string().trim().min(1, { error: "Give this goal a name" }),
    plannedMinutes: MinutesSchema,
    period: PeriodSchema,
  })
  .refine((g) => fitsPeriod(g.plannedMinutes, g.period), {
    path: ["plannedMinutes"],
    error: periodLimitMessage,
  })
  .readonly();

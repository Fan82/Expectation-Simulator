// src/domain/schemas.ts
import * as z from "zod";
import { LIMITS } from "./limits";

export const PeriodSchema = z.enum(["day", "week"]);
const Minutes = z
  .number("Please enter number")
  .int("Please enter minutes")
  .min(0, "Number must be more than 0")
  .max(LIMITS.maxMinutesPerDay, `Please type 0 to ${LIMITS.maxMinutesPerDay} minutes`);

export const TimeBudgetSchema = z
  .strictObject({
    period: PeriodSchema,
    availableMinutes: Minutes,
    bufferMinutes: Minutes,
  })
  .refine(
    (b) => b.period === "week" || b.availableMinutes <= LIMITS.maxMinutesPerDay,
    { path: ["availableMinutes"], error: `SingleDay 0 to ${LIMITS.maxMinutesPerDay} minutes` },
  );
import { MINUTES_PER_DAY, DAYS_PER_WEEK } from "./time";

export const LIMITS = {
  maxMinutesOerDay: MINUTES_PER_DAY,
  minDaysPerWeek: 0,
  maxDaysPerWeek: DAYS_PER_WEEK,
  maxMinutesPerDay: MINUTES_PER_DAY,
  maxMinutesPerWeek: 7 * 1440,
} as const;

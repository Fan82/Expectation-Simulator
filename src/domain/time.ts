// src/domain/time.ts
import type { Minutes, Period } from './types';
export const MINUTES_PER_HOUR = 60;
export const DAYS_IN_PERIOD: Record<Period, number> = {
  day: 1,
  week: 7,
};

export function convertMinutes(minutes: Minutes, from: Period, to: Period): Minutes {
  return minutes / DAYS_IN_PERIOD[from] * DAYS_IN_PERIOD[to];
}

export function hoursToMinutes(hours: number): Minutes {
  return MINUTES_PER_HOUR * hours;
}
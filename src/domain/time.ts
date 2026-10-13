// src/domain/time.ts
import type { Minutes, Period } from './types';

export const MINUTES_PER_HOUR = 60;
export const HOURS_PER_DAY = 24;
export const MINUTES_PER_DAY = MINUTES_PER_HOUR * HOURS_PER_DAY;
export const DAYS_PER_WEEK = 7;

export const DAYS_IN_PERIOD: Record<Period, number> = {
  day: 1,
  week: DAYS_PER_WEEK,
};

export function convertMinutes(minutes: Minutes, from: Period, to: Period): Minutes {
  return minutes / DAYS_IN_PERIOD[from] * DAYS_IN_PERIOD[to];
}

export function hoursToMinutes(hours: number): number {
  return hours * MINUTES_PER_HOUR;
}
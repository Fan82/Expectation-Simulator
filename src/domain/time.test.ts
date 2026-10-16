import { it, expect } from "vitest";
import { hoursToMinutes  } from "./time";

it('1.5 hr = 90 min', () => {
  expect(hoursToMinutes(1.5)).toBe(90)
})
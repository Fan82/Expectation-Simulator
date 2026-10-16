// src/domain/validation.test.ts
import { describe, it, expect } from "vitest";
import { MinutesSchema } from "./schemas";

describe("MinutesSchema", () => {
  it.each([-30, 1441, Number.NaN, Number.POSITIVE_INFINITY, 3.5])(
    "Reject %s",
    (value) => {
      expect(MinutesSchema.safeParse(value).success).toBe(false);
    },
  );

  it("Accept 1440 minutes (one full day)", () => {
    expect(MinutesSchema.safeParse(1440).success).toBe(true);
  });
});
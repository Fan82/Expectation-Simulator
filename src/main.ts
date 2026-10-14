import { MinutesSchema, GoalSchema, TimeBudgetSchema } from "./domain/schemas";

console.log(MinutesSchema.safeParse(60)); // success: true
console.log(MinutesSchema.safeParse(-30)); // success: false，會看到「時間不會是負數」
console.log(MinutesSchema.safeParse("abc")); // success: false，會看到「請輸入數字」
console.log(
  GoalSchema.safeParse({
    id: "g1",
    title: "練吉他",
    plannedMinutes: 30,
    period: "day",
  }),
); // true
console.log(
  GoalSchema.safeParse({
    id: "g1",
    title: "   ",
    plannedMinutes: -5,
    period: "month",
  }),
); // false
console.log(
  TimeBudgetSchema.safeParse({
    period: "week",
    availableMinutes: 3000,
    bufferMinutes: 0,
  }),
);

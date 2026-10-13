import { validateTimeBudget } from "./domain/validate";

console.log(validateTimeBudget({ period: "day", availableMinutes: 60, bufferMinutes: 20 }));   // ok: true
console.log(validateTimeBudget({ period: "day", availableMinutes: 1440, bufferMinutes: 0 }));  // ok: true（邊界值）
console.log(validateTimeBudget({ period: "day", availableMinutes: 2000, bufferMinutes: 0 }));  // ok: false（超過一天）
console.log(validateTimeBudget({ period: "week", availableMinutes: 2000, bufferMinutes: 0 })); // ok: true（一週合理）
console.log(validateTimeBudget({ period: "day", availableMinutes: -10, bufferMinutes: "abc" })); // ok: false，兩筆 issues
console.log(validateTimeBudget({ period: "day", availableMinutes: NaN, bufferMinutes: 20 }));  // ok: false
console.log(validateTimeBudget({ period: "month", availableMinutes: 60, bufferMinutes: 20 })); // ok: false
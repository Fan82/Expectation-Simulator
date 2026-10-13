import { TimeBudgetSchema } from "./schemas";
import type { TimeBudget } from "./types";

export type ValidationResult<T> =
    | { ok: true; value: T }
    | { ok: false; issues: string[] };

export function validateTimeBudget(input: unknown): ValidationResult<TimeBudget> {
    const result = TimeBudgetSchema.safeParse(input);
    if (result.success) return { ok: true, value: result.data };

    const issues = result.error.issues.map((issue) => {
        const field = issue.path.join(".")
        return field ? `${field} : ${issue.message}` : issue.message
    })

    return { ok: false, issues }
}
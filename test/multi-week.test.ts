import { describe, it, expect } from "vitest"
import { multiWeekScenarioSchema } from "../src/domain/multi-week.schema.ts"
import { sampleMultiWeekScenario } from "../src/domain/samples.ts"

describe("multiWeekScenarioSchema", () => {
    it("Pass example data", () => {
        const result = multiWeekScenarioSchema.safeParse(sampleMultiWeekScenario)
        expect(result.success).toBe(true)
    })

    it("0 week will be refused", () => {
        const result = multiWeekScenarioSchema.safeParse({
            ...sampleMultiWeekScenario,
            weeks: [],
        })
        expect(result.success).toBe(false)
    })
})
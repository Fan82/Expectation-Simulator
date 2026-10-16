import type { Adjustment, SimulationResult } from "../domain/types";

export function suggestAdjustments(result: SimulationResult): readonly Adjustment[] {
    if (result.gapMinutes === 0) {
        return [];
    }

    const shorten: Adjustment = {
        kind: "shorten",
        todayMinutes: result.schedulableMinutes,
        deferredMinutes: 0,
        letGoMinutes: result.gapMinutes,
    };

    const reschedule: Adjustment = {
        kind: "reschedule",
        todayMinutes: result.schedulableMinutes,
        deferredMinutes: result.gapMinutes,
        letGoMinutes: 0,
    };



    return [shorten, reschedule];
}
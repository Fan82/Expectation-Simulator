export type ReserveSettings = {
    restDaysPerWeek: number;
    bufferPercent: number;
}

export type ReserveBreakdown = {
    availableMinutes: number;
    restMinutes: number;
    bufferMinutes: number;
    usableMinutes: number;
}

export function applyReserve(
    availableMinutes: number,
    s: ReserveSettings
): ReserveBreakdown {
    const restMinutes = Math.round((availableMinutes * s.restDaysPerWeek) / 7)
    const afterRest = Math.max(0, availableMinutes - restMinutes)
    const bufferMinutes = Math.round((afterRest * s.bufferPercent) / 100)
    const usableMinutes = Math.max(0, afterRest - bufferMinutes)

    return { availableMinutes, restMinutes, bufferMinutes, usableMinutes }
}
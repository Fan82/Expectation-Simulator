import { describe, it, expect } from 'vitest'
import { applyReserve } from '../reserve'
import { reserveSettingsSchema } from '../../domain/schemas';

describe('applyReserve', () => {
    it('First deduct from rest, then deduct from buffer.', () => {
        const r = applyReserve(600, { restDaysPerWeek: 1, bufferPercent: 15 })
        expect(r).toEqual({
            availableMinutes: 600,
            restMinutes: 86,
            bufferMinutes: 77,
            usableMinutes: 437,
        });
    })

    it("All settings can be used if no settings are saved.", () => {
        const r = applyReserve(600, { restDaysPerWeek: 0, bufferPercent: 0 })
        expect(r.usableMinutes).toBe(600);
    })

    it('When available time is limited, the amount that can be invested will not become negative.', () => {
        const r = applyReserve(0, { restDaysPerWeek: 6, bufferPercent: 50 })
        expect(r.usableMinutes).toBe(0)
    })

    it('The sum of these four numbers equals the initial available time.', () => {
        const r = applyReserve(600, { restDaysPerWeek: 2, bufferPercent: 20 })
        expect(r.restMinutes + r.bufferMinutes + r.usableMinutes).toBe(600)
    })

    it('Reject unreasonable retention settings', () => {
        expect(reserveSettingsSchema.safeParse({ restDaysPerWeek: 7, bufferPercent: 10 }).success).toBe(false)
    })

    it('Accept reasonable retention settings', () => {
        expect(reserveSettingsSchema.safeParse({ restDaysPerWeek: 1, bufferPercent: 15 }).success).toBe(true);
    });

})
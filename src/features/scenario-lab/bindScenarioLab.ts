import {
    isWeekField,
    updateWeek,
    type LabState,
} from "../../application/scenarioLabState";
import { hoursToMinutes } from "../../domain/time";

export function bindScenarioLab(
    weeksEl: HTMLElement,
    getState: () => LabState,
    setState: (next: LabState) => void,
): void {
    weeksEl.addEventListener("input", (event) => {
        const input = event.target;
        if (!(input instanceof HTMLInputElement)) return;

        const row = input.closest<HTMLElement>("[data-week-index]");
        if (!row) return;
        const index = Number(row.dataset.weekIndex);

        const field = input.name;
        if (!isWeekField(field)) return;

        const minutes = hoursToMinutes(input.valueAsNumber);

        setState(updateWeek(getState(), index, field, minutes));
    });
}
import { reserveSettingsSchema } from '../../domain/schemas';
import type { ReserveSettings } from '../../simulation/reserve';

function getInput(root: HTMLElement, name: string): HTMLInputElement {
    const el = root.querySelector<HTMLInputElement>(`input[name="${name}"]`);
    if (!el) throw new Error(`Not found ${name}`);
    return el;
}

export function createReserveFieldset(
    initial: ReserveSettings,
    onChange: (settings: ReserveSettings) => void,
): HTMLFieldSetElement {
    const fieldset = document.createElement('fieldset');
    fieldset.className = 'scenario-lab__week reserve';
    fieldset.innerHTML = `
    <legend class="scenario-lab__week-title">Keep some space for life</legend>
    <label class="scenario-lab__field">
        <span>Weekly rest days</span>
        <input class="scenario-lab__input" name="restDaysPerWeek" type="number" min="0" max="6" step="1" inputmode="numeric">
    </label>
    <label class="scenario-lab__field">
        <span class="reserve__label-row">Buffer <output class="reserve__value"></output></span>
        <input class="reserve__range" name="bufferPercent" type="range" min="0" max="50" step="5">
    </label>
    <p class="reserve__hint" aria-live="polite"></p>
`;

    const rest = getInput(fieldset, 'restDaysPerWeek');
    const buffer = getInput(fieldset, 'bufferPercent');
    const output = fieldset.querySelector('output')!;
    const hint = fieldset.querySelector('.reserve__hint')!;

    rest.valueAsNumber = initial.restDaysPerWeek;
    buffer.valueAsNumber = initial.bufferPercent;
    output.textContent = `${initial.bufferPercent}%`;

    fieldset.addEventListener('input', () => {
        const result = reserveSettingsSchema.safeParse({
            restDaysPerWeek: rest.valueAsNumber,
            bufferPercent: buffer.valueAsNumber,
        });

        if (!result.success) {
            hint.textContent = 'Rest days 0 to 6';
            return;
        }

        hint.textContent = '';
        output.textContent = `${result.data.bufferPercent}%`;
        onChange(result.data);
    });

    return fieldset;
}
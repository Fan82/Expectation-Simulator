import "./scenarioLab.css";
import {
    createInitialLabState,
    setWeekCount,
    updateWeek,
    isWeekField,
    MIN_WEEKS,
    MAX_WEEKS,
    type LabState,
    type WeekField,
} from "../../application/scenarioLabState";
import { simulateMultiWeek } from "../../simulation/simulateMultiWeek";

const FIELDS: ReadonlyArray<{ field: WeekField; label: string }> = [
    { field: "plannedMinutes", label: "Planned (min)" },
    { field: "availableMinutes", label: "Available (min)" },
];

const ASSUMPTION_TEXT: Record<string, string> = {
    "weeks-independent":
        "Each week is calculated on its own. Unused time does not carry over to the next week.",
};


function el<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    className?: string,
    text?: string,
): HTMLElementTagNameMap[K] {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}

export function renderScenarioLab(container: HTMLElement): void {
    let state: LabState = createInitialLabState();


    const section = el("section", "scenario-lab");
    section.setAttribute("aria-labelledby", "scenario-lab-title");

    const title = el("h2", "scenario-lab__title", "Scenario Lab");
    title.id = "scenario-lab-title";
    const intro = el("p", "scenario-lab__intro", "See how the next few weeks could fit together.");

    const controls = el("div", "scenario-lab__controls");
    const minusButton = el("button", "scenario-lab__step", "−");
    minusButton.type = "button";
    minusButton.setAttribute("aria-label", "Remove a week");
    const weekCountLabel = el("span", "scenario-lab__count");
    weekCountLabel.setAttribute("aria-live", "polite");
    const plusButton = el("button", "scenario-lab__step", "+");
    plusButton.type = "button";
    plusButton.setAttribute("aria-label", "Add a week");
    controls.append(
        el("span", "scenario-lab__count-label", "Weeks"),
        minusButton,
        weekCountLabel,
        plusButton,
    );

    const message = el("p", "scenario-lab__message");
    message.setAttribute("role", "status");

    const form = el("form", "scenario-lab__weeks");
    form.noValidate = true;
    form.addEventListener("submit", (event) => event.preventDefault());

    const summary = el("section", "scenario-lab__summary");
    summary.setAttribute("aria-live", "polite");
    summary.setAttribute("aria-label", "Results");

    section.append(title, intro, controls, message, form, summary);
    container.append(section);

    // ---- 週數改變時才呼叫：重建週卡片 ----
    function renderWeeks(): void {
        const cards = state.scenario.weeks.map((week, index) => {
            const card = el("fieldset", "scenario-lab__week");
            card.append(el("legend", "scenario-lab__week-title", `Week ${index + 1}`));

            for (const { field, label } of FIELDS) {
                const inputLabel = el("label", "scenario-lab__field");
                const input = el("input", "scenario-lab__input");
                input.type = "number";
                input.inputMode = "numeric";
                input.min = "0";
                input.step = "1";
                input.value = String(week[field]);
                input.dataset.week = String(index);
                input.dataset.field = field;

                inputLabel.append(el("span", undefined, label), input);
                card.append(inputLabel);
            }
            return card;
        });

        form.replaceChildren(...cards);
    }

    function renderSummary(): void {
        const result = simulateMultiWeek(state.scenario);

        const totals = el("dl", "scenario-lab__totals");
        const totalItems: Array<[string, number]> = [
            ["Planned", result.totals.plannedMinutes],
            ["Available", result.totals.availableMinutes],
            ["To adjust", result.totals.unallocatedMinutes],
        ];
        for (const [term, value] of totalItems) {
            const item = el("div", "scenario-lab__total");
            item.append(el("dt", undefined, term), el("dd", undefined, `${value} min`));
            totals.append(item);
        }

        const weekList = el("ul", "scenario-lab__gap-list");
        result.weeks.forEach((week, index) => {
            const gap = week.unallocatedMinutes;
            const row = el("li", "scenario-lab__gap-row");
            const text = gap > 0 ? `${gap} min to adjust` : "Fits";
            row.append(el("span", "scenario-lab__gap-label", `Week ${index + 1} · ${text}`));

            const track = el("div", "scenario-lab__gap-track");
            track.setAttribute("aria-hidden", "true");
            const bar = el("div", "scenario-lab__gap-bar");
            const percentage =
                week.plannedMinutes > 0 ? Math.min(100, (gap / week.plannedMinutes) * 100) : 0;
            bar.style.width = `${percentage}%`;
            track.append(bar);

            row.append(track);
            weekList.append(row);
        });

        const assumptions = el("details", "scenario-lab__assumptions");
        assumptions.append(el("summary", undefined, "Model assumptions"));
        const assumptionList = el("ul");
        for (const code of result.assumptions) {
            assumptionList.append(el("li", undefined, ASSUMPTION_TEXT[code] ?? code));
        }
        assumptions.append(assumptionList);

        summary.replaceChildren(totals, weekList, assumptions);
    }

    function renderControls(): void {
        const count = state.scenario.weeks.length;
        weekCountLabel.textContent = `${count} ${count === 1 ? "week" : "weeks"}`;
        minusButton.disabled = count <= MIN_WEEKS;
        plusButton.disabled = count >= MAX_WEEKS;
    }

    function renderAll(): void {
        renderControls();
        renderWeeks();
        renderSummary();
    }

    function changeWeekCount(delta: number): void {
        state = setWeekCount(state, state.scenario.weeks.length + delta);
        message.textContent = "";
        renderAll();
    }

    minusButton.addEventListener("click", () => changeWeekCount(-1));
    plusButton.addEventListener("click", () => changeWeekCount(1));

    form.addEventListener("input", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLInputElement)) return;

        const weekIndex = Number(target.dataset.week);
        const field = target.dataset.field;
        if (!Number.isInteger(weekIndex) || field === undefined || !isWeekField(field)) return;

        const nextState = updateWeek(state, weekIndex, field, target.valueAsNumber);

        if (nextState === state) {
            target.setAttribute("aria-invalid", "true");
            message.textContent = "Please enter a whole number of minutes, from 0 up to one full week.";
            return;
        }

        target.removeAttribute("aria-invalid");
        message.textContent = "";
        state = nextState;
        renderSummary();
    });

    renderAll();
}
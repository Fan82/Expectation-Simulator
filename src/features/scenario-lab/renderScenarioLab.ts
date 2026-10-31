import "./scenarioLab.css";
import {
  createInitialLabState,
  setWeekCount,
  updateWeek,
  isWeekField,
  getActive,
  updateReserve,
  createExperiment,
  discardExperiment,
  setActive,
  MIN_WEEKS,
  MAX_WEEKS,
  type LabState,
  type WeekField,
} from "../../application/scenarioLabState";
import { simulateMultiWeek } from "../../simulation/simulateMultiWeek";
import { createReserveFieldset } from "./reserveFieldset";

const FIELDS: ReadonlyArray<{ field: WeekField; label: string }> = [
  { field: "plannedMinutes", label: "Planned (min)" },
  { field: "availableMinutes", label: "Available (min)" },
];

const ASSUMPTION_TEXT: Record<string, string> = {
  "weeks-independent":
    "Each week is calculated on its own. Unused time does not carry over to the next week.",
  "rest-even-split":
    "Rest time is estimated by spreading available time evenly across 7 days.",
  "rest-before-buffer":
    "Rest is set aside first, then the buffer is taken from the remaining time.",
  "reserve-once-per-week":
    "Rest and buffer are applied once per week. Totals are the sum of each week.",
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
  const intro = el(
    "p",
    "scenario-lab__intro",
    "See how the next few weeks could fit together.",
  );

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

  const variantBar = el("div", "scenario-lab__variants");
  const reserveSlot = el("div");

  section.append(
    title,
    intro,
    variantBar,
    controls,
    message,
    form,
    reserveSlot,
    summary,
  );
  container.append(section);

  function renderWeeks(): void {
    const cards = getActive(state).scenario.weeks.map((week, index) => {
      const card = el("fieldset", "scenario-lab__week");
      card.append(
        el("legend", "scenario-lab__week-title", `Week ${index + 1}`),
      );

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
    const active = getActive(state);
    const result = simulateMultiWeek(active.scenario, active.reserve);

    const totals = el("dl", "scenario-lab__totals");
    const totalItems: Array<[string, number]> = [
      ["Planned", result.totals.plannedMinutes],
      ["Available", result.totals.availableMinutes],
      ["To adjust", result.totals.unallocatedMinutes],
    ];
    for (const [term, value] of totalItems) {
      const item = el("div", "scenario-lab__total");
      item.append(
        el("dt", undefined, term),
        el("dd", undefined, `${value} min`),
      );
      totals.append(item);
    }

    const weekList = el("ul", "scenario-lab__gap-list");
    result.weeks.forEach((week, index) => {
      const gap = week.unallocatedMinutes;
      const row = el("li", "scenario-lab__gap-row");
      const text = gap > 0 ? `${gap} min to adjust` : "Fits";
      row.append(
        el("span", "scenario-lab__gap-label", `Week ${index + 1} · ${text}`),
      );

      const track = el("div", "scenario-lab__gap-track");
      track.setAttribute("aria-hidden", "true");
      const bar = el("div", "scenario-lab__gap-bar");
      const percentage =
        week.plannedMinutes > 0
          ? Math.min(100, (gap / week.plannedMinutes) * 100)
          : 0;
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

  function renderReserve(): void {
    const fieldset = createReserveFieldset(getActive(state).reserve, (next) => {
      state = updateReserve(state, next);
      renderSummary();
    });
    reserveSlot.replaceChildren(fieldset);
  }

  function renderControls(): void {
    const count = getActive(state).scenario.weeks.length;
    weekCountLabel.textContent = `${count} ${count === 1 ? "week" : "weeks"}`;
    minusButton.disabled = count <= MIN_WEEKS;
    plusButton.disabled = count >= MAX_WEEKS;
  }

  function renderVariantBar(): void {
    if (!state.experiment) {
      const tryButton = el("button", "scenario-lab__try", "+ Try a variation");
      tryButton.type = "button";
      tryButton.addEventListener("click", () => {
        state = createExperiment(state);
        renderAll();
        focusSelectedTab();
      });
      variantBar.replaceChildren(tryButton);
      return;
    }

    const tabs = el("div", "scenario-lab__tabs");
    tabs.setAttribute("role", "tablist");
    tabs.setAttribute("aria-label", "Scenario version");

    const options = [
      ["baseline", "Baseline"],
      ["experiment", "Experiment"],
    ] as const;

    for (const [key, label] of options) {
      const selected = state.active === key;
      const tab = el("button", "scenario-lab__tab", label);
      tab.type = "button";
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      tab.addEventListener("click", () => {
        state = setActive(state, key);
        renderAll();
        focusSelectedTab();
      });
      tabs.append(tab);
    }

    tabs.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      state = setActive(
        state,
        state.active === "baseline" ? "experiment" : "baseline",
      );
      renderAll();
      focusSelectedTab();
    });

    const discard = el("button", "scenario-lab__discard", "Discard experiment");
    discard.type = "button";
    discard.addEventListener("click", () => {
      state = discardExperiment(state);
      renderAll();
      variantBar.querySelector("button")?.focus();
    });

    const note = el(
      "p",
      "scenario-lab__variant-note",
      state.active === "experiment"
        ? "Changes here won't touch Baseline."
        : "This is your original plan.",
    );

    variantBar.replaceChildren(tabs, discard, note);
  }

  function focusSelectedTab(): void {
    variantBar
      .querySelector<HTMLButtonElement>('[aria-selected="true"]')
      ?.focus();
  }

  function renderAll(): void {
    renderVariantBar();
    renderControls();
    renderWeeks();
    renderSummary();
    renderReserve();
  }

  function changeWeekCount(delta: number): void {
    state = setWeekCount(state, getActive(state).scenario.weeks.length + delta);
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
    if (
      !Number.isInteger(weekIndex) ||
      field === undefined ||
      !isWeekField(field)
    )
      return;

    const nextState = updateWeek(state, weekIndex, field, target.valueAsNumber);

    if (nextState === state) {
      target.setAttribute("aria-invalid", "true");
      message.textContent =
        "Please enter a whole number of minutes, from 0 up to one full week.";
      return;
    }

    target.removeAttribute("aria-invalid");
    message.textContent = "";
    state = nextState;
    renderSummary();
  });

  renderAll();
}

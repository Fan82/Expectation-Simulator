import type { Adjustment, SimulationResult } from "../../domain/types";
import { runQuickCheck } from "../../application/quickCheck";
import { suggestAdjustments } from "../../simulation/adjustments";

export function renderQuickCheck(root: HTMLElement): void {
  root.innerHTML = `
    <main class="qc">
      <header class="qc-header">
        <h1>Quick Check</h1>
        <p class="qc-lead">Is your available time different from what you planned today?</p>
      </header>

      <form class="qc-card" novalidate>
        <div class="qc-field">
          <label for="planned-minutes">Planned Time (minutes)</label>
          <input id="planned-minutes" type="number" inputmode="numeric"
                 min="0" max="1440" aria-describedby="planned-hint" />
          <p id="planned-hint" class="qc-hint">How much time you originally planned to spend today</p>
        </div>

        <div class="qc-field">
          <label for="available-minutes">Available Time Today (minutes)</label>
          <input id="available-minutes" type="number" inputmode="numeric"
                 min="0" max="1440" aria-describedby="available-hint" />
          <p id="available-hint" class="qc-hint">How much time you actually have after unexpected tasks</p>
        </div>
      </form>

      <section class="qc-result" aria-live="polite">
        <p>Enter your time to see how you can plan your day.</p>
      </section>
    </main>
  `;
  const form = root.querySelector<HTMLFormElement>(".qc-card");
  const planned = root.querySelector<HTMLInputElement>("#planned-minutes");
  const available = root.querySelector<HTMLInputElement>("#available-minutes");
  const resultSection = root.querySelector<HTMLElement>(".qc-result");
  if (!form || !planned || !available || !resultSection) return;

  const update = () => {
    const result = runQuickCheck(planned.valueAsNumber, available.valueAsNumber)
    renderResult(resultSection, result);
  };

  form.addEventListener("input", update);
  update();
}

function el(tag: string, className: string, text: string): HTMLElement {
  const node = document.createElement(tag);
  node.className = className;
  node.textContent = text;
  return node;
}

function renderResult(section: HTMLElement, result: SimulationResult | null): void {
  section.replaceChildren();

  if (result === null) {
    section.dataset.state = "empty";
    section.append(el("p", "", "Enter your time to see how you can plan your day."));
    return;
  }

  section.dataset.state = "result";

  const gapText =
    result.gapMinutes > 0
      ? `${result.gapMinutes} min different from your plan`
      : "Your time today covers the original plan";

  const assumptions = document.createElement("ul");
  assumptions.className = "qc-result-assumptions";
  for (const text of result.assumptions) {
    assumptions.append(el("li", "", text));
  }

  section.append(
    el("p", "qc-result-label", "Schedulable today"),
    el("p", "qc-result-value", `${result.schedulableMinutes} min`),
    el("p", "qc-result-gap", gapText),
    el("p", "qc-result-label", "Model assumptions"),
    assumptions,
    renderAdjustments(result),
  );
}

function describeAdjustment(a: Adjustment, planned: number) {
  switch (a.kind) {
    case "shorten":
      return {
        title: "Shorten today",
        summary: `Today ${a.todayMinutes} min`,
        reason: `${planned} − ${a.todayMinutes} = ${a.letGoMinutes} min let go`,
        assumption: "Assumes this goal can flex today",
      };
    case "reschedule":
      return {
        title: "Move the rest to tomorrow",
        summary: `Today ${a.todayMinutes} min · Tomorrow +${a.deferredMinutes} min`,
        reason: `${planned} − ${a.todayMinutes} = ${a.deferredMinutes} min moved`,
        assumption: "Assumes tomorrow has room for the extra time",
      };
  }
}

function renderAdjustments(result: SimulationResult): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.className = "qc-adjustments";

  const adjustments = suggestAdjustments(result);
  if (adjustments.length === 0) {
    wrapper.append(el("p", "qc-adjust-none", "Your plan fits today. No adjustment needed."));
    return wrapper;
  }

  wrapper.append(el("p", "qc-result-label", "Possible adjustments"));
  for (const a of adjustments) {
    const text = describeAdjustment(a, result.plannedMinutes);
    const card = document.createElement("article");
    card.className = "qc-adjust-card";
    card.append(
      el("h3", "qc-adjust-title", text.title),
      el("p", "qc-adjust-summary", text.summary),
      el("p", "qc-adjust-reason", text.reason),
      el("p", "qc-adjust-assumption", text.assumption),
    );
    wrapper.append(card);
  }
  return wrapper;
}
import type { Adjustment, SimulationResult } from "../../domain/types";
import { runQuickCheck } from "../../application/quickCheck";
import { suggestAdjustments } from "../../simulation/adjustments";
import { isQuickChange, applyQuickChange } from "../../application/quickChanges";

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
                 min="0" max="1440" aria-describedby="planned-hint planned-error" />
          <p id="planned-error" class="qc-error" hidden></p>
          <p id="planned-hint" class="qc-hint">How much time you originally planned to spend today</p>
        </div>

        <div class="qc-field">
          <label for="available-minutes">Available Time Today (minutes)</label>
          <input id="available-minutes" type="number" inputmode="numeric"
                 min="0" max="1440" aria-describedby="available-hint available-error" />
          <p id="available-error" class="qc-error" hidden></p>
          <p id="available-hint" class="qc-hint">How much time you actually have after unexpected tasks</p>
          <p class="qc-hint">What if…</p>
          <div class="qc-changes">
            <button type="button" class="qc-chip" data-change="halve">Halve time</button>
            <button type="button" class="qc-chip" data-change="minus30">30 min less</button>
          </div>
        </div>

        <button type="button" class="qc-reset">Reset</button>
      </form>

      <section class="qc-result" aria-live="polite"></section>
    </main>
  `;

  const form = root.querySelector<HTMLFormElement>(".qc-card");
  const planned = root.querySelector<HTMLInputElement>("#planned-minutes");
  const available = root.querySelector<HTMLInputElement>("#available-minutes");
  const plannedError = root.querySelector<HTMLElement>("#planned-error");
  const availableError = root.querySelector<HTMLElement>("#available-error");
  const resultSection = root.querySelector<HTMLElement>(".qc-result");
  const changes = root.querySelector<HTMLElement>(".qc-changes");
  const reset = root.querySelector<HTMLButtonElement>(".qc-reset");

  if (!form || !planned || !available || !plannedError || !availableError || !resultSection) return;

  const update = () => {
    const outcome = runQuickCheck(planned.valueAsNumber, available.valueAsNumber);
    const issues = outcome.status === "invalid" ? outcome.issues : [];
    showFieldIssue(planned, plannedError, issues.find((i) => i.field === "planned")?.message);
    showFieldIssue(available, availableError, issues.find((i) => i.field === "available")?.message);
    renderResult(resultSection, outcome.status === "ok" ? outcome.result : null);
  };

  form.addEventListener("input", update);

  changes?.addEventListener("click", (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-change]");
    const change = button?.dataset.change;
    if (!isQuickChange(change) || Number.isNaN(available.valueAsNumber)) return;

    available.value = String(applyQuickChange(available.valueAsNumber, change));
    update();
  });

  reset?.addEventListener("click", () => {
    form.reset();
    update();
    planned.focus();
  });

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

function showFieldIssue(input: HTMLInputElement, errorEl: HTMLElement, message: string | undefined) {
  if (message) {
    errorEl.textContent = `ⓘ ${message}`;
    errorEl.hidden = false;
    input.setAttribute("aria-invalid", "true");
  } else {
    errorEl.textContent = "";
    errorEl.hidden = true;
    input.removeAttribute("aria-invalid");
  }
}
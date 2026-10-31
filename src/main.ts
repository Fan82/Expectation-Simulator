import { PRESET_GOALS } from "./domain/presetGoals";
import {
  quickCheckInputFromGoal,
  labStateFromGoal,
} from "./application/goalEntry";
import { renderQuickCheck } from "./features/quick-check/quickCheckView";
import { renderScenarioLab } from "./features/scenario-lab/renderScenarioLab";
import "./ui/tokens.css";
import "./ui/base.css";
import "./features/quick-check/quickCheck.css";

const app = document.querySelector<HTMLElement>("#app");
if (app) {
  // 上面放：目標選單 + 兩個模式按鈕；下面的 #view 放目前的模式畫面
  app.innerHTML = `
    <header class="goal-entry">
      <label for="goal-select">Goal</label>
      <select id="goal-select">
        ${PRESET_GOALS.map((g) => `<option value="${g.id}">${g.title}</option>`).join("")}
      </select>
      <button type="button" data-mode="quick-check">Quick Check</button>
      <button type="button" data-mode="scenario-lab">Scenario Lab</button>
    </header>
    <div id="view"></div>
  `;

  const select = app.querySelector<HTMLSelectElement>("#goal-select")!;
  const view = app.querySelector<HTMLElement>("#view")!;
  let mode = "quick-check";

  function show() {
    const goal =
      PRESET_GOALS.find((g) => g.id === select.value) ?? PRESET_GOALS[0];
    view.replaceChildren();

    if (mode === "quick-check") {
      renderQuickCheck(view, quickCheckInputFromGoal(goal));
    } else {
      renderScenarioLab(view, labStateFromGoal(goal));
    }
  }

  select.addEventListener("change", show);

  app.querySelectorAll<HTMLButtonElement>("[data-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      mode = button.dataset.mode ?? "quick-check";
      show();
    });
  });

  show();
}

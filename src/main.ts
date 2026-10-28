import { renderQuickCheck } from "./features/quick-check/quickCheckView";
import { renderScenarioLab } from "./features/scenario-lab/renderScenarioLab";
import "./ui/tokens.css";
import "./ui/base.css";
import "./features/quick-check/quickCheck.css";

const app = document.querySelector<HTMLElement>("#app");
if (app) {
  renderQuickCheck(app);
  renderScenarioLab(document.querySelector<HTMLElement>("#app")!);
}
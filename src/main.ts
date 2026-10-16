import { renderQuickCheck } from "./features/quick-check/quickCheckView";
import "./ui/tokens.css";
import "./ui/base.css";
import "./features/quick-check/quickCheck.css";

const app = document.querySelector<HTMLElement>("#app");
if (app) {
  renderQuickCheck(app);
}
import type { Goal } from "../domain/types";
import { convertMinutes } from "../domain/time";
import {
  createInitialLabState,
  updateWeek,
  setWeekCount,
} from "./scenarioLabState";

export function quickCheckInputFromGoal(goal: Goal) {
  const daily = Math.round(
    convertMinutes(goal.plannedMinutes, goal.period, "day"),
  );
  return { plannedMinutes: daily, availableMinutes: daily };
}

export function labStateFromGoal(goal: Goal) {
  // 1. 換算成每週分鐘數（參考你練習 2 的寫法，只改最後一格）
  const weekly = Math.round(
    convertMinutes(goal.plannedMinutes, goal.period, "week"),
  );

  let state = createInitialLabState(goal.id);

  // 3. 把第 1 週（index 是 0）的計畫和可用時間都設成 weekly
  state = updateWeek(state, 0, "plannedMinutes", weekly);
  state = updateWeek(state, 0, "availableMinutes", weekly);

  state = setWeekCount(state, 4);

  return state;
}

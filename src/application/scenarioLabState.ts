import {
  MAX_WEEKS,
  type MultiWeekScenario,
  type WeekCapacity,
} from "../domain/multi-week";
import { WeekCapacitySchema } from "../domain/multi-week.schema";

export type LabState = Readonly<{
  scenario: MultiWeekScenario;
}>;

export type WeekField = "plannedMinutes" | "availableMinutes";

export const MIN_WEEKS = 1;
export { MAX_WEEKS };

const DEFAULT_PLANNED_MINUTES = 0;
const DEFAULT_AVAILABLE_MINUTES = 0;

export function createInitialLabState(goalId = "goal-default"): LabState {
  return {
    scenario: {
      id: "lab-scenario",
      goalId,
      label: "Scenario Lab",
      weeks: [
        {
          id: "week-1",
          plannedMinutes: DEFAULT_PLANNED_MINUTES,
          availableMinutes: DEFAULT_AVAILABLE_MINUTES,
        },
      ],
    },
  };
}

function nextWeekId(weeks: readonly WeekCapacity[]): string {
  const used = new Set(weeks.map((week) => week.id));
  let n = weeks.length + 1;
  while (used.has(`week-${n}`)) {
    n += 1;
  }
  return `week-${n}`;
}

export function setWeekCount(state: LabState, count: number): LabState {
  const n = Math.min(MAX_WEEKS, Math.max(MIN_WEEKS, Math.trunc(count)));
  const current = state.scenario.weeks;

  if (n <= current.length) {
    return {
      ...state,
      scenario: { ...state.scenario, weeks: current.slice(0, n) },
    };
  }

  const weeks = [...current];
  while (weeks.length < n) {
    const template = weeks.at(-1);
    weeks.push({
      id: nextWeekId(weeks),
      plannedMinutes: template?.plannedMinutes ?? DEFAULT_PLANNED_MINUTES,
      availableMinutes: template?.availableMinutes ?? DEFAULT_AVAILABLE_MINUTES,
    });
  }

  return { ...state, scenario: { ...state.scenario, weeks } };
}

export function isWeekField(field: string): field is WeekField {
  return field === "plannedMinutes" || field === "availableMinutes";
}

export function updateWeek(
  state: LabState,
  index: number,
  field: WeekField,
  value: number,
): LabState {
  const current = state.scenario.weeks;

  if (index < 0 || index >= current.length) {
    return state;
  }

  const result = WeekCapacitySchema.shape[field].safeParse(value);

  if (!result.success) {
    return state;
  }

  const weeks = current.map((week, i) =>
    i === index ? { ...week, [field]: result.data } : week,
  );

  return { ...state, scenario: { ...state.scenario, weeks } };
}
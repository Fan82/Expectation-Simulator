import type { ReserveSettings } from "../simulation/reserve";
import {
  MAX_WEEKS,
  type MultiWeekScenario,
  type WeekCapacity,
} from "../domain/multi-week";
import { WeekCapacitySchema } from "../domain/multi-week.schema";

const NO_RESERVE: ReserveSettings = { restDaysPerWeek: 0, bufferPercent: 0 };

export function getActive(state: LabState): LabVariant {
  return state.active === "experiment" && state.experiment
    ? state.experiment
    : state.baseline;
}

function updateActive(state: LabState, change: (v: LabVariant) => LabVariant): LabState {
  if (state.active === "experiment" && state.experiment) {
    return { ...state, experiment: change(state.experiment) };
  }
  return { ...state, baseline: change(state.baseline) };
}

export function updateReserve(state: LabState, reserve: ReserveSettings): LabState {
  return updateActive(state, (v) => ({ ...v, reserve }));
}

export function createExperiment(state: LabState): LabState {
  return { ...state, experiment: structuredClone(state.baseline), active: "experiment" };
}

export function setActive(state: LabState, active: LabState["active"]): LabState {
  if (active === "experiment" && !state.experiment) return state;
  return { ...state, active };
}

export function discardExperiment(state: LabState): LabState {
    return { ...state, experiment: null, active: "baseline" };
}

export type LabVariant = {
  scenario: MultiWeekScenario;
  reserve: ReserveSettings;
}

export type LabState = {
  baseline: LabVariant;
  experiment: LabVariant | null;
  active: 'baseline' | 'experiment';
}

export type WeekField = "plannedMinutes" | "availableMinutes";

export const MIN_WEEKS = 1;
export { MAX_WEEKS };

const DEFAULT_PLANNED_MINUTES = 0;
const DEFAULT_AVAILABLE_MINUTES = 0;

export function createInitialLabState(goalId = "goal-default"): LabState {
  return {
    baseline: {
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
      reserve: NO_RESERVE,
    },
    experiment: null,
    active: "baseline",
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
  const current = getActive(state).scenario.weeks;

  if (n <= current.length) {
    return updateActive(state, (v) => ({
      ...v,
      scenario: { ...v.scenario, weeks: current.slice(0, n) },
    }));
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

  return updateActive(state, (v) => ({ ...v, scenario: { ...v.scenario, weeks } }));
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
  const current = getActive(state).scenario.weeks;

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

  return updateActive(state, (v) => ({ ...v, scenario: { ...v.scenario, weeks } }));
}
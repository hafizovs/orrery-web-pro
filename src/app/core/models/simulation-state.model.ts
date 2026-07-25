import { BodyId } from './body-kind.model';
import { BodyRuntimeState } from './body-runtime-state.model';
import { TimeScalePresetId } from '../constants/time.constants';

export interface SimulationState {
  isPlaying: boolean;
  timeScaleDaysPerSecond: number;
  activePreset: TimeScalePresetId | 'custom';
  simulationTimeDays: number;
  bodyStates: Record<BodyId, BodyRuntimeState>;
  selectedBodyId: BodyId | null;
}

import { computed, inject, Injectable, signal } from '@angular/core';
import {
  TIME_SCALE_MAX,
  TIME_SCALE_MIN,
  TIME_SCALE_PRESETS,
  TimeScalePresetId,
} from '../core/constants/time.constants';
import { BodyId } from '../core/models/body-kind.model';
import { BodyRuntimeState } from '../core/models/body-runtime-state.model';
import { BODY_BY_ID, CELESTIAL_BODIES } from '../domain/bodies/body-catalog';
import { PhysicsService } from '../services/physics.service';

@Injectable({ providedIn: 'root' })
export class SimulationStore {
  private readonly physics = inject(PhysicsService);

  readonly isPlaying = signal(true);
  readonly timeScaleDaysPerSecond = signal<number>(TIME_SCALE_PRESETS.day);
  readonly activePreset = signal<TimeScalePresetId | 'custom'>('day');
  readonly simulationTimeDays = signal(0);
  readonly bodyStates = signal<Record<BodyId, BodyRuntimeState>>(
    this.physics.computeAll(CELESTIAL_BODIES, 0),
  );
  readonly selectedBodyId = signal<BodyId | null>('earth');

  readonly selectedBodyState = computed(() => {
    const id = this.selectedBodyId();
    if (!id) {
      return null;
    }
    return this.bodyStates()[id] ?? null;
  });

  readonly selectedBodyDefinition = computed(() => {
    const id = this.selectedBodyId();
    if (!id) {
      return null;
    }
    return BODY_BY_ID[id] ?? null;
  });

  play(): void {
    this.isPlaying.set(true);
  }

  pause(): void {
    this.isPlaying.set(false);
  }

  togglePlay(): void {
    this.isPlaying.update((playing) => !playing);
  }

  setTimeScaleDaysPerSecond(value: number): void {
    if (!Number.isFinite(value)) {
      return;
    }
    const clamped = Math.min(TIME_SCALE_MAX, Math.max(TIME_SCALE_MIN, value));
    this.timeScaleDaysPerSecond.set(clamped);
    const match = (Object.keys(TIME_SCALE_PRESETS) as TimeScalePresetId[]).find(
      (preset) => TIME_SCALE_PRESETS[preset] === clamped,
    );
    this.activePreset.set(match ?? 'custom');
  }

  setSpeedPreset(preset: TimeScalePresetId): void {
    this.timeScaleDaysPerSecond.set(TIME_SCALE_PRESETS[preset]);
    this.activePreset.set(preset);
  }

  /**
   * Step to the next / previous discrete preset (hour → day → month → year).
   */
  stepSpeed(direction: 1 | -1): void {
    const presets = Object.keys(TIME_SCALE_PRESETS) as TimeScalePresetId[];
    const current = this.timeScaleDaysPerSecond();
    const next =
      direction > 0
        ? presets.find((preset) => TIME_SCALE_PRESETS[preset] > current)
        : [...presets].reverse().find((preset) => TIME_SCALE_PRESETS[preset] < current);
    this.setSpeedPreset(next ?? (direction > 0 ? 'year' : 'hour'));
  }

  advance(realDtSeconds: number): void {
    if (!this.isPlaying()) {
      return;
    }
    if (!Number.isFinite(realDtSeconds) || realDtSeconds <= 0) {
      return;
    }
    const nextTime = this.simulationTimeDays() + realDtSeconds * this.timeScaleDaysPerSecond();
    this.simulationTimeDays.set(nextTime);
    this.bodyStates.set(this.physics.computeAll(CELESTIAL_BODIES, nextTime));
  }

  selectBody(id: BodyId): void {
    this.selectedBodyId.set(id);
  }

  clearSelection(): void {
    this.selectedBodyId.set(null);
  }
}

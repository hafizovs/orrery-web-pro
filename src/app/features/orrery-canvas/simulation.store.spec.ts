import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { TIME_SCALE_PRESETS } from '../../core/constants/time.constants';
import { SimulationStore } from './simulation.store';

describe('SimulationStore', () => {
  let store: SimulationStore;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    store = TestBed.inject(SimulationStore);
  });

  it('does not advance simulation time while paused', () => {
    store.pause();
    const before = store.simulationTimeDays();
    store.advance(1);
    expect(store.simulationTimeDays()).toBe(before);
  });

  it("setSpeedPreset('year') sets 365.25 days per second", () => {
    store.setSpeedPreset('year');
    expect(store.timeScaleDaysPerSecond()).toBe(365.25);
    expect(store.timeScaleDaysPerSecond()).toBe(TIME_SCALE_PRESETS.year);
    expect(store.activePreset()).toBe('year');
  });

  it('day preset: advance(1) adds one simulation day', () => {
    store.setSpeedPreset('day');
    store.play();
    const before = store.simulationTimeDays();
    store.advance(1);
    expect(store.simulationTimeDays()).toBeCloseTo(before + 1, 12);
  });
});

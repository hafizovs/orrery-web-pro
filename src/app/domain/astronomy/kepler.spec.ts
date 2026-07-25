import { describe, expect, it } from 'vitest';
import {
  keplerPositionFromElements,
  radiusFromE,
  sampleOrbitPoints,
  trueAnomalyFromE,
} from './kepler';
import { solveEccentricAnomaly } from './newton-raphson';
import { ORBIT_Z_TILT, projectToScene } from './orbital-transform';
import { OrbitalElements } from '../../core/models/orbital-elements.model';
import { EPOCH_J2000_JD } from '../../core/constants/astronomy.constants';

function earthLikeElements(): OrbitalElements {
  return {
    semiMajorAxis: 1.0,
    eccentricity: 0.0167086,
    inclination: (0.00005 * Math.PI) / 180,
    longitudeAscendingNode: (-11.2606 * Math.PI) / 180,
    argumentPeriapsis: (114.2078 * Math.PI) / 180,
    meanAnomalyAtEpoch: (358.617 * Math.PI) / 180,
    periodDays: 365.256,
    epochJd: EPOCH_J2000_JD,
  };
}

describe('kepler', () => {
  it('circular orbit: r === a', () => {
    const a = 2.5;
    const e = 0;
    const M = 1.2;
    const E = solveEccentricAnomaly(M, e);
    const r = radiusFromE(a, E, e);
    expect(r).toBeCloseTo(a, 10);
    const nu = trueAnomalyFromE(E, e);
    expect(nu).toBeCloseTo(E, 10);
  });

  it('sampleOrbitPoints returns the requested number of samples', () => {
    const elements = earthLikeElements();
    const samples = 180;
    const pts = sampleOrbitPoints(elements, samples);
    expect(pts.length).toBe(samples);
    for (const p of pts) {
      expect(Number.isFinite(p.x)).toBe(true);
      expect(Number.isFinite(p.y)).toBe(true);
    }
  });

  it('Earth-like elements produce finite heliocentric position', () => {
    const elements = earthLikeElements();
    const result = keplerPositionFromElements(elements, 0);
    expect(Number.isFinite(result.position.x)).toBe(true);
    expect(Number.isFinite(result.position.y)).toBe(true);
    expect(Number.isFinite(result.radius)).toBe(true);
    expect(result.radius).toBeGreaterThan(0.9);
    expect(result.radius).toBeLessThan(1.1);
  });

  it('projectToScene changes y when z ≠ 0', () => {
    const x = 1;
    const y = 2;
    const z = 3;
    const projected = projectToScene(x, y, z);
    expect(projected.x).toBe(x);
    expect(projected.y).toBe(y - ORBIT_Z_TILT * z);
    expect(projected.y).not.toBe(y);
  });
});

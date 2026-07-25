import { describe, expect, it } from 'vitest';
import { keplerResidual, solveEccentricAnomaly } from './newton-raphson';

describe('solveEccentricAnomaly', () => {
  it('solves circular case e=0, M=1 with E≈1 and residual < 1e-6', () => {
    const M = 1;
    const e = 0;
    const E = solveEccentricAnomaly(M, e);
    expect(E).toBeCloseTo(1, 6);
    expect(keplerResidual(E, M, e)).toBeLessThan(1e-6);
  });

  it('converges for Earth-like eccentricity', () => {
    const e = 0.0167086;
    const M = Math.PI / 2;
    const E = solveEccentricAnomaly(M, e);
    expect(keplerResidual(E, M, e)).toBeLessThan(1e-6);
  });

  it('converges for Halley-like high eccentricity with residual < 1e-4', () => {
    const e = 0.9671429;
    const M = 0.5;
    const E = solveEccentricAnomaly(M, e);
    expect(Number.isFinite(E)).toBe(true);
    expect(keplerResidual(E, M, e)).toBeLessThan(1e-4);
  });

  it('normalizes M outside [0, 2π)', () => {
    const e = 0.1;
    const M = 2 * Math.PI + 0.3;
    const E = solveEccentricAnomaly(M, e);
    const Mnorm = 0.3;
    expect(keplerResidual(E, Mnorm, e)).toBeLessThan(1e-6);

    const Mneg = -0.5;
    const Eneg = solveEccentricAnomaly(Mneg, e);
    const MnegNorm = 2 * Math.PI - 0.5;
    expect(keplerResidual(Eneg, MnegNorm, e)).toBeLessThan(1e-6);
  });
});

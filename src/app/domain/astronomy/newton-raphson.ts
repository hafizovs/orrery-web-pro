import { normalizeAngleToTwoPi } from './anomaly.util';

const EPS = 1e-6;
const MAX_ITER = 50;
const DENOM_FLOOR = 1e-12;
const HIGH_E_THRESHOLD = 0.95;
const HIGH_E_RESIDUAL_LIMIT = 1e-4;

/**
 * Невязка уравнения Кеплера: |E − e sin E − M|.
 */
export function keplerResidual(E: number, M: number, e: number): number {
  return Math.abs(E - e * Math.sin(E) - M);
}

function newtonIterate(M: number, e: number, E0: number): number {
  let E = E0;

  for (let iter = 0; iter < MAX_ITER; iter++) {
    const f = E - e * Math.sin(E) - M;
    let fp = 1 - e * Math.cos(E);

    if (Math.abs(fp) < DENOM_FLOOR) {
      E += 1e-8;
      fp = 1 - e * Math.cos(E);
      if (Math.abs(fp) < DENOM_FLOOR) {
        fp = DENOM_FLOOR * Math.sign(fp || 1);
      }
    }

    const dE = f / fp;
    E -= dE;

    if (Math.abs(dE) < EPS) {
      return E;
    }
  }

  return E;
}

/**
 * Решает уравнение Кеплера M = E − e sin E методом Ньютона–Рафсона.
 * Точность остановки: |ΔE| < 1e-6, maxIter = 50.
 * Для e ≥ 0.95 — multi-start [M, π, π − e], выбор по минимальной невязке.
 */
export function solveEccentricAnomaly(M: number, e: number): number {
  const Mnorm = normalizeAngleToTwoPi(M);

  if (e < 0) {
    throw new Error(`Eccentricity must be non-negative, got e=${e}`);
  }

  if (e >= HIGH_E_THRESHOLD) {
    const starts = [Mnorm, Math.PI, Math.PI - e];
    let bestE = starts[0];
    let bestResidual = Number.POSITIVE_INFINITY;

    for (const start of starts) {
      const E = newtonIterate(Mnorm, e, start);
      const residual = keplerResidual(E, Mnorm, e);
      if (residual < bestResidual) {
        bestResidual = residual;
        bestE = E;
      }
    }

    return bestE;
  }

  const E0 = e < 0.8 ? Mnorm : Math.PI;
  const E = newtonIterate(Mnorm, e, E0);

  if (keplerResidual(E, Mnorm, e) > HIGH_E_RESIDUAL_LIMIT) {
    const starts = [Mnorm, Math.PI, Math.PI - e];
    let bestE = E;
    let bestResidual = keplerResidual(E, Mnorm, e);

    for (const start of starts) {
      const candidate = newtonIterate(Mnorm, e, start);
      const residual = keplerResidual(candidate, Mnorm, e);
      if (residual < bestResidual) {
        bestResidual = residual;
        bestE = candidate;
      }
    }

    return bestE;
  }

  return E;
}

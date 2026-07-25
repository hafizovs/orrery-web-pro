import { Vec2 } from '../../core/models/body-runtime-state.model';
import { OrbitalElements } from '../../core/models/orbital-elements.model';
import { normalizeAngleToTwoPi } from './anomaly.util';
import { solveEccentricAnomaly } from './newton-raphson';
import { eclipticFromOrbital, projectToScene } from './orbital-transform';

/**
 * Средняя аномалия на момент t (сутки от эпохи элементов).
 */
export function meanAnomaly(
  meanAnomalyAtEpoch: number,
  periodDays: number,
  tDays: number
): number {
  const n = (2 * Math.PI) / periodDays;
  return normalizeAngleToTwoPi(meanAnomalyAtEpoch + n * tDays);
}

/**
 * Истинная аномалия ν из эксцентрической аномалии E.
 */
export function trueAnomalyFromE(E: number, e: number): number {
  const denom = 1 - e * Math.cos(E);
  const cosNu = (Math.cos(E) - e) / denom;
  const sinNu = (Math.sqrt(1 - e * e) * Math.sin(E)) / denom;
  return Math.atan2(sinNu, cosNu);
}

/**
 * Радиус-вектор r = a (1 − e cos E); единицы совпадают с a.
 */
export function radiusFromE(a: number, E: number, e: number): number {
  return a * (1 - e * Math.cos(E));
}

/**
 * Позиция в орбитальной плоскости (перицентр along +x).
 */
export function positionInOrbitalPlane(r: number, trueAnomaly: number): Vec2 {
  return {
    x: r * Math.cos(trueAnomaly),
    y: r * Math.sin(trueAnomaly),
  };
}

/**
 * Полный Кеплер-пайплайн: M → E → ν → r → сцена (после эклиптического поворота).
 */
export function keplerPositionFromElements(
  elements: OrbitalElements,
  tDays: number
): {
  meanAnomaly: number;
  eccentricAnomaly: number;
  trueAnomaly: number;
  radius: number;
  position: Vec2;
} {
  const M = meanAnomaly(elements.meanAnomalyAtEpoch, elements.periodDays, tDays);
  const E = solveEccentricAnomaly(M, elements.eccentricity);
  const nu = trueAnomalyFromE(E, elements.eccentricity);
  const r = radiusFromE(elements.semiMajorAxis, E, elements.eccentricity);
  const ecl = eclipticFromOrbital(
    r,
    nu,
    elements.longitudeAscendingNode,
    elements.inclination,
    elements.argumentPeriapsis
  );
  const position = projectToScene(ecl.x, ecl.y, ecl.z);

  return {
    meanAnomaly: M,
    eccentricAnomaly: E,
    trueAnomaly: nu,
    radius: r,
    position,
  };
}

/**
 * Дискретизация орбиты по истинной аномалии через полярное уравнение
 * r = a(1 − e²)/(1 + e cos ν), без Newton на каждом семпле.
 */
export function sampleOrbitPoints(
  elements: OrbitalElements,
  samples: number = 180
): Vec2[] {
  const pts: Vec2[] = [];
  const a = elements.semiMajorAxis;
  const e = elements.eccentricity;
  const oneMinusE2 = 1 - e * e;
  const Omega = elements.longitudeAscendingNode;
  const i = elements.inclination;
  const omega = elements.argumentPeriapsis;

  for (let k = 0; k < samples; k++) {
    const nu = (2 * Math.PI * k) / samples;
    const r = (a * oneMinusE2) / (1 + e * Math.cos(nu));
    const ecl = eclipticFromOrbital(r, nu, Omega, i, omega);
    pts.push(projectToScene(ecl.x, ecl.y, ecl.z));
  }

  return pts;
}

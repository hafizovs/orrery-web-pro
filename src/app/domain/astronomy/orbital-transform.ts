import { Vec2 } from '../../core/models/body-runtime-state.model';

/** Визуальный наклон: y' = y − ORBIT_Z_TILT · z */
export const ORBIT_Z_TILT = 0.15;

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

/**
 * Поворот из орбитальной плоскости в эклиптическую систему (Ω, i, ω).
 * u = ω + ν
 */
export function eclipticFromOrbital(
  r: number,
  trueAnomaly: number,
  longitudeAscendingNode: number,
  inclination: number,
  argumentPeriapsis: number
): Vec3 {
  const Omega = longitudeAscendingNode;
  const i = inclination;
  const u = argumentPeriapsis + trueAnomaly;

  const cosO = Math.cos(Omega);
  const sinO = Math.sin(Omega);
  const cosu = Math.cos(u);
  const sinu = Math.sin(u);
  const cosi = Math.cos(i);
  const sini = Math.sin(i);

  return {
    x: r * (cosO * cosu - sinO * sinu * cosi),
    y: r * (sinO * cosu + cosO * sinu * cosi),
    z: r * (sinu * sini),
  };
}

/**
 * Проекция 3D эклиптики на 2D сцену с лёгким tilt по z.
 */
export function projectToScene(x: number, y: number, z: number): Vec2 {
  return { x, y: y - ORBIT_Z_TILT * z };
}

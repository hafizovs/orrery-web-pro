/**
 * Орбитальная скорость по формуле vis-viva, km/s.
 * μ — стандартный гравитационный параметр (km³/s²);
 * rKm, aKm — расстояние и большая полуось в километрах.
 */
export function computeSpeedKmPerS(mu: number, rKm: number, aKm: number): number {
  if (rKm <= 0 || aKm <= 0) {
    return 0;
  }
  const inside = mu * (2 / rKm - 1 / aKm);
  if (inside <= 0) {
    return 0;
  }
  return Math.sqrt(inside);
}

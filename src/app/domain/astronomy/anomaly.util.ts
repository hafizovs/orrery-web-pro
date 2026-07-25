/**
 * Нормализует угол в полуинтервал [0, 2π).
 */
export function normalizeAngleToTwoPi(angle: number): number {
  const twoPi = Math.PI * 2;
  let a = angle % twoPi;
  if (a < 0) {
    a += twoPi;
  }
  return a;
}

/**
 * Нормализует угол в интервал (−π, π].
 */
export function normalizeAngleToPi(angle: number): number {
  return normalizeAngleToTwoPi(angle + Math.PI) - Math.PI;
}

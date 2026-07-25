/**
 * Formatting helpers for sidebar / compare metrics.
 * Pure functions — no Angular DI.
 */

export function formatMassKg(massKg: number): string {
  if (!Number.isFinite(massKg)) {
    return '—';
  }
  if (massKg >= 1e24) {
    return `${(massKg / 1e24).toFixed(3)}×10²⁴ kg`;
  }
  if (massKg >= 1e21) {
    return `${(massKg / 1e21).toFixed(3)}×10²¹ kg`;
  }
  if (massKg >= 1e18) {
    return `${(massKg / 1e18).toFixed(3)}×10¹⁸ kg`;
  }
  return `${massKg.toExponential(3)} kg`;
}

export function formatAu(valueAu: number, digits = 4): string {
  if (!Number.isFinite(valueAu)) {
    return '—';
  }
  if (Math.abs(valueAu) >= 100) {
    return valueAu.toFixed(2);
  }
  if (Math.abs(valueAu) >= 10) {
    return valueAu.toFixed(3);
  }
  return valueAu.toFixed(digits);
}

export function formatKm(valueKm: number): string {
  if (!Number.isFinite(valueKm)) {
    return '—';
  }
  if (Math.abs(valueKm) >= 1_000_000) {
    return valueKm.toExponential(3);
  }
  if (Math.abs(valueKm) >= 1000) {
    return valueKm.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }
  return valueKm.toFixed(1);
}

export function formatSpeedKmPerS(speed: number): string {
  if (!Number.isFinite(speed)) {
    return '—';
  }
  return speed.toFixed(2);
}

export function formatDegrees(radians: number): string {
  if (!Number.isFinite(radians)) {
    return '—';
  }
  const deg = ((radians * 180) / Math.PI) % 360;
  const normalized = deg < 0 ? deg + 360 : deg;
  return normalized.toFixed(2);
}

export function formatPeriodDays(
  periodDays: number,
  t: (key: string) => string,
): string {
  if (!Number.isFinite(periodDays)) {
    return '—';
  }
  if (periodDays < 1) {
    const hours = periodDays * 24;
    return `${hours.toFixed(2)} h`;
  }
  if (periodDays < 60) {
    return `${periodDays.toFixed(2)} ${t('unit.days')}`;
  }
  if (periodDays < 365.25 * 2) {
    const months = periodDays / 30;
    return `${periodDays.toFixed(1)} ${t('unit.days')} (~${months.toFixed(1)} mo)`;
  }
  const years = periodDays / 365.25;
  return `${periodDays.toFixed(0)} ${t('unit.days')} (~${years.toFixed(2)} yr)`;
}

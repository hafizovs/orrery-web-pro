import { EPOCH_J2000_JD } from '../../core/constants/astronomy.constants';

/**
 * Число суток от заданной юлианской эпохи до JD.
 */
export function daysFromEpochJd(jd: number, epochJd: number = EPOCH_J2000_JD): number {
  return jd - epochJd;
}

/**
 * Юлианская дата по числу суток от эпохи.
 */
export function julianDateFromDaysFromEpoch(
  days: number,
  epochJd: number = EPOCH_J2000_JD
): number {
  return epochJd + days;
}

/**
 * Сутки симуляции относительно эпохи элементов тела.
 * При t_epoch = 0 (все элементы Appendix A на J2000) совпадает с simulationTimeDays.
 */
export function daysFromBodyEpoch(
  simulationTimeDays: number,
  epochJd: number,
  referenceEpochJd: number = EPOCH_J2000_JD
): number {
  return simulationTimeDays - (epochJd - referenceEpochJd);
}

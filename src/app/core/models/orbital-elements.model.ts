/**
 * Кеплеровы элементы относительно эклиптики (для планет/карликов/комет — heliocentric;
 * для Луны — geocentric относительно Земли).
 * Углы — в радианах в рантайм-модели после загрузки из data-файлов.
 *
 * В data-файлах хранятся УГЛЫ В ГРАДУСАХ (как в Appendix A),
 * в рантайме CelestialBody.elements — уже в РАДИАНАХ.
 */
export interface OrbitalElements {
  /** Большая полуось a: для heliocentric — в AU; для Луны — в km */
  semiMajorAxis: number;
  /** Эксцентриситет e (0..1 для эллипса; кометы могут быть близки к 1) */
  eccentricity: number;
  /** Наклонение i, радианы */
  inclination: number;
  /** Долгота восходящего узла Ω, радианы */
  longitudeAscendingNode: number;
  /** Аргумент перицентра ω, радианы */
  argumentPeriapsis: number;
  /** Средняя аномалия на эпоху M0, радианы */
  meanAnomalyAtEpoch: number;
  /** Орбитальный период в земных сутках */
  periodDays: number;
  /** Эпоха элементов, Julian Date */
  epochJd: number;
}

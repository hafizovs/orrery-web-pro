import { BodyId, BodyKind } from './body-kind.model';
import { OrbitalElements } from './orbital-elements.model';

export interface CelestialBody {
  id: BodyId;
  kind: BodyKind;
  /** Ключи i18n: резолвятся через I18nService; храни nameKey */
  nameKey: string;
  /** Родитель для относительных орбит: sun для планет; earth для moon; null для sun */
  parentId: BodyId | null;
  /** Радиус тела, km */
  radiusKm: number;
  /** Масса, kg */
  massKg: number;
  /** Цвет визуализации #RRGGBB */
  color: string;
  /** Вторичный цвет для градиента (тёмная сторона) */
  colorDark: string;
  /** Есть ли кольца (Saturn = true) */
  hasRings: boolean;
  /** Орбитальные элементы; у Солнца = null */
  elements: OrbitalElements | null;
  /** Порядок сортировки в sidebar */
  sortOrder: number;
}

/**
 * Сырая запись каталога: углы в градусах (Appendix A).
 * Конвертируется в CelestialBody в body-catalog.ts.
 */
export interface RawOrbitalBody {
  id: BodyId;
  kind: BodyKind;
  nameKey: string;
  parentId: BodyId | null;
  radiusKm: number;
  massKg: number;
  color: string;
  colorDark: string;
  hasRings: boolean;
  sortOrder: number;
  elements: {
    semiMajorAxis: number;
    eccentricity: number;
    inclinationDeg: number;
    longitudeAscendingNodeDeg: number;
    argumentPeriapsisDeg: number;
    meanAnomalyAtEpochDeg: number;
    periodDays: number;
    epochJd: number;
  } | null;
}

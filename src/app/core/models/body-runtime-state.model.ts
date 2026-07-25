import { BodyId } from './body-kind.model';

export interface Vec2 {
  x: number;
  y: number;
}

/**
 * Позиции в heliocentric ecliptic plane projection (x,y), единицы:
 * - для всех тел, включая Луну после сложения с Earth: AU
 * (Луна: earthPosAU + moonOffsetKm/AU_KM)
 */
export interface BodyRuntimeState {
  id: BodyId;
  /** Позиция в AU, heliocentric */
  positionAu: Vec2;
  /** Истинная аномалия ν, радианы */
  trueAnomaly: number;
  /** Эксцентрическая аномалия E, радианы */
  eccentricAnomaly: number;
  /** Средняя аномалия M, радианы */
  meanAnomaly: number;
  /** Расстояние от Солнца (для Луны — heliocentric distance), AU */
  distanceFromSunAu: number;
  /** Орбитальная скорость, km/s (vis-viva относительно своего primary) */
  speedKmPerS: number;
  /** Расстояние до родителя: для планет = distanceFromSunAu; для Луны — km до Земли */
  distanceToParent: number;
  /** Единица distanceToParent: 'au' | 'km' */
  distanceToParentUnit: 'au' | 'km';
}

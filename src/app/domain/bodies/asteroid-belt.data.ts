export interface AsteroidBeltConfig {
  innerAu: number;
  outerAu: number;
  count: number;
  seed: number;
  color: string;
  alpha: number;
}

/** Schematic main-belt configuration (not N-body). */
export const ASTEROID_BELT: AsteroidBeltConfig = {
  innerAu: 2.1,
  outerAu: 3.3,
  count: 600,
  seed: 42,
  color: '#8b9099',
  alpha: 0.55,
};

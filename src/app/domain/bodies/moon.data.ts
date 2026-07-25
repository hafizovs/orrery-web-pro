import { EPOCH_J2000_JD } from '../../core/constants/astronomy.constants';
import { RawOrbitalBody } from '../../core/models/celestial-body.model';

/** Луна: semiMajorAxis в километрах (geocentric). */
export const MOON_RAW: RawOrbitalBody = {
  id: 'moon',
  kind: 'moon',
  nameKey: 'body.moon',
  parentId: 'earth',
  radiusKm: 1737.4,
  massKg: 7.342e22,
  color: '#cfd6df',
  colorDark: '#6d7580',
  hasRings: false,
  sortOrder: 35,
  elements: {
    semiMajorAxis: 384399,
    eccentricity: 0.0549,
    inclinationDeg: 5.145,
    longitudeAscendingNodeDeg: 125.08,
    argumentPeriapsisDeg: 318.15,
    meanAnomalyAtEpochDeg: 135.27,
    periodDays: 27.321661,
    epochJd: EPOCH_J2000_JD,
  },
};

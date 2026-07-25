import { EPOCH_J2000_JD } from '../../core/constants/astronomy.constants';
import { RawOrbitalBody } from '../../core/models/celestial-body.model';

export const COMETS_RAW: readonly RawOrbitalBody[] = [
  {
    id: 'halley',
    kind: 'comet',
    nameKey: 'body.halley',
    parentId: 'sun',
    radiusKm: 5.5,
    massKg: 2.2e14,
    color: '#9ec9ff',
    colorDark: '#3a5f8c',
    hasRings: false,
    sortOrder: 200,
    elements: {
      semiMajorAxis: 17.834,
      eccentricity: 0.96714,
      inclinationDeg: 162.26,
      longitudeAscendingNodeDeg: 58.42,
      argumentPeriapsisDeg: 111.33,
      meanAnomalyAtEpochDeg: 38.69,
      periodDays: 27793.5,
      epochJd: EPOCH_J2000_JD,
    },
  },
  {
    id: 'encke',
    kind: 'comet',
    nameKey: 'body.encke',
    parentId: 'sun',
    radiusKm: 2.4,
    massKg: 1.0e13,
    color: '#b7ffcf',
    colorDark: '#3d7a55',
    hasRings: false,
    sortOrder: 210,
    elements: {
      semiMajorAxis: 2.215,
      eccentricity: 0.848,
      inclinationDeg: 11.78,
      longitudeAscendingNodeDeg: 334.57,
      argumentPeriapsisDeg: 186.55,
      meanAnomalyAtEpochDeg: 0.0,
      periodDays: 1203.0,
      epochJd: EPOCH_J2000_JD,
    },
  },
];

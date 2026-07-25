import { BodyId } from '../../core/models/body-kind.model';
import {
  CelestialBody,
  RawOrbitalBody,
} from '../../core/models/celestial-body.model';
import { OrbitalElements } from '../../core/models/orbital-elements.model';
import { COMETS_RAW } from './comets.data';
import { DWARFS_RAW } from './dwarfs.data';
import { MOON_RAW } from './moon.data';
import { PLANETS_RAW } from './planets.data';
import { SUN_RAW } from './sun.data';

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toOrbitalElements(
  raw: NonNullable<RawOrbitalBody['elements']>
): OrbitalElements {
  return {
    semiMajorAxis: raw.semiMajorAxis,
    eccentricity: raw.eccentricity,
    inclination: degToRad(raw.inclinationDeg),
    longitudeAscendingNode: degToRad(raw.longitudeAscendingNodeDeg),
    argumentPeriapsis: degToRad(raw.argumentPeriapsisDeg),
    meanAnomalyAtEpoch: degToRad(raw.meanAnomalyAtEpochDeg),
    periodDays: raw.periodDays,
    epochJd: raw.epochJd,
  };
}

function toCelestialBody(raw: RawOrbitalBody): CelestialBody {
  return {
    id: raw.id,
    kind: raw.kind,
    nameKey: raw.nameKey,
    parentId: raw.parentId,
    radiusKm: raw.radiusKm,
    massKg: raw.massKg,
    color: raw.color,
    colorDark: raw.colorDark,
    hasRings: raw.hasRings,
    elements: raw.elements === null ? null : toOrbitalElements(raw.elements),
    sortOrder: raw.sortOrder,
  };
}

const RAW_BODIES: readonly RawOrbitalBody[] = [
  SUN_RAW,
  ...PLANETS_RAW,
  MOON_RAW,
  ...DWARFS_RAW,
  ...COMETS_RAW,
];

export const CELESTIAL_BODIES: readonly CelestialBody[] = RAW_BODIES.map(
  toCelestialBody
).slice()
  .sort((a, b) => a.sortOrder - b.sortOrder);

function buildBodyById(
  bodies: readonly CelestialBody[]
): Readonly<Record<BodyId, CelestialBody>> {
  const map = {} as Record<BodyId, CelestialBody>;
  for (const body of bodies) {
    map[body.id] = body;
  }
  return map;
}

export const BODY_BY_ID: Readonly<Record<BodyId, CelestialBody>> =
  buildBodyById(CELESTIAL_BODIES);

export function getBody(id: BodyId): CelestialBody {
  const body = BODY_BY_ID[id];
  if (!body) {
    throw new Error(`Unknown body id: ${id}`);
  }
  return body;
}

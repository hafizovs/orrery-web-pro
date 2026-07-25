import { Injectable } from '@angular/core';
import { AU_KM, EARTH_MU_KM3_S2, SUN_MU_KM3_S2 } from '../core/constants/astronomy.constants';
import { BodyId } from '../core/models/body-kind.model';
import { BodyRuntimeState } from '../core/models/body-runtime-state.model';
import { CelestialBody } from '../core/models/celestial-body.model';
import { keplerPositionFromElements } from '../domain/astronomy/kepler';
import { computeSpeedKmPerS } from '../domain/astronomy/vis-viva';

/** Alias used in product docs / physics notes. */
const SUN_MU = SUN_MU_KM3_S2;
/** Alias used in product docs / physics notes. */
const EARTH_MU = EARTH_MU_KM3_S2;

@Injectable({ providedIn: 'root' })
export class PhysicsService {
  /**
   * Full Keplerian recalculation for every catalog body at `simulationTimeDays`.
   * Heliocentric bodies first; Moon afterwards (depends on Earth).
   */
  computeAll(
    bodies: readonly CelestialBody[],
    simulationTimeDays: number,
  ): Record<BodyId, BodyRuntimeState> {
    const states = {} as Record<BodyId, BodyRuntimeState>;

    for (const body of bodies) {
      if (body.kind === 'moon') {
        continue;
      }
      if (!body.elements) {
        states[body.id] = this.sunState(body.id);
        continue;
      }
      states[body.id] = this.heliocentricState(body, simulationTimeDays);
    }

    for (const body of bodies) {
      if (body.kind !== 'moon' || !body.elements) {
        continue;
      }
      const earth = states['earth'];
      if (!earth) {
        throw new Error('Cannot compute Moon: Earth state is missing.');
      }
      states[body.id] = this.moonState(body, earth, simulationTimeDays);
    }

    return states;
  }

  private sunState(id: BodyId): BodyRuntimeState {
    return {
      id,
      positionAu: { x: 0, y: 0 },
      trueAnomaly: 0,
      eccentricAnomaly: 0,
      meanAnomaly: 0,
      distanceFromSunAu: 0,
      speedKmPerS: 0,
      distanceToParent: 0,
      distanceToParentUnit: 'au',
    };
  }

  private heliocentricState(body: CelestialBody, tDays: number): BodyRuntimeState {
    const elements = body.elements!;
    const orbit = keplerPositionFromElements(elements, tDays);
    const rAu = orbit.radius;
    return {
      id: body.id,
      positionAu: orbit.position,
      trueAnomaly: orbit.trueAnomaly,
      eccentricAnomaly: orbit.eccentricAnomaly,
      meanAnomaly: orbit.meanAnomaly,
      distanceFromSunAu: rAu,
      speedKmPerS: computeSpeedKmPerS(SUN_MU, rAu * AU_KM, elements.semiMajorAxis * AU_KM),
      distanceToParent: rAu,
      distanceToParentUnit: 'au',
    };
  }

  private moonState(
    body: CelestialBody,
    earth: BodyRuntimeState,
    tDays: number,
  ): BodyRuntimeState {
    const elements = body.elements!;
    const orbit = keplerPositionFromElements(elements, tDays);
    const offsetAuX = orbit.position.x / AU_KM;
    const offsetAuY = orbit.position.y / AU_KM;
    const positionAu = {
      x: earth.positionAu.x + offsetAuX,
      y: earth.positionAu.y + offsetAuY,
    };
    return {
      id: body.id,
      positionAu,
      trueAnomaly: orbit.trueAnomaly,
      eccentricAnomaly: orbit.eccentricAnomaly,
      meanAnomaly: orbit.meanAnomaly,
      distanceFromSunAu: Math.hypot(positionAu.x, positionAu.y),
      speedKmPerS: computeSpeedKmPerS(EARTH_MU, orbit.radius, elements.semiMajorAxis),
      distanceToParent: orbit.radius,
      distanceToParentUnit: 'km',
    };
  }
}

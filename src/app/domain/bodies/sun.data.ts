import { EPOCH_J2000_JD, SUN_MASS_KG, SUN_RADIUS_KM } from '../../core/constants/astronomy.constants';
import { RawOrbitalBody } from '../../core/models/celestial-body.model';

export const SUN_RAW: RawOrbitalBody = {
  id: 'sun',
  kind: 'star',
  nameKey: 'body.sun',
  parentId: null,
  radiusKm: SUN_RADIUS_KM,
  massKg: SUN_MASS_KG,
  color: '#ffd27a',
  colorDark: '#ff8c1a',
  hasRings: false,
  sortOrder: 0,
  elements: null,
};

/** Explicit Appendix A values (epoch unused for sun). */
export const SUN_EPOCH_JD = EPOCH_J2000_JD;

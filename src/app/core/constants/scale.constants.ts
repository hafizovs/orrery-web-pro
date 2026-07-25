/** CSS pixels per 1 AU at zoom=1 in REAL mode (linear). */
export const REAL_PX_PER_AU = 80;

/**
 * REAL: screen radius = radiusKm * REAL_RADIUS_PX_PER_KM * zoom.
 * At zoom=1 Earth (~6371 km) ≈ 0.003 px → MIN clamp → a point (intentional emptiness).
 */
export const REAL_RADIUS_PX_PER_KM = 5e-7;

/** VISUAL: logarithmic orbit compression base (log10). */
export const VISUAL_ORBIT_LOG_BASE = 10;

/** visualOrbitRadius(aAu) = VISUAL_ORBIT_K * log10(1 + aAu * VISUAL_ORBIT_LOG_SCALE). */
export const VISUAL_ORBIT_LOG_SCALE = 12;

/** Visual orbit radius scale factor (px at zoom=1). */
export const VISUAL_ORBIT_K = 220;

/**
 * VISUAL body sizes: screenR = VISUAL_RADIUS_BASE + VISUAL_RADIUS_K * log10(radiusKm).
 */
export const VISUAL_RADIUS_BASE = 2.5;

/** Visual body size log coefficient. */
export const VISUAL_RADIUS_K = 3.8;

/** Sun disk radius in visual mode (before sqrt(zoom)). */
export const VISUAL_SUN_RADIUS_PX = 18;

/** Minimum zoom multiplier. */
export const ZOOM_MIN = 0.15;

/** Maximum zoom multiplier. */
export const ZOOM_MAX = 40;

/** Wheel deltaY → zoom factor sensitivity. */
export const ZOOM_WHEEL_SENSITIVITY = 0.0015;

/** Neptune semi-major axis (AU) for default fit-zoom — appendix A. */
export const NEPTUNE_SEMI_MAJOR_AU = 30.1104;

/** Target Neptune orbit fraction of min(canvas width, height) at default view. */
export const FIT_NEPTUNE_ORBIT_FRACTION = 0.42;

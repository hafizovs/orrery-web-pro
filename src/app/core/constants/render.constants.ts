/** Maximum device pixel ratio applied to the canvas backing store. */
export const MAX_DPR = 2;

/** Number of deterministic background stars. */
export const STARFIELD_COUNT = 400;

/** Seed for starfield mulberry32 PRNG. */
export const STARFIELD_SEED = 1337;

/** Orbit polyline sample count. */
export const ORBIT_SAMPLES = 180;

/** Asteroid belt point count (mirrored in AsteroidBeltConfig). */
export const ASTEROID_BELT_COUNT = 600;

/** Canvas label font. */
export const LABEL_FONT = '12px "Segoe UI", system-ui, sans-serif';

/** Minimum pick hit radius in CSS pixels. */
export const PICK_RADIUS_PX = 14;

/** Clamp for body screen radius (px). */
export const MIN_BODY_SCREEN_RADIUS_PX = 1.25;

/** Clamp for body screen radius (px). */
export const MAX_BODY_SCREEN_RADIUS_PX = 48;

/** Sun glow radius multiplier relative to sun disk radius. */
export const SUN_GLOW_MULTIPLIER = 3.2;

/** Saturn ring inner radius = bodyRadiusPx × this factor. */
export const SATURN_RING_INNER_FACTOR = 1.5;

/** Saturn ring outer radius = bodyRadiusPx × this factor. */
export const SATURN_RING_OUTER_FACTOR = 2.3;

/** Selection accent ring color (icy cyan). */
export const SELECTION_ACCENT_COLOR = '#3dbbff';

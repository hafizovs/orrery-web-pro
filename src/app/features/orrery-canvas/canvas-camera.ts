/**
 * Canvas camera transforms — Orrery Web Pro.
 *
 * Coordinate model (CSS pixels after ctx.setTransform(dpr,…)):
 *   pan is in **screen pixels**
 *   screen = canvasCenter + pan + scenePx
 *
 * where scenePx = mapWorldAuToScenePx(positionAu, mode, zoom).
 * World origin (Sun) maps to scene (0,0). Follow mode sets pan = -scene so the body is centered.
 */

import { BodyKind } from '../../core/models/body-kind.model';
import { Vec2 } from '../../core/models/body-runtime-state.model';
import { ScaleMode } from '../../core/models/scale-mode.model';
import {
  MAX_BODY_SCREEN_RADIUS_PX,
  MIN_BODY_SCREEN_RADIUS_PX,
} from '../../core/constants/render.constants';
import {
  FIT_NEPTUNE_ORBIT_FRACTION,
  NEPTUNE_SEMI_MAJOR_AU,
  REAL_PX_PER_AU,
  REAL_RADIUS_PX_PER_KM,
  VISUAL_ORBIT_K,
  VISUAL_ORBIT_LOG_SCALE,
  VISUAL_RADIUS_BASE,
  VISUAL_RADIUS_K,
  VISUAL_SUN_RADIUS_PX,
  ZOOM_MAX,
  ZOOM_MIN,
} from '../../core/constants/scale.constants';

export function orbitRadiusPx(aAu: number, mode: ScaleMode, zoom: number): number {
  if (mode === 'real') {
    return aAu * REAL_PX_PER_AU * zoom;
  }
  return VISUAL_ORBIT_K * Math.log10(1 + aAu * VISUAL_ORBIT_LOG_SCALE) * zoom;
}

export function mapWorldAuToScenePx(posAu: Vec2, mode: ScaleMode, zoom: number): Vec2 {
  if (mode === 'real') {
    return {
      x: posAu.x * REAL_PX_PER_AU * zoom,
      y: posAu.y * REAL_PX_PER_AU * zoom,
    };
  }
  const r = Math.hypot(posAu.x, posAu.y);
  if (r < 1e-12) {
    return { x: 0, y: 0 };
  }
  const targetR = VISUAL_ORBIT_K * Math.log10(1 + r * VISUAL_ORBIT_LOG_SCALE) * zoom;
  const s = targetR / r;
  return { x: posAu.x * s, y: posAu.y * s };
}

export function bodyRadiusPx(
  radiusKm: number,
  kind: BodyKind,
  mode: ScaleMode,
  zoom: number
): number {
  if (kind === 'star' && mode === 'visual') {
    return VISUAL_SUN_RADIUS_PX * Math.sqrt(zoom);
  }
  let r: number;
  if (mode === 'real') {
    r = radiusKm * REAL_RADIUS_PX_PER_KM * zoom;
  } else {
    r = VISUAL_RADIUS_BASE + VISUAL_RADIUS_K * Math.log10(Math.max(radiusKm, 1));
    r *= Math.sqrt(zoom);
  }
  return Math.min(MAX_BODY_SCREEN_RADIUS_PX, Math.max(MIN_BODY_SCREEN_RADIUS_PX, r));
}

export function worldAuToScreen(
  posAu: Vec2,
  mode: ScaleMode,
  zoom: number,
  panX: number,
  panY: number,
  canvasWidth: number,
  canvasHeight: number
): Vec2 {
  const scene = mapWorldAuToScenePx(posAu, mode, zoom);
  return {
    x: canvasWidth / 2 + panX + scene.x,
    y: canvasHeight / 2 + panY + scene.y,
  };
}

/** Scene-space point under a screen pixel (inverse of screen = center + pan + scene). */
export function screenToScenePx(
  screenX: number,
  screenY: number,
  panX: number,
  panY: number,
  canvasWidth: number,
  canvasHeight: number
): Vec2 {
  return {
    x: screenX - canvasWidth / 2 - panX,
    y: screenY - canvasHeight / 2 - panY,
  };
}

/**
 * Zoom so Neptune's visual characteristic orbit radius equals minDim * 0.42.
 * Uses visual-mode orbit mapping at the given a (Neptune from appendix A).
 */
export function fitNeptuneZoom(minDim: number): number {
  const orbitAtZoom1 = orbitRadiusPx(NEPTUNE_SEMI_MAJOR_AU, 'visual', 1);
  if (orbitAtZoom1 <= 0 || !Number.isFinite(orbitAtZoom1)) {
    return 1;
  }
  const target = minDim * FIT_NEPTUNE_ORBIT_FRACTION;
  const zoom = target / orbitAtZoom1;
  return clampZoom(zoom);
}

export function clampZoom(zoom: number): number {
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoom));
}

/**
 * Cursor-relative zoom with screen-space pan.
 * Scene coordinates scale with zoom from the origin, so pan is adjusted so the
 * scene point under (screenX, screenY) stays fixed on screen.
 */
export function zoomAtCursor(
  screenX: number,
  screenY: number,
  factor: number,
  zoom: number,
  panX: number,
  panY: number,
  canvasWidth: number,
  canvasHeight: number
): { zoom: number; panX: number; panY: number } {
  const nextZoom = clampZoom(zoom * factor);
  if (nextZoom === zoom || zoom === 0) {
    return { zoom: nextZoom, panX, panY };
  }
  const scene = screenToScenePx(screenX, screenY, panX, panY, canvasWidth, canvasHeight);
  const scale = nextZoom / zoom;
  const nextPanX = panX + scene.x * (1 - scale);
  const nextPanY = panY + scene.y * (1 - scale);
  return { zoom: nextZoom, panX: nextPanX, panY: nextPanY };
}

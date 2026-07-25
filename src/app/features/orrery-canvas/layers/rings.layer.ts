import {
  SATURN_RING_INNER_FACTOR,
  SATURN_RING_OUTER_FACTOR,
} from '../../../core/constants/render.constants';
import { CelestialBody } from '../../../core/models/celestial-body.model';
import { ScaleMode } from '../../../core/models/scale-mode.model';
import { bodyRadiusPx } from '../canvas-camera';

/**
 * Draws Saturn's schematic rings as screen-space ellipses under the planet disk.
 * Inner/outer radii are visual factors of bodyRadiusPx (not physical AU rings).
 * Ellipse vertical squash uses Saturn's orbital inclination.
 */
export function drawSaturnRings(
  ctx: CanvasRenderingContext2D,
  body: CelestialBody,
  screenX: number,
  screenY: number,
  mode: ScaleMode,
  zoom: number
): void {
  if (!body.hasRings || body.id !== 'saturn') {
    return;
  }

  const planetR = bodyRadiusPx(body.radiusKm, body.kind, mode, zoom);
  const innerR = planetR * SATURN_RING_INNER_FACTOR;
  const outerR = planetR * SATURN_RING_OUTER_FACTOR;
  const inclination = body.elements?.inclination ?? 0;
  const squash = Math.max(0.18, Math.abs(Math.cos(inclination)));

  ctx.save();
  ctx.translate(screenX, screenY);

  ctx.beginPath();
  ctx.ellipse(0, 0, outerR, outerR * squash, 0, 0, Math.PI * 2);
  ctx.ellipse(0, 0, innerR, innerR * squash, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(210, 190, 150, 0.35)';
  ctx.fill('evenodd');

  ctx.beginPath();
  ctx.ellipse(0, 0, outerR, outerR * squash, 0, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(210, 190, 150, 0.5)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(0, 0, innerR, innerR * squash, 0, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(210, 190, 150, 0.5)';
  ctx.lineWidth = 0.75;
  ctx.stroke();

  ctx.restore();
}

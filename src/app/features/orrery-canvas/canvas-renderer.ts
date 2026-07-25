import { BodyId } from '../../core/models/body-kind.model';
import { BodyRuntimeState } from '../../core/models/body-runtime-state.model';
import { CelestialBody } from '../../core/models/celestial-body.model';
import { LocaleId } from '../../core/models/locale.model';
import { ScaleMode } from '../../core/models/scale-mode.model';
import { drawAsteroidBelt } from './layers/asteroid-belt.layer';
import { drawBodies } from './layers/bodies.layer';
import { drawLabels } from './layers/labels.layer';
import { drawOrbits } from './layers/orbits.layer';
import { drawStarfield } from './layers/starfield.layer';

/**
 * Immutable frame snapshot consumed by the Canvas 2D renderer (docs 05.12).
 */
export interface RenderSnapshot {
  width: number;
  height: number;
  mode: ScaleMode;
  zoom: number;
  panX: number;
  panY: number;
  showLabels: boolean;
  showDwarfs: boolean;
  showComets: boolean;
  selectedBodyId: BodyId | null;
  bodies: CelestialBody[];
  states: Record<BodyId, BodyRuntimeState>;
  simulationTimeDays: number;
  locale: LocaleId;
}

function drawSpaceBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  const cx = width * 0.5;
  const cy = height * 0.45;
  const radius = Math.max(width, height) * 0.85;
  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  gradient.addColorStop(0, '#121a2e');
  gradient.addColorStop(0.45, '#0a0f1c');
  gradient.addColorStop(1, '#03050a');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

/**
 * Draws a full frame in documented layer order:
 * clear gradient bg → starfield → orbits → asteroid belt → bodies (rings inside) → labels
 *
 * Expects `ctx` to already have the DPR transform applied (CSS-pixel coordinates).
 */
export function draw(
  ctx: CanvasRenderingContext2D,
  snapshot: RenderSnapshot,
  translate: (key: string) => string = (key) => key
): void {
  const { width, height } = snapshot;
  if (width <= 0 || height <= 0) {
    return;
  }

  drawSpaceBackground(ctx, width, height);
  drawStarfield(ctx, snapshot);
  drawOrbits(ctx, snapshot);
  drawAsteroidBelt(ctx, snapshot);
  drawBodies(ctx, snapshot);
  drawLabels(ctx, snapshot, translate);
}

/** Class wrapper for DI-friendly use from RenderLoopService. */
export class CanvasRenderer {
  draw(
    ctx: CanvasRenderingContext2D,
    snapshot: RenderSnapshot,
    translate?: (key: string) => string
  ): void {
    draw(ctx, snapshot, translate);
  }
}

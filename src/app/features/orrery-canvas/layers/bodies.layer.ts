import {
  SELECTION_ACCENT_COLOR,
  SUN_GLOW_MULTIPLIER,
} from '../../../core/constants/render.constants';
import type { RenderSnapshot } from '../canvas-renderer';
import { bodyRadiusPx, worldAuToScreen } from '../canvas-camera';
import { drawSaturnRings } from './rings.layer';

/**
 * Draws celestial bodies as shaded spheres (radial gradients).
 * Saturn rings are drawn immediately before Saturn's disk.
 */
export function drawBodies(
  ctx: CanvasRenderingContext2D,
  snapshot: RenderSnapshot
): void {
  const {
    width,
    height,
    mode,
    zoom,
    panX,
    panY,
    bodies,
    states,
    selectedBodyId,
    simulationTimeDays,
  } = snapshot;

  const ordered = [...bodies].sort((a, b) => a.sortOrder - b.sortOrder);

  for (const body of ordered) {
    const state = states[body.id];
    const posAu = state?.positionAu ?? (body.id === 'sun' ? { x: 0, y: 0 } : null);
    if (!posAu) {
      continue;
    }

    const screen = worldAuToScreen(posAu, mode, zoom, panX, panY, width, height);
    const r = bodyRadiusPx(body.radiusKm, body.kind, mode, zoom);

    if (body.hasRings && body.id === 'saturn') {
      drawSaturnRings(ctx, body, screen.x, screen.y, mode, zoom);
    }

    if (body.kind === 'star') {
      drawSunGlow(ctx, screen.x, screen.y, r, simulationTimeDays);
    }

    drawSphere(ctx, screen.x, screen.y, r, body.color, body.colorDark, body.kind === 'star');

    if (body.id === selectedBodyId) {
      ctx.beginPath();
      ctx.strokeStyle = SELECTION_ACCENT_COLOR;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = SELECTION_ACCENT_COLOR;
      ctx.shadowBlur = 6;
      ctx.arc(screen.x, screen.y, r + 3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }
}

function drawSunGlow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  simulationTimeDays: number
): void {
  const pulse = 0.85 + 0.15 * Math.sin(simulationTimeDays * 0.15);
  const glowR = r * SUN_GLOW_MULTIPLIER * pulse;
  const gradient = ctx.createRadialGradient(x, y, r * 0.4, x, y, glowR);
  gradient.addColorStop(0, 'rgba(255, 200, 80, 0.45)');
  gradient.addColorStop(0.45, 'rgba(255, 160, 40, 0.18)');
  gradient.addColorStop(1, 'rgba(255, 140, 20, 0)');
  ctx.beginPath();
  ctx.fillStyle = gradient;
  ctx.arc(x, y, glowR, 0, Math.PI * 2);
  ctx.fill();
}

function drawSphere(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string,
  colorDark: string,
  isSun: boolean
): void {
  const hx = x - 0.35 * r;
  const hy = y - 0.35 * r;
  const gradient = ctx.createRadialGradient(hx, hy, Math.max(0.15 * r, 0.5), x, y, r);
  gradient.addColorStop(0, color);
  gradient.addColorStop(0.55, color);
  gradient.addColorStop(1, colorDark);

  ctx.beginPath();
  ctx.fillStyle = gradient;
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  if (!isSun) {
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 0.75;
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
  }
}

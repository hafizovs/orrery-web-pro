import { ORBIT_SAMPLES } from '../../../core/constants/render.constants';
import { AU_KM } from '../../../core/constants/astronomy.constants';
import { sampleOrbitPoints } from '../../../domain/astronomy/kepler';
import type { RenderSnapshot } from '../canvas-renderer';
import { worldAuToScreen } from '../canvas-camera';

function hexToRgba(hex: string, alpha: number): string {
  const raw = hex.replace('#', '');
  const full =
    raw.length === 3
      ? raw
          .split('')
          .map((c) => c + c)
          .join('')
      : raw;
  const n = Number.parseInt(full, 16);
  if (!Number.isFinite(n)) {
    return `rgba(180, 200, 255, ${alpha})`;
  }
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Draws Kepler orbit polylines for every visible body that has elements.
 * Moon samples are offset by Earth's heliocentric position (AU).
 */
export function drawOrbits(
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
  } = snapshot;

  for (const body of bodies) {
    if (!body.elements) {
      continue;
    }

    const samples = sampleOrbitPoints(body.elements, ORBIT_SAMPLES);
    const isMoon = body.parentId === 'earth';
    const earth = states['earth'];
    const earthPos = earth?.positionAu ?? { x: 0, y: 0 };

    const selected = body.id === selectedBodyId;
    ctx.beginPath();
    ctx.strokeStyle = hexToRgba(body.color, selected ? 0.8 : 0.35);
    ctx.lineWidth = selected ? 1.5 : 1;
    ctx.lineJoin = 'round';

    let started = false;
    for (const sample of samples) {
      let auX = sample.x;
      let auY = sample.y;
      if (isMoon) {
        auX = sample.x / AU_KM + earthPos.x;
        auY = sample.y / AU_KM + earthPos.y;
      }
      const screen = worldAuToScreen(
        { x: auX, y: auY },
        mode,
        zoom,
        panX,
        panY,
        width,
        height
      );
      if (!started) {
        ctx.moveTo(screen.x, screen.y);
        started = true;
      } else {
        ctx.lineTo(screen.x, screen.y);
      }
    }

    if (started && samples.length > 1) {
      ctx.closePath();
    }
    ctx.stroke();
  }
}

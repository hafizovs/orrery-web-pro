import { ASTEROID_BELT } from '../../../domain/bodies/asteroid-belt.data';
import { mulberry32 } from './starfield.layer';
import type { RenderSnapshot } from '../canvas-renderer';
import { worldAuToScreen } from '../canvas-camera';

interface BeltPoint {
  rAu: number;
  angle0: number;
  size: number;
}

let cachedPoints: BeltPoint[] | null = null;
let cachedKey = '';

function ensureBeltPoints(): BeltPoint[] {
  const key = `${ASTEROID_BELT.seed}:${ASTEROID_BELT.count}:${ASTEROID_BELT.innerAu}:${ASTEROID_BELT.outerAu}`;
  if (cachedPoints && cachedKey === key) {
    return cachedPoints;
  }
  const rand = mulberry32(ASTEROID_BELT.seed);
  const points: BeltPoint[] = [];
  const span = ASTEROID_BELT.outerAu - ASTEROID_BELT.innerAu;
  for (let i = 0; i < ASTEROID_BELT.count; i++) {
    const u = rand();
    // Slight radial bias toward mid-belt + jitter
    const rAu =
      ASTEROID_BELT.innerAu + span * (0.15 + 0.7 * u + 0.15 * rand());
    const angle0 = rand() * Math.PI * 2;
    const size = 0.8 + rand() * 0.8;
    points.push({ rAu, angle0, size });
  }
  cachedPoints = points;
  cachedKey = key;
  return points;
}

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
    return `rgba(139, 144, 153, ${alpha})`;
  }
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Deterministic asteroid belt between Mars and Jupiter (static AU positions,
 * optional slow spin from simulationTimeDays).
 */
export function drawAsteroidBelt(
  ctx: CanvasRenderingContext2D,
  snapshot: RenderSnapshot
): void {
  const { width, height, mode, zoom, panX, panY, simulationTimeDays } = snapshot;
  if (width <= 0 || height <= 0) {
    return;
  }

  const points = ensureBeltPoints();
  const spin = 0.0001 * simulationTimeDays;
  const fill = hexToRgba(ASTEROID_BELT.color, ASTEROID_BELT.alpha);

  ctx.fillStyle = fill;
  for (const p of points) {
    const angle = p.angle0 + spin;
    const posAu = {
      x: Math.cos(angle) * p.rAu,
      y: Math.sin(angle) * p.rAu,
    };
    const screen = worldAuToScreen(posAu, mode, zoom, panX, panY, width, height);
    ctx.beginPath();
    ctx.arc(screen.x, screen.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

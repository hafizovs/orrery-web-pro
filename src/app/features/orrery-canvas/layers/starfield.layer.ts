import {
  STARFIELD_COUNT,
  STARFIELD_SEED,
} from '../../../core/constants/render.constants';
import type { RenderSnapshot } from '../canvas-renderer';

/** Deterministic mulberry32 PRNG (appendix B.12). */
export function mulberry32(seed: number): () => number {
  let s = seed | 0;
  return (): number => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Star {
  x: number;
  y: number;
  r: number;
  a: number;
}

let cachedStars: Star[] | null = null;
let cachedW = 0;
let cachedH = 0;

function ensureStars(width: number, height: number): Star[] {
  if (cachedStars && cachedW === width && cachedH === height) {
    return cachedStars;
  }
  const rand = mulberry32(STARFIELD_SEED);
  const stars: Star[] = [];
  for (let i = 0; i < STARFIELD_COUNT; i++) {
    stars.push({
      x: rand() * width,
      y: rand() * height,
      r: 0.4 + rand() * 1.4,
      a: 0.25 + rand() * 0.75,
    });
  }
  cachedStars = stars;
  cachedW = width;
  cachedH = height;
  return stars;
}

/**
 * Screen-space starfield with optional light parallax (0.02 * pan).
 */
export function drawStarfield(
  ctx: CanvasRenderingContext2D,
  snapshot: RenderSnapshot
): void {
  const { width, height, panX, panY } = snapshot;
  if (width <= 0 || height <= 0) {
    return;
  }
  const stars = ensureStars(width, height);
  const ox = panX * 0.02;
  const oy = panY * 0.02;

  for (const star of stars) {
    let x = star.x + ox;
    let y = star.y + oy;
    x = ((x % width) + width) % width;
    y = ((y % height) + height) % height;
    ctx.beginPath();
    ctx.fillStyle = `rgba(230, 236, 255, ${star.a})`;
    ctx.arc(x, y, star.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

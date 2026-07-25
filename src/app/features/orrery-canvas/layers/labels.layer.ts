import { LABEL_FONT } from '../../../core/constants/render.constants';
import type { RenderSnapshot } from '../canvas-renderer';
import { bodyRadiusPx, worldAuToScreen } from '../canvas-camera';

/**
 * Draws i18n body names near each visible body when showLabels is enabled.
 * Selected body is drawn last so its label stacks on top.
 */
export function drawLabels(
  ctx: CanvasRenderingContext2D,
  snapshot: RenderSnapshot,
  translate: (key: string) => string
): void {
  if (!snapshot.showLabels) {
    return;
  }

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

  const ordered = [...bodies].sort((a, b) => {
    if (a.id === selectedBodyId) {
      return 1;
    }
    if (b.id === selectedBodyId) {
      return -1;
    }
    return a.sortOrder - b.sortOrder;
  });

  ctx.font = LABEL_FONT;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#dce6f8';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
  ctx.shadowBlur = 3;

  for (const body of ordered) {
    if (body.kind === 'asteroid-belt-marker') {
      continue;
    }
    const state = states[body.id];
    const posAu = state?.positionAu ?? (body.id === 'sun' ? { x: 0, y: 0 } : null);
    if (!posAu) {
      continue;
    }
    const screen = worldAuToScreen(posAu, mode, zoom, panX, panY, width, height);
    const r = bodyRadiusPx(body.radiusKm, body.kind, mode, zoom);
    const label = translate(body.nameKey);
    ctx.fillText(label, screen.x + r + 6, screen.y - 4);
  }

  ctx.shadowBlur = 0;
}

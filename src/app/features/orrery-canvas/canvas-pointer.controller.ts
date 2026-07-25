import { BodyId } from '../../core/models/body-kind.model';
import { BodyRuntimeState } from '../../core/models/body-runtime-state.model';
import { CelestialBody } from '../../core/models/celestial-body.model';
import { PICK_RADIUS_PX } from '../../core/constants/render.constants';
import { ZOOM_WHEEL_SENSITIVITY } from '../../core/constants/scale.constants';
import { CameraStore } from '../../state/camera.store';
import { SimulationStore } from '../../state/simulation.store';
import { UiStore } from '../../state/ui.store';
import { bodyRadiusPx, worldAuToScreen } from './canvas-camera';

const CLICK_MOVE_THRESHOLD_PX = 4;

/**
 * Attaches pan / wheel-zoom / click-pick interactions to an HTMLCanvasElement.
 * Cursor: grab while idle over canvas, grabbing while panning.
 */
export class CanvasPointerController {
  private readonly canvas: HTMLCanvasElement;
  private readonly camera: CameraStore;
  private readonly simulation: SimulationStore;
  private readonly ui: UiStore;
  private readonly getBodies: () => readonly CelestialBody[];
  private readonly getStates: () => Record<BodyId, BodyRuntimeState>;
  private readonly getSize: () => { width: number; height: number };

  private pointerId: number | null = null;
  private dragging = false;
  private moved = false;
  private lastX = 0;
  private lastY = 0;
  private downX = 0;
  private downY = 0;

  private readonly onWheel = (event: WheelEvent): void => {
    event.preventDefault();
    const { width, height } = this.getSize();
    if (width <= 0 || height <= 0) {
      return;
    }
    const rect = this.canvas.getBoundingClientRect();
    const localX = event.clientX - rect.left;
    const localY = event.clientY - rect.top;
    const factor = Math.exp(-event.deltaY * ZOOM_WHEEL_SENSITIVITY);
    this.camera.zoomAt(localX, localY, factor, width, height);
    if (this.camera.followEnabled()) {
      this.camera.disableFollow();
    }
  };

  private readonly onPointerDown = (event: PointerEvent): void => {
    if (event.button !== 0) {
      return;
    }
    this.pointerId = event.pointerId;
    this.dragging = true;
    this.moved = false;
    this.lastX = event.clientX;
    this.lastY = event.clientY;
    this.downX = event.clientX;
    this.downY = event.clientY;
    this.canvas.setPointerCapture(event.pointerId);
    this.canvas.style.cursor = 'grabbing';
  };

  private readonly onPointerMove = (event: PointerEvent): void => {
    if (!this.dragging || event.pointerId !== this.pointerId) {
      return;
    }
    const dx = event.clientX - this.lastX;
    const dy = event.clientY - this.lastY;
    this.lastX = event.clientX;
    this.lastY = event.clientY;
    if (
      Math.hypot(event.clientX - this.downX, event.clientY - this.downY) >=
      CLICK_MOVE_THRESHOLD_PX
    ) {
      this.moved = true;
    }
    if (dx !== 0 || dy !== 0) {
      this.camera.panBy(dx, dy);
      if (this.camera.followEnabled()) {
        this.camera.disableFollow();
      }
    }
  };

  private readonly onPointerUp = (event: PointerEvent): void => {
    if (event.pointerId !== this.pointerId) {
      return;
    }
    const wasClick = !this.moved;
    this.dragging = false;
    this.pointerId = null;
    this.canvas.style.cursor = 'grab';
    try {
      this.canvas.releasePointerCapture(event.pointerId);
    } catch {
      // already released
    }
    if (wasClick) {
      const rect = this.canvas.getBoundingClientRect();
      this.pickAt(event.clientX - rect.left, event.clientY - rect.top);
    }
  };

  private readonly onPointerCancel = (event: PointerEvent): void => {
    if (event.pointerId !== this.pointerId) {
      return;
    }
    this.dragging = false;
    this.pointerId = null;
    this.canvas.style.cursor = 'grab';
  };

  constructor(options: {
    canvas: HTMLCanvasElement;
    camera: CameraStore;
    simulation: SimulationStore;
    ui: UiStore;
    getBodies: () => readonly CelestialBody[];
    getStates: () => Record<BodyId, BodyRuntimeState>;
    getSize: () => { width: number; height: number };
  }) {
    this.canvas = options.canvas;
    this.camera = options.camera;
    this.simulation = options.simulation;
    this.ui = options.ui;
    this.getBodies = options.getBodies;
    this.getStates = options.getStates;
    this.getSize = options.getSize;

    this.canvas.style.cursor = 'grab';
    this.canvas.addEventListener('wheel', this.onWheel, { passive: false });
    this.canvas.addEventListener('pointerdown', this.onPointerDown);
    this.canvas.addEventListener('pointermove', this.onPointerMove);
    this.canvas.addEventListener('pointerup', this.onPointerUp);
    this.canvas.addEventListener('pointercancel', this.onPointerCancel);
  }

  detach(): void {
    this.canvas.removeEventListener('wheel', this.onWheel);
    this.canvas.removeEventListener('pointerdown', this.onPointerDown);
    this.canvas.removeEventListener('pointermove', this.onPointerMove);
    this.canvas.removeEventListener('pointerup', this.onPointerUp);
    this.canvas.removeEventListener('pointercancel', this.onPointerCancel);
    this.canvas.style.cursor = '';
  }

  private pickAt(screenX: number, screenY: number): void {
    const { width, height } = this.getSize();
    if (width <= 0 || height <= 0) {
      return;
    }
    const mode = this.ui.scaleMode();
    const zoom = this.camera.zoom();
    const panX = this.camera.panX();
    const panY = this.camera.panY();
    const states = this.getStates();
    const bodies = this.getBodies();

    let bestId: BodyId | null = null;
    let bestDist = Infinity;

    for (const body of bodies) {
      const state = states[body.id];
      if (!state) {
        continue;
      }
      const screen = worldAuToScreen(
        state.positionAu,
        mode,
        zoom,
        panX,
        panY,
        width,
        height
      );
      const r = bodyRadiusPx(body.radiusKm, body.kind, mode, zoom);
      const hitR = Math.max(r, PICK_RADIUS_PX);
      const dist = Math.hypot(screenX - screen.x, screenY - screen.y);
      if (dist <= hitR && dist < bestDist) {
        bestDist = dist;
        bestId = body.id;
      }
    }

    if (bestId !== null) {
      this.simulation.selectBody(bestId);
      this.camera.enableFollow(bestId);
    }
  }
}

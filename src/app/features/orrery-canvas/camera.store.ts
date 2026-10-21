import { Injectable, signal } from '@angular/core';
import { ZOOM_MAX, ZOOM_MIN } from '../../core/constants/scale.constants';
import { BodyId } from '../../core/models/body-kind.model';

/**
 * Camera pan is in screen/CSS pixels relative to the canvas center.
 * `centerOnScene` sets pan to `-scene` so the given scene point lands at the viewport center
 * (after the renderer's scene→screen transform at the current zoom).
 */
@Injectable({ providedIn: 'root' })
export class CameraStore {
  readonly panX = signal(0);
  readonly panY = signal(0);
  readonly zoom = signal(1);
  readonly followEnabled = signal(false);
  readonly focusBodyId = signal<BodyId | null>(null);

  /** Alias used by render-loop / canvas-camera docs that mention offsetX/offsetY. */
  readonly offsetX = this.panX;
  readonly offsetY = this.panY;

  panBy(dx: number, dy: number): void {
    if (!Number.isFinite(dx) || !Number.isFinite(dy)) {
      return;
    }
    this.panX.update((x) => x + dx);
    this.panY.update((y) => y + dy);
  }

  setPan(panX: number, panY: number): void {
    if (!Number.isFinite(panX) || !Number.isFinite(panY)) {
      return;
    }
    this.panX.set(panX);
    this.panY.set(panY);
  }

  /**
   * Zoom around a pointer position. Keeps the scene point under the cursor stable.
   * `mouseX` / `mouseY` are canvas-local coordinates; viewport size defaults to 0
   * (anchor relative to origin) when omitted.
   */
  zoomAt(
    mouseX: number,
    mouseY: number,
    factor: number,
    viewportWidth = 0,
    viewportHeight = 0,
  ): void {
    if (!Number.isFinite(factor) || factor <= 0) {
      return;
    }
    const previousZoom = this.zoom();
    const nextZoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, previousZoom * factor));
    if (nextZoom === previousZoom) {
      return;
    }
    const ratio = nextZoom / previousZoom;
    const anchorX = mouseX - viewportWidth / 2;
    const anchorY = mouseY - viewportHeight / 2;
    this.panX.set(anchorX - (anchorX - this.panX()) * ratio);
    this.panY.set(anchorY - (anchorY - this.panY()) * ratio);
    this.zoom.set(nextZoom);
  }

  setZoom(zoom: number): void {
    if (!Number.isFinite(zoom)) {
      return;
    }
    this.zoom.set(Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoom)));
  }

  /**
   * Center the camera on a scene-space point by setting pan = −scene.
   */
  centerOnScene(sceneX: number, sceneY: number): void {
    if (!Number.isFinite(sceneX) || !Number.isFinite(sceneY)) {
      return;
    }
    this.panX.set(-sceneX);
    this.panY.set(-sceneY);
  }

  enableFollow(id: BodyId): void {
    this.focusBodyId.set(id);
    this.followEnabled.set(true);
  }

  disableFollow(): void {
    this.followEnabled.set(false);
    this.focusBodyId.set(null);
  }

  resetView(): void {
    this.panX.set(0);
    this.panY.set(0);
    this.zoom.set(1);
    this.disableFollow();
  }
}

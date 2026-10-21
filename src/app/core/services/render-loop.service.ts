import { Injectable, inject } from '@angular/core';
import { mapWorldAuToScenePx } from '../../features/orrery-canvas/canvas-camera';
import {
  CanvasRenderer,
  RenderSnapshot,
} from '../../features/orrery-canvas/canvas-renderer';
import { CameraStore } from '../../features/orrery-canvas/camera.store';
import { CatalogStore } from '../../features/sidebar/catalog.store';
import { SimulationStore } from '../../features/orrery-canvas/simulation.store';
import { UiStore } from '../ui/ui.store';
import { I18nService } from './i18n.service';

const DT_CLAMP_SECONDS = 0.05;

/**
 * requestAnimationFrame loop: advance simulation, follow camera, draw snapshot.
 */
@Injectable({ providedIn: 'root' })
export class RenderLoopService {
  private readonly simulation = inject(SimulationStore);
  private readonly camera = inject(CameraStore);
  private readonly ui = inject(UiStore);
  private readonly catalog = inject(CatalogStore);
  private readonly i18n = inject(I18nService);
  private readonly renderer = new CanvasRenderer();

  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private cssWidth = 0;
  private cssHeight = 0;
  private rafId: number | null = null;
  private lastTs = 0;
  private running = false;

  /** Register the drawing surface and CSS pixel size (after DPR transform on ctx). */
  setCanvas(
    canvas: HTMLCanvasElement | null,
    ctx: CanvasRenderingContext2D | null,
    cssWidth: number,
    cssHeight: number
  ): void {
    this.canvas = canvas;
    this.ctx = ctx;
    this.cssWidth = cssWidth;
    this.cssHeight = cssHeight;
  }

  setSize(cssWidth: number, cssHeight: number): void {
    this.cssWidth = cssWidth;
    this.cssHeight = cssHeight;
  }

  start(): void {
    if (this.running) {
      return;
    }
    this.running = true;
    this.lastTs = 0;
    const tick = (ts: number): void => {
      if (!this.running) {
        return;
      }
      if (this.lastTs === 0) {
        this.lastTs = ts;
      }
      let dt = (ts - this.lastTs) / 1000;
      this.lastTs = ts;
      if (dt > DT_CLAMP_SECONDS) {
        dt = DT_CLAMP_SECONDS;
      }
      if (dt < 0) {
        dt = 0;
      }

      if (this.simulation.isPlaying()) {
        this.simulation.advance(dt);
      }

      this.applyFollow();
      this.paint();

      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  stop(): void {
    this.running = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.lastTs = 0;
  }

  private applyFollow(): void {
    if (!this.camera.followEnabled()) {
      return;
    }
    const id = this.camera.focusBodyId();
    if (!id) {
      return;
    }
    const state = this.simulation.bodyStates()[id];
    if (!state) {
      return;
    }
    const mode = this.ui.scaleMode();
    const zoom = this.camera.zoom();
    const scene = mapWorldAuToScenePx(state.positionAu, mode, zoom);
    this.camera.centerOnScene(scene.x, scene.y);
  }

  private buildSnapshot(): RenderSnapshot {
    return {
      width: this.cssWidth,
      height: this.cssHeight,
      mode: this.ui.scaleMode(),
      zoom: this.camera.zoom(),
      panX: this.camera.panX(),
      panY: this.camera.panY(),
      showLabels: this.ui.showLabels(),
      showDwarfs: this.ui.showDwarfs(),
      showComets: this.ui.showComets(),
      selectedBodyId: this.simulation.selectedBodyId(),
      bodies: [...this.catalog.visibleBodies()],
      states: this.simulation.bodyStates(),
      simulationTimeDays: this.simulation.simulationTimeDays(),
      locale: this.ui.locale(),
    };
  }

  private paint(): void {
    const ctx = this.ctx;
    if (!ctx || !this.canvas) {
      return;
    }
    const snapshot = this.buildSnapshot();
    this.renderer.draw(ctx, snapshot, (key) => this.i18n.t(key));
  }
}

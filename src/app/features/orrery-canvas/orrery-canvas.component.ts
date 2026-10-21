import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { MAX_DPR } from '../../core/constants/render.constants';
import { CameraStore } from './camera.store';
import { CatalogStore } from '../sidebar/catalog.store';
import { SimulationStore } from './simulation.store';
import { UiStore } from '../../core/ui/ui.store';
import { RenderLoopService } from '../../core/services/render-loop.service';
import { ScreenshotService } from '../../core/services/screenshot.service';
import { fitNeptuneZoom } from './canvas-camera';
import { CanvasPointerController } from './canvas-pointer.controller';

@Component({
  selector: 'owp-orrery-canvas',
  standalone: true,
  templateUrl: './orrery-canvas.component.html',
  styleUrl: './orrery-canvas.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrreryCanvasComponent {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);
  private readonly camera = inject(CameraStore);
  private readonly simulation = inject(SimulationStore);
  private readonly ui = inject(UiStore);
  private readonly catalog = inject(CatalogStore);
  private readonly renderLoop = inject(RenderLoopService);
  private readonly screenshots = inject(ScreenshotService);

  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  private ctx: CanvasRenderingContext2D | null = null;
  private cssWidth = 0;
  private cssHeight = 0;
  private resizeObserver: ResizeObserver | null = null;
  private pointer: CanvasPointerController | null = null;
  private fittedOnce = false;

  constructor() {
    afterNextRender(() => {
      const canvas = this.canvasRef().nativeElement;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) {
        return;
      }
      this.ctx = ctx;

      this.screenshots.setCanvas(canvas);
      this.applySize();
      this.fitDefaultView();

      this.pointer = new CanvasPointerController({
        canvas,
        camera: this.camera,
        simulation: this.simulation,
        ui: this.ui,
        getBodies: () => this.catalog.visibleBodies(),
        getStates: () => this.simulation.bodyStates(),
        getSize: () => ({ width: this.cssWidth, height: this.cssHeight }),
      });

      this.renderLoop.setCanvas(canvas, ctx, this.cssWidth, this.cssHeight);
      this.renderLoop.start();

      this.resizeObserver = new ResizeObserver(() => {
        this.applySize();
        this.renderLoop.setSize(this.cssWidth, this.cssHeight);
        if (!this.fittedOnce) {
          this.fitDefaultView();
        }
      });
      this.resizeObserver.observe(this.host.nativeElement);
    });

    this.destroyRef.onDestroy(() => {
      this.renderLoop.stop();
      this.pointer?.detach();
      this.pointer = null;
      this.resizeObserver?.disconnect();
      this.resizeObserver = null;
      this.screenshots.setCanvas(null);
      this.ctx = null;
    });
  }

  private applySize(): void {
    const canvas = this.canvasRef().nativeElement;
    const hostEl = this.host.nativeElement;
    const rect = hostEl.getBoundingClientRect();
    const cssWidth = Math.max(1, Math.floor(rect.width));
    const cssHeight = Math.max(1, Math.floor(rect.height));
    this.cssWidth = cssWidth;
    this.cssHeight = cssHeight;

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    canvas.width = Math.floor(cssWidth * dpr);
    canvas.height = Math.floor(cssHeight * dpr);
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;

    const ctx = this.ctx ?? canvas.getContext('2d', { alpha: false });
    if (!ctx) {
      return;
    }
    this.ctx = ctx;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.renderLoop.setCanvas(canvas, ctx, cssWidth, cssHeight);
  }

  private fitDefaultView(): void {
    if (this.cssWidth <= 0 || this.cssHeight <= 0) {
      return;
    }
    const minDim = Math.min(this.cssWidth, this.cssHeight);
    this.camera.setZoom(fitNeptuneZoom(minDim));
    this.camera.setPan(0, 0);
    this.camera.disableFollow();
    this.fittedOnce = true;
  }
}

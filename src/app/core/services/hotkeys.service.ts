import { inject, Injectable } from '@angular/core';
import { CameraStore } from '../../features/orrery-canvas/camera.store';
import { SimulationStore } from '../../features/orrery-canvas/simulation.store';
import { UiStore } from '../ui/ui.store';
import { ScreenshotService } from './screenshot.service';

@Injectable({ providedIn: 'root' })
export class HotkeysService {
  private readonly simulation = inject(SimulationStore);
  private readonly camera = inject(CameraStore);
  private readonly ui = inject(UiStore);
  private readonly screenshot = inject(ScreenshotService);

  private listening = false;
  private readonly onKeyDown = (event: KeyboardEvent): void => this.handleKeyDown(event);

  start(): void {
    if (this.listening || typeof window === 'undefined') {
      return;
    }
    window.addEventListener('keydown', this.onKeyDown);
    this.listening = true;
  }

  stop(): void {
    if (!this.listening || typeof window === 'undefined') {
      return;
    }
    window.removeEventListener('keydown', this.onKeyDown);
    this.listening = false;
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (this.isTypingTarget(event.target)) {
      return;
    }
    if (event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }

    const key = event.key;
    const lower = key.toLowerCase();
    let handled = true;

    switch (lower) {
      case ' ':
        this.simulation.togglePlay();
        break;
      case '+':
      case '=':
        this.simulation.stepSpeed(1);
        break;
      case '-':
        this.simulation.stepSpeed(-1);
        break;
      case 'f':
        this.camera.enableFollow(this.simulation.selectedBodyId() ?? 'earth');
        break;
      case 'escape':
        this.camera.disableFollow();
        break;
      case '1':
        this.ui.setScaleMode('real');
        break;
      case '2':
        this.ui.setScaleMode('visual');
        break;
      case 'l':
        this.ui.toggleLabels();
        break;
      case 'd':
        this.ui.toggleDwarfs();
        break;
      case 'c':
        this.ui.toggleComets();
        break;
      case 's':
        this.screenshot.capture();
        break;
      case 't':
        this.ui.toggleTheme();
        break;
      case 'g':
        this.ui.toggleLocale();
        break;
      default:
        handled = false;
        break;
    }

    if (handled) {
      event.preventDefault();
    }
  }

  private isTypingTarget(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) {
      return false;
    }
    const tag = target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
      return true;
    }
    if (target.isContentEditable) {
      return true;
    }
    return target.closest('[contenteditable="true"]') !== null;
  }
}

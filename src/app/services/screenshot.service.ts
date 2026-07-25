import { Injectable } from '@angular/core';

function pad2(value: number): string {
  return value.toString().padStart(2, '0');
}

/**
 * Local-time filename: `orrery-web-pro-YYYYMMDD-HHmmss.png`
 */
export function buildScreenshotFilename(now = new Date()): string {
  const yyyy = now.getFullYear();
  const mm = pad2(now.getMonth() + 1);
  const dd = pad2(now.getDate());
  const hh = pad2(now.getHours());
  const mi = pad2(now.getMinutes());
  const ss = pad2(now.getSeconds());
  return `orrery-web-pro-${yyyy}${mm}${dd}-${hh}${mi}${ss}.png`;
}

@Injectable({ providedIn: 'root' })
export class ScreenshotService {
  private canvas: HTMLCanvasElement | null = null;

  setCanvas(canvas: HTMLCanvasElement | null): void {
    this.canvas = canvas;
  }

  capture(): void {
    if (!this.canvas) {
      throw new Error('Screenshot canvas has not been registered.');
    }
    const url = this.canvas.toDataURL('image/png');
    const anchor = document.createElement('a');
    anchor.download = buildScreenshotFilename();
    anchor.href = url;
    anchor.hidden = true;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }
}

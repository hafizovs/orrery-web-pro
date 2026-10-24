import { Injectable, signal } from '@angular/core';
import { BodyId } from '../models/body-kind.model';
import { LocaleId } from '../models/locale.model';
import { ScaleMode } from '../models/scale-mode.model';
import { ThemeId } from '../models/theme.model';

@Injectable({ providedIn: 'root' })
export class UiStore {
  readonly theme = signal<ThemeId>('dark');
  readonly locale = signal<LocaleId>('en');
  readonly scaleMode = signal<ScaleMode>('visual');
  readonly showLabels = signal(true);
  readonly showDwarfs = signal(false);
  readonly showComets = signal(false);
  readonly compareOpen = signal(false);
  readonly compareBodyIds = signal<BodyId[]>([]);
  readonly sidebarOpen = signal(false);
  readonly realWarningDismissed = signal(false);

  setTheme(theme: ThemeId): void {
    this.theme.set(theme);
  }

  toggleTheme(): void {
    this.theme.update((theme) => (theme === 'dark' ? 'light' : 'dark'));
  }

  setLocale(locale: LocaleId): void {
    this.locale.set(locale);
  }

  toggleLocale(): void {
    this.locale.update((locale) => (locale === 'ru' ? 'en' : 'ru'));
  }

  setScaleMode(mode: ScaleMode): void {
    if (mode !== this.scaleMode()) {
      this.realWarningDismissed.set(false);
    }
    this.scaleMode.set(mode);
  }

  toggleLabels(): void {
    this.showLabels.update((value) => !value);
  }

  setShowLabels(value: boolean): void {
    this.showLabels.set(value);
  }

  toggleDwarfs(): void {
    this.showDwarfs.update((value) => !value);
  }

  setShowDwarfs(value: boolean): void {
    this.showDwarfs.set(value);
  }

  toggleComets(): void {
    this.showComets.update((value) => !value);
  }

  setShowComets(value: boolean): void {
    this.showComets.set(value);
  }

  toggleCompare(): void {
    this.compareOpen.update((open) => !open);
  }

  setCompareOpen(open: boolean): void {
    this.compareOpen.set(open);
  }

  /**
   * Toggle a body in the compare list. Max length is 3; if full and id is new, ignore.
   */
  toggleCompareBody(id: BodyId): void {
    const current = this.compareBodyIds();
    if (current.includes(id)) {
      this.compareBodyIds.set(current.filter((bodyId) => bodyId !== id));
      return;
    }
    if (current.length >= 3) {
      return;
    }
    this.compareBodyIds.set([...current, id]);
  }

  clearCompare(): void {
    this.compareBodyIds.set([]);
  }

  dismissRealWarning(): void {
    this.realWarningDismissed.set(true);
  }

  setSidebarOpen(open: boolean): void {
    this.sidebarOpen.set(open);
  }

  toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }
}

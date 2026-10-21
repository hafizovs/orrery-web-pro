import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
} from '@angular/core';
import { ComparePanelComponent } from './features/compare/compare-panel.component';
import { OrreryCanvasComponent } from './features/orrery-canvas/orrery-canvas.component';
import { RealScaleBannerComponent } from './features/scale-controls/real-scale-banner.component';
import { ScaleControlsComponent } from './features/scale-controls/scale-controls.component';
import { SidebarComponent } from './features/sidebar/sidebar.component';
import { TimePlayerComponent } from './features/time-player/time-player.component';
import { ToolbarComponent } from './core/layout/toolbar/toolbar.component';
import { HotkeysService } from './core/services/hotkeys.service';
import { I18nService } from './core/services/i18n.service';
import { UiStore } from './core/ui/ui.store';

@Component({
  selector: 'owp-root',
  standalone: true,
  imports: [
    ToolbarComponent,
    OrreryCanvasComponent,
    SidebarComponent,
    TimePlayerComponent,
    ScaleControlsComponent,
    RealScaleBannerComponent,
    ComparePanelComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly ui = inject(UiStore);
  readonly i18n = inject(I18nService);
  private readonly hotkeys = inject(HotkeysService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.hotkeys.start();
    this.destroyRef.onDestroy(() => this.hotkeys.stop());

    effect(() => {
      document.documentElement.dataset['theme'] = this.ui.theme();
    });
  }
}

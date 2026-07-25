import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from '../../services/i18n.service';
import { ScreenshotService } from '../../services/screenshot.service';
import { UiStore } from '../../state/ui.store';

@Component({
  selector: 'owp-toolbar',
  standalone: true,
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {
  readonly ui = inject(UiStore);
  readonly i18n = inject(I18nService);
  private readonly screenshot = inject(ScreenshotService);

  onToggleLabels(): void {
    this.ui.toggleLabels();
  }

  onToggleDwarfs(): void {
    this.ui.toggleDwarfs();
  }

  onToggleComets(): void {
    this.ui.toggleComets();
  }

  onToggleCompare(): void {
    this.ui.toggleCompare();
  }

  onScreenshot(): void {
    this.screenshot.capture();
  }

  onToggleTheme(): void {
    this.ui.toggleTheme();
  }

  onToggleLang(): void {
    this.ui.toggleLocale();
  }

  onToggleMenu(): void {
    this.ui.toggleSidebar();
  }
}

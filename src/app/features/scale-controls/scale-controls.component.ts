import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ScaleMode } from '../../core/models/scale-mode.model';
import { I18nService } from '../../core/services/i18n.service';
import { UiStore } from '../../core/ui/ui.store';

@Component({
  selector: 'owp-scale-controls',
  standalone: true,
  templateUrl: './scale-controls.component.html',
  styleUrl: './scale-controls.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScaleControlsComponent {
  readonly ui = inject(UiStore);
  readonly i18n = inject(I18nService);

  setMode(mode: ScaleMode): void {
    this.ui.setScaleMode(mode);
  }

  isActive(mode: ScaleMode): boolean {
    return this.ui.scaleMode() === mode;
  }
}

import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { I18nService } from '../../services/i18n.service';
import { UiStore } from '../../state/ui.store';

@Component({
  selector: 'owp-real-scale-banner',
  standalone: true,
  templateUrl: './real-scale-banner.component.html',
  styleUrl: './real-scale-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RealScaleBannerComponent {
  readonly ui = inject(UiStore);
  readonly i18n = inject(I18nService);

  readonly visible = computed(
    () => this.ui.scaleMode() === 'real' && !this.ui.realWarningDismissed(),
  );

  goVisual(): void {
    this.ui.setScaleMode('visual');
  }

  dismiss(): void {
    this.ui.dismissRealWarning();
  }
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from '../../core/services/i18n.service';
import { UiStore } from '../../core/ui/ui.store';
import { BodyCardComponent } from './body-card.component';
import { BodyListComponent } from './body-list.component';

@Component({
  selector: 'owp-sidebar',
  standalone: true,
  imports: [BodyListComponent, BodyCardComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  readonly ui = inject(UiStore);
  readonly i18n = inject(I18nService);

  close(): void {
    this.ui.setSidebarOpen(false);
  }
}

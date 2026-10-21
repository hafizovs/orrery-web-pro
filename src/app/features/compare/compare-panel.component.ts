import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { BodyId } from '../../core/models/body-kind.model';
import { CelestialBody } from '../../core/models/celestial-body.model';
import {
  formatAu,
  formatKm,
  formatMassKg,
  formatPeriodDays,
  formatSpeedKmPerS,
} from '../../domain/astronomy/format.util';
import { I18nService } from '../../core/services/i18n.service';
import { CatalogStore } from '../sidebar/catalog.store';
import { SimulationStore } from '../orrery-canvas/simulation.store';
import { UiStore } from '../../core/ui/ui.store';

interface CompareMetricRow {
  key: string;
  labelKey: string;
  values: string[];
}

@Component({
  selector: 'owp-compare-panel',
  standalone: true,
  templateUrl: './compare-panel.component.html',
  styleUrl: './compare-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComparePanelComponent {
  readonly i18n = inject(I18nService);
  readonly ui = inject(UiStore);
  private readonly catalog = inject(CatalogStore);
  private readonly simulation = inject(SimulationStore);

  readonly visibleBodies = this.catalog.visibleBodies;

  readonly selectedBodies = computed<CelestialBody[]>(() => {
    const ids = this.ui.compareBodyIds();
    return ids
      .map((id) => this.catalog.getById(id))
      .filter((body): body is CelestialBody => body != null);
  });

  readonly limitReached = computed(() => this.ui.compareBodyIds().length >= 3);

  readonly metricRows = computed<CompareMetricRow[]>(() => {
    const bodies = this.selectedBodies();
    if (bodies.length === 0) {
      return [];
    }
    const states = this.simulation.bodyStates();
    const t = (key: string) => this.i18n.t(key);

    const cell = (fn: (body: CelestialBody) => string): string[] =>
      bodies.map(fn);

    return [
      {
        key: 'kind',
        labelKey: 'card.kind',
        values: cell((b) => t(`kind.${b.kind}`)),
      },
      {
        key: 'massKg',
        labelKey: 'card.mass',
        values: cell((b) => formatMassKg(b.massKg)),
      },
      {
        key: 'radiusKm',
        labelKey: 'card.radius',
        values: cell((b) => `${formatKm(b.radiusKm)} ${t('unit.km')}`),
      },
      {
        key: 'a',
        labelKey: 'card.semiMajorAxis',
        values: cell((b) => {
          if (!b.elements) {
            return '—';
          }
          if (b.kind === 'moon') {
            return `${formatKm(b.elements.semiMajorAxis)} ${t('unit.km')}`;
          }
          return `${formatAu(b.elements.semiMajorAxis)} ${t('unit.au')}`;
        }),
      },
      {
        key: 'e',
        labelKey: 'card.eccentricity',
        values: cell((b) =>
          b.elements ? b.elements.eccentricity.toFixed(4) : '—',
        ),
      },
      {
        key: 'periodDays',
        labelKey: 'card.period',
        values: cell((b) =>
          b.elements ? formatPeriodDays(b.elements.periodDays, t) : '—',
        ),
      },
      {
        key: 'distanceFromSunAu',
        labelKey: 'card.distanceSun',
        values: cell((b) => {
          const state = states[b.id];
          if (!state) {
            return '—';
          }
          return `${formatAu(state.distanceFromSunAu)} ${t('unit.au')}`;
        }),
      },
      {
        key: 'speedKmPerS',
        labelKey: 'card.speed',
        values: cell((b) => {
          const state = states[b.id];
          if (!state) {
            return '—';
          }
          return `${formatSpeedKmPerS(state.speedKmPerS)} ${t('unit.kmPerS')}`;
        }),
      },
    ];
  });

  isChecked(id: BodyId): boolean {
    return this.ui.compareBodyIds().includes(id);
  }

  isDisabled(id: BodyId): boolean {
    return this.limitReached() && !this.isChecked(id);
  }

  toggleBody(id: BodyId): void {
    this.ui.toggleCompareBody(id);
  }

  clear(): void {
    this.ui.clearCompare();
  }

  close(): void {
    this.ui.setCompareOpen(false);
  }
}

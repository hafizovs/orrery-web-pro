import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { BodyRuntimeState } from '../../core/models/body-runtime-state.model';
import { CelestialBody } from '../../core/models/celestial-body.model';
import {
  formatAu,
  formatDegrees,
  formatKm,
  formatMassKg,
  formatPeriodDays,
  formatSpeedKmPerS,
} from '../../domain/astronomy/format.util';
import { I18nService } from '../../services/i18n.service';
import { CameraStore } from '../../state/camera.store';
import { CatalogStore } from '../../state/catalog.store';
import { SimulationStore } from '../../state/simulation.store';
import { UiStore } from '../../state/ui.store';

@Component({
  selector: 'owp-body-card',
  standalone: true,
  templateUrl: './body-card.component.html',
  styleUrl: './body-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyCardComponent {
  readonly i18n = inject(I18nService);
  private readonly simulation = inject(SimulationStore);
  private readonly catalog = inject(CatalogStore);
  private readonly camera = inject(CameraStore);
  private readonly ui = inject(UiStore);

  readonly selectedBodyId = this.simulation.selectedBodyId;

  readonly body = computed<CelestialBody | null>(() => {
    const id = this.selectedBodyId();
    if (id == null) {
      return null;
    }
    return this.catalog.getById(id) ?? null;
  });

  readonly state = computed<BodyRuntimeState | null>(() => {
    const id = this.selectedBodyId();
    if (id == null) {
      return null;
    }
    return this.simulation.bodyStates()[id] ?? null;
  });

  readonly kindLabel = computed(() => {
    const body = this.body();
    return body ? this.i18n.t(`kind.${body.kind}`) : '—';
  });

  readonly massLabel = computed(() => {
    const body = this.body();
    return body ? formatMassKg(body.massKg) : '—';
  });

  readonly radiusLabel = computed(() => {
    const body = this.body();
    return body ? `${formatKm(body.radiusKm)} ${this.i18n.t('unit.km')}` : '—';
  });

  readonly semiMajorLabel = computed(() => {
    const body = this.body();
    if (!body?.elements) {
      return '—';
    }
    if (body.kind === 'moon') {
      return `${formatKm(body.elements.semiMajorAxis)} ${this.i18n.t('unit.km')}`;
    }
    return `${formatAu(body.elements.semiMajorAxis)} ${this.i18n.t('unit.au')}`;
  });

  readonly eccentricityLabel = computed(() => {
    const body = this.body();
    if (!body?.elements) {
      return '—';
    }
    return body.elements.eccentricity.toFixed(4);
  });

  readonly periodLabel = computed(() => {
    const body = this.body();
    if (!body?.elements) {
      return '—';
    }
    return formatPeriodDays(body.elements.periodDays, (key) => this.i18n.t(key));
  });

  readonly distanceSunLabel = computed(() => {
    const state = this.state();
    if (!state) {
      return '—';
    }
    return `${formatAu(state.distanceFromSunAu)} ${this.i18n.t('unit.au')}`;
  });

  readonly distanceParentLabel = computed(() => {
    const body = this.body();
    const state = this.state();
    if (!body || body.kind !== 'moon' || !state) {
      return '—';
    }
    if (state.distanceToParentUnit === 'km') {
      return `${formatKm(state.distanceToParent)} ${this.i18n.t('unit.km')}`;
    }
    return `${formatAu(state.distanceToParent)} ${this.i18n.t('unit.au')}`;
  });

  readonly speedLabel = computed(() => {
    const state = this.state();
    if (!state) {
      return '—';
    }
    return `${formatSpeedKmPerS(state.speedKmPerS)} ${this.i18n.t('unit.kmPerS')}`;
  });

  readonly trueAnomalyLabel = computed(() => {
    const state = this.state();
    if (!state) {
      return '—';
    }
    return `${formatDegrees(state.trueAnomaly)}°`;
  });

  disableFollow(): void {
    this.camera.disableFollow();
  }

  addToCompare(): void {
    const id = this.selectedBodyId();
    if (id == null) {
      return;
    }
    if (!this.ui.compareOpen()) {
      this.ui.setCompareOpen(true);
    }
    this.ui.toggleCompareBody(id);
  }
}

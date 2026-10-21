import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { CelestialBody } from '../../core/models/celestial-body.model';
import { I18nService } from '../../core/services/i18n.service';
import { CameraStore } from '../orrery-canvas/camera.store';
import { CatalogStore } from './catalog.store';
import { SimulationStore } from '../orrery-canvas/simulation.store';

interface BodyListSection {
  id: string;
  labelKey: string;
  bodies: CelestialBody[];
}

@Component({
  selector: 'owp-body-list',
  standalone: true,
  templateUrl: './body-list.component.html',
  styleUrl: './body-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyListComponent {
  readonly i18n = inject(I18nService);
  private readonly catalog = inject(CatalogStore);
  private readonly simulation = inject(SimulationStore);
  private readonly camera = inject(CameraStore);

  readonly selectedBodyId = this.simulation.selectedBodyId;

  readonly sections = computed<BodyListSection[]>(() => {
    const bodies = this.catalog.visibleBodies();
    const groups: BodyListSection[] = [
      {
        id: 'star',
        labelKey: 'section.star',
        bodies: bodies.filter((b) => b.kind === 'star'),
      },
      {
        id: 'planets',
        labelKey: 'section.planets',
        bodies: bodies.filter((b) => b.kind === 'planet'),
      },
      {
        id: 'moon',
        labelKey: 'section.moon',
        bodies: bodies.filter((b) => b.kind === 'moon'),
      },
      {
        id: 'dwarfs',
        labelKey: 'section.dwarfs',
        bodies: bodies.filter((b) => b.kind === 'dwarf-planet'),
      },
      {
        id: 'comets',
        labelKey: 'section.comets',
        bodies: bodies.filter((b) => b.kind === 'comet'),
      },
    ];
    return groups.filter((section) => section.bodies.length > 0);
  });

  selectAndFollow(body: CelestialBody): void {
    this.simulation.selectBody(body.id);
    this.camera.enableFollow(body.id);
  }
}

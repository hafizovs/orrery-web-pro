import { computed, inject, Injectable } from '@angular/core';
import { BodyId } from '../core/models/body-kind.model';
import { CelestialBody } from '../core/models/celestial-body.model';
import { BODY_BY_ID, CELESTIAL_BODIES } from '../domain/bodies/body-catalog';
import { UiStore } from './ui.store';

@Injectable({ providedIn: 'root' })
export class CatalogStore {
  private readonly ui = inject(UiStore);

  readonly allBodies = CELESTIAL_BODIES;

  getById(id: BodyId): CelestialBody | undefined {
    return BODY_BY_ID[id];
  }

  readonly planets = computed(() => this.allBodies.filter((body) => body.kind === 'planet'));

  readonly dwarfs = computed(() =>
    this.allBodies.filter((body) => body.kind === 'dwarf-planet'),
  );

  readonly comets = computed(() => this.allBodies.filter((body) => body.kind === 'comet'));

  readonly moon = computed(() => this.allBodies.find((body) => body.id === 'moon') ?? null);

  readonly sun = computed(() => this.allBodies.find((body) => body.id === 'sun') ?? null);

  readonly visibleBodies = computed(() => {
    const showDwarfs = this.ui.showDwarfs();
    const showComets = this.ui.showComets();
    return this.allBodies.filter((body) => {
      if (body.kind === 'dwarf-planet' && !showDwarfs) {
        return false;
      }
      if (body.kind === 'comet' && !showComets) {
        return false;
      }
      return true;
    });
  });
}

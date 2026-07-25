import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { EPOCH_J2000_JD } from '../../core/constants/astronomy.constants';
import {
  scaleToSlider,
  sliderToScale,
  TIME_SCALE_PRESETS,
  TimeScalePresetId,
} from '../../core/constants/time.constants';
import { I18nService } from '../../services/i18n.service';
import { SimulationStore } from '../../state/simulation.store';

const PRESET_IDS: TimeScalePresetId[] = ['hour', 'day', 'month', 'year'];

@Component({
  selector: 'owp-time-player',
  standalone: true,
  templateUrl: './time-player.component.html',
  styleUrl: './time-player.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimePlayerComponent {
  readonly i18n = inject(I18nService);
  readonly simulation = inject(SimulationStore);

  readonly presets = PRESET_IDS;

  readonly sliderValue = computed(() =>
    scaleToSlider(this.simulation.timeScaleDaysPerSecond()),
  );

  readonly speedLabel = computed(() => {
    const scale = this.simulation.timeScaleDaysPerSecond();
    return this.i18n.t('time.speed', {
      value: scale.toFixed(2),
      unit: this.i18n.t('time.unit.dayPerSec'),
    });
  });

  readonly simTimeLabel = computed(() => {
    const days = this.simulation.simulationTimeDays();
    const jd = EPOCH_J2000_JD + days;
    return `t + ${days.toFixed(2)} ${this.i18n.t('unit.days')} · JD ${jd.toFixed(2)}`;
  });

  readonly playLabel = computed(() =>
    this.simulation.isPlaying()
      ? this.i18n.t('time.pause')
      : this.i18n.t('time.play'),
  );

  presetLabel(id: TimeScalePresetId): string {
    return this.i18n.t(`time.preset.${id}`);
  }

  isPresetActive(id: TimeScalePresetId): boolean {
    return this.simulation.activePreset() === id;
  }

  togglePlay(): void {
    this.simulation.togglePlay();
  }

  setPreset(id: TimeScalePresetId): void {
    this.simulation.setSpeedPreset(id);
  }

  onSliderInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const t01 = Number(input.value);
    if (!Number.isFinite(t01)) {
      return;
    }
    this.simulation.setTimeScaleDaysPerSecond(sliderToScale(t01));
  }
}

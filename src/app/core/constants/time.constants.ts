export const TIME_SCALE_PRESETS = {
  hour: 1 / 24, // 1 час симуляции за 1 реальную секунду
  day: 1, // 1 сутки / сек
  month: 30, // 30 суток / сек
  year: 365.25, // 1 год / сек
} as const;

export type TimeScalePresetId = keyof typeof TIME_SCALE_PRESETS;

/** Допустимый диапазон слайдера скорости (дней симуляции за реальную секунду) */
export const TIME_SCALE_MIN = 1 / 24;
export const TIME_SCALE_MAX = 365.25 * 10; // до 10 лет/сек

/**
 * Логарифмическое отображение слайдера [0, 1] → timeScale (дней/сек).
 */
export function sliderToScale(t01: number): number {
  const t = Math.min(1, Math.max(0, t01));
  return TIME_SCALE_MIN * (TIME_SCALE_MAX / TIME_SCALE_MIN) ** t;
}

/**
 * Обратное отображение timeScale → позиция слайдера [0, 1].
 */
export function scaleToSlider(scale: number): number {
  const s = Math.min(TIME_SCALE_MAX, Math.max(TIME_SCALE_MIN, scale));
  return Math.log(s / TIME_SCALE_MIN) / Math.log(TIME_SCALE_MAX / TIME_SCALE_MIN);
}

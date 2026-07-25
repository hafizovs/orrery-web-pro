# 03 — Data Model & Units

Все интерфейсы ниже реализуй **буквально** в указанных файлах. Числовые каталоги тел — в [appendix-a-orbital-elements.md](appendix-a-orbital-elements.md); скопируй значения в `*.data.ts` без округления сильнее, чем в таблице.

---

## 3.1 Единицы и константы

Файл: `src/app/core/constants/astronomy.constants.ts`

```ts
/** 1 астрономическая единица в километрах */
export const AU_KM = 149_597_870.7;

/** Гравитационная постоянная, м^3 kg^-1 s^-2 (для справки; в симуляции предпочтительнее mu) */
export const G = 6.67430e-11;

/** Стандартный гравитационный параметр Солнца, km^3/s^2 */
export const SUN_MU_KM3_S2 = 1.32712440018e11;

/** Масса Солнца, kg */
export const SUN_MASS_KG = 1.98847e30;

/** Радиус Солнца, km */
export const SUN_RADIUS_KM = 695_700;

/** Секунд в средних солнечных сутках */
export const SECONDS_PER_DAY = 86_400;

/** Юлианская дата эпохи элементов J2000.0 */
export const EPOCH_J2000_JD = 2451545.0;

/** Средний месяц для time preset = 30 симуляционных суток */
export const DAYS_PER_MONTH_PRESET = 30;

/** Год для time preset = 365.25 симуляционных суток */
export const DAYS_PER_YEAR_PRESET = 365.25;
```

Файл: `src/app/core/constants/time.constants.ts`

```ts
export const TIME_SCALE_PRESETS = {
  hour: 1 / 24,          // 1 час симуляции за 1 реальную секунду
  day: 1,                // 1 сутки / сек
  month: 30,             // 30 суток / сек
  year: 365.25,          // 1 год / сек
} as const;

export type TimeScalePresetId = keyof typeof TIME_SCALE_PRESETS;

/** Допустимый диапазон слайдера скорости (дней симуляции за реальную секунду) */
export const TIME_SCALE_MIN = 1 / 24;
export const TIME_SCALE_MAX = 365.25 * 10; // до 10 лет/сек
```

Файл: `src/app/core/constants/scale.constants.ts` — см. точные числа в [05-canvas-renderer.md](05-canvas-renderer.md); здесь только реэкспорт/дублирование констант масштаба, чтобы Physics не зависел от render.

Файл: `src/app/core/constants/render.constants.ts` — DPR max, star count, belt count и т.д. (см. 05).

---

## 3.2 Типы идентификаторов и видов

`src/app/core/models/body-kind.model.ts`:

```ts
export type BodyKind =
  | 'star'
  | 'planet'
  | 'moon'
  | 'dwarf-planet'
  | 'comet'
  | 'asteroid-belt-marker'; // не используется для физики отдельных астероидов

export type BodyId =
  | 'sun'
  | 'mercury'
  | 'venus'
  | 'earth'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune'
  | 'moon'
  | 'ceres'
  | 'pluto'
  | 'eris'
  | 'halley'
  | 'encke';
```

`src/app/core/models/scale-mode.model.ts`:

```ts
export type ScaleMode = 'real' | 'visual';
```

`src/app/core/models/theme.model.ts`:

```ts
export type ThemeId = 'dark' | 'light';
```

`src/app/core/models/locale.model.ts`:

```ts
export type LocaleId = 'ru' | 'en';
```

---

## 3.3 Орбитальные элементы

`src/app/core/models/orbital-elements.model.ts`:

```ts
/**
 * Кеплеровы элементы относительно эклиптики (для планет/карликов/комет — heliocentric;
 * для Луны — geocentric относительно Земли).
 * Углы — в радианах в рантайм-модели после загрузки из data-файлов,
 * либо храни data в градусах и конвертируй один раз в body-catalog.
 *
 * В data-файлах храни УГЛЫ В ГРАДУСАХ (как в appendix A),
 * в рантайме CelestialBody.elements — уже в РАДИАНАХ.
 */
export interface OrbitalElements {
  /** Большая полуось a: для heliocentric — в AU; для Луны — в km */
  semiMajorAxis: number;
  /** Эксцентриситет e (0..1 для эллипса; кометы могут быть близки к 1) */
  eccentricity: number;
  /** Наклонение i, радианы */
  inclination: number;
  /** Долгота восходящего узла Ω, радианы */
  longitudeAscendingNode: number;
  /** Аргумент перицентра ω, радианы */
  argumentPeriapsis: number;
  /** Средняя аномалия на эпоху M0, радианы */
  meanAnomalyAtEpoch: number;
  /** Орбитальный период: для планет — в земных сутках; можно также вычислять из a */
  periodDays: number;
  /** Эпоха элементов, Julian Date */
  epochJd: number;
}
```

---

## 3.4 Определение небесного тела (статический каталог)

`src/app/core/models/celestial-body.model.ts`:

```ts
import { BodyId, BodyKind } from './body-kind.model';
import { OrbitalElements } from './orbital-elements.model';

export interface CelestialBody {
  id: BodyId;
  kind: BodyKind;
  /** Ключи i18n: name.ru / name.en резолвятся через I18nService; храни nameKey */
  nameKey: string;
  /** Родитель для относительных орбит: sun для планет; earth для moon; null для sun */
  parentId: BodyId | null;
  /** Радиус тела, km */
  radiusKm: number;
  /** Масса, kg */
  massKg: number;
  /** Цвет визуализации #RRGGBB */
  color: string;
  /** Вторичный цвет для градиента (тёмная сторона) */
  colorDark: string;
  /** Есть ли кольца (Saturn = true) */
  hasRings: boolean;
  /** Орбитальные элементы; у Солнца = null */
  elements: OrbitalElements | null;
  /** Порядок сортировки в sidebar */
  sortOrder: number;
}
```

---

## 3.5 Runtime-состояние тела

`src/app/core/models/body-runtime-state.model.ts`:

```ts
import { BodyId } from './body-kind.model';

export interface Vec2 {
  x: number;
  y: number;
}

/**
 * Позиции в heliocentric ecliptic plane projection (x,y), единицы:
 * - для всех тел, включая Луну после сложения с Earth: AU
 * (Луна: earthPosAU + moonOffsetKm/AU_KM)
 */
export interface BodyRuntimeState {
  id: BodyId;
  /** Позиция в AU, heliocentric */
  positionAu: Vec2;
  /** Истинная аномалия ν, радианы */
  trueAnomaly: number;
  /** Эксцентрическая аномалия E, радианы */
  eccentricAnomaly: number;
  /** Средняя аномалия M, радианы */
  meanAnomaly: number;
  /** Расстояние от Солнца (для Луны — heliocentric distance), AU */
  distanceFromSunAu: number;
  /** Орбитальная скорость, km/s (vis-viva относительно своего primary) */
  speedKmPerS: number;
  /** Расстояние до родителя: для планет = distanceFromSunAu; для Луны — km до Земли */
  distanceToParent: number;
  /** Единица distanceToParent: 'au' | 'km' */
  distanceToParentUnit: 'au' | 'km';
}
```

---

## 3.6 Состояния симуляции / камеры / compare

`simulation-state.model.ts`:

```ts
import { BodyId } from './body-kind.model';
import { BodyRuntimeState } from './body-runtime-state.model';
import { TimeScalePresetId } from '../constants/time.constants';

export interface SimulationState {
  isPlaying: boolean;
  timeScaleDaysPerSecond: number;
  activePreset: TimeScalePresetId | 'custom';
  simulationTimeDays: number;
  bodyStates: Record<BodyId, BodyRuntimeState>;
  selectedBodyId: BodyId | null;
}
```

`camera-state.model.ts`:

```ts
import { BodyId } from './body-kind.model';

export interface CameraState {
  /** Сдвиг камеры в screen pixels */
  panX: number;
  panY: number;
  /** Множитель зума; 1 = default fit Neptune */
  zoom: number;
  followEnabled: boolean;
  focusBodyId: BodyId | null;
}
```

`compare-state.model.ts`:

```ts
import { BodyId } from './body-kind.model';

export interface CompareState {
  open: boolean;
  bodyIds: BodyId[]; // 0..3
}
```

---

## 3.7 Каталог тел

`src/app/domain/bodies/body-catalog.ts` обязан:

1. Импортировать массивы/объекты из `sun.data.ts`, `planets.data.ts`, `moon.data.ts`, `dwarfs.data.ts`, `comets.data.ts`.
2. Конвертировать градусы → радианы при сборке `CelestialBody[]`.
3. Экспортировать:
   - `export const CELESTIAL_BODIES: readonly CelestialBody[]`
   - `export const BODY_BY_ID: Readonly<Record<BodyId, CelestialBody>>`
   - helper `getBody(id: BodyId): CelestialBody`
4. Солнце: `elements: null`, `parentId: null`, `kind: 'star'`.
5. Планеты: `parentId: 'sun'`, `kind: 'planet'`.
6. Луна: `parentId: 'earth'`, `kind: 'moon'`, `semiMajorAxis` в **km**.
7. Карлики: `kind: 'dwarf-planet'`, `parentId: 'sun'`.
8. Кометы: `kind: 'comet'`, `parentId: 'sun'`.

`asteroid-belt.data.ts`: не отдельные CelestialBody в физике, а параметры пояса:

```ts
export interface AsteroidBeltConfig {
  innerAu: number;      // 2.1
  outerAu: number;      // 3.3
  count: number;        // 600
  seed: number;         // 42 — детерминированный RNG
  color: string;        // '#8b9099'
  alpha: number;        // 0.55
}
```

---

## 3.8 Обязательные поля «из ТЗ пользователя» — покрытие

Для каждой планеты в data **обязаны** быть доступны (через CelestialBody + runtime):

| Требование пользователя | Где хранится |
|-------------------------|--------------|
| Большая полуось | `elements.semiMajorAxis` |
| Эксцентриситет e | `elements.eccentricity` |
| Орбитальный период | `elements.periodDays` |
| Радиус | `radiusKm` |
| Масса | `massKg` |
| Текущий орбитальный угол (true anomaly) | `BodyRuntimeState.trueAnomaly` |
| Цвет | `color` / `colorDark` |

Дополнительно (обязательно для наклона орбит): `inclination`, `longitudeAscendingNode`, `argumentPeriapsis`, `meanAnomalyAtEpoch`, `epochJd`.

---

## 3.9 Форматирование для UI

В `body-card` / compare используй:

- масса: scientific notation, 3 значащие цифры, единица kg (например `5.97e24`)
- радиус: км с разделителями или `km` / `R⊕` опционально только для планет — **базово км**
- расстояние: AU с 6 знаками для планет; для Луны distanceToParent в км
- скорость: km/s с 3 знаками после запятой
- e: 6 знаков

Создай утилиту `src/app/domain/astronomy/format.util.ts` с функциями форматирования (полные реализации).

---

## 3.10 Критерий готовности документа 03

Все модели созданы, каталог заполнен числами из Appendix A, единицы согласованы (планеты AU, Луна km), runtime state содержит true anomaly и speed.

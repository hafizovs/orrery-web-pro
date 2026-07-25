# 05 — Canvas 2D Renderer

Реализуй полный пайплайн отрисовки. **Только Canvas 2D.** Коэффициенты масштаба в этом документе — закон; не подбирай «на глаз» без фиксации констант в `scale.constants.ts` / `render.constants.ts`.

---

## 5.1 Файлы

- `features/orrery-canvas/orrery-canvas.component.*` — `<canvas>`, ResizeObserver, pointer events
- `canvas-renderer.ts` — оркестратор слоёв
- `canvas-camera.ts` — world↔screen transforms
- `canvas-pointer.controller.ts` — wheel zoom, drag pan, click pick
- `layers/*.ts` — слои в порядке draw

---

## 5.2 Константы рендера

`src/app/core/constants/render.constants.ts`:

```ts
export const MAX_DPR = 2;
export const STARFIELD_COUNT = 400;
export const STARFIELD_SEED = 1337;
export const ORBIT_SAMPLES = 180;
export const ASTEROID_BELT_COUNT = 600;
export const LABEL_FONT = '12px "Segoe UI", system-ui, sans-serif';
export const PICK_RADIUS_PX = 14;
export const MIN_BODY_SCREEN_RADIUS_PX = 1.25;
export const MAX_BODY_SCREEN_RADIUS_PX = 48;
export const SUN_GLOW_MULTIPLIER = 3.2;
export const SATURN_RING_INNER_FACTOR = 1.5;  // × planet radius
export const SATURN_RING_OUTER_FACTOR = 2.3;
```

`src/app/core/constants/scale.constants.ts`:

```ts
/** Сколько CSS-пикселей соответствует 1 AU при zoom=1 в режиме REAL (линейно) */
export const REAL_PX_PER_AU = 80;

/**
 * REAL: радиус тела на экране = radiusKm * REAL_RADIUS_PX_PER_KM * zoom
 * При zoom=1 Земля (~6371 km) даст ~0.003 px → сработает MIN clamp → точка.
 * Это намеренно для демонстрации пустоты.
 */
export const REAL_RADIUS_PX_PER_KM = 5e-7;

/** VISUAL: позиция по логарифмическому сжатию орбит */
export const VISUAL_ORBIT_LOG_BASE = 10;
/** visualOrbitRadius(aAu) = VISUAL_ORBIT_K * log10(1 + aAu * VISUAL_ORBIT_LOG_SCALE) */
export const VISUAL_ORBIT_LOG_SCALE = 12;
export const VISUAL_ORBIT_K = 220;

/**
 * VISUAL размеры тел: screenR = VISUAL_RADIUS_BASE + VISUAL_RADIUS_K * log10(radiusKm)
 * Подобранно так, чтобы Меркурий..Нептун были различимы, Юпитер крупнее Земли.
 */
export const VISUAL_RADIUS_BASE = 2.5;
export const VISUAL_RADIUS_K = 3.8;

/** Солнце в visual mode — отдельно, чтобы не доминировало чрезмерно */
export const VISUAL_SUN_RADIUS_PX = 18;

/** Zoom limits */
export const ZOOM_MIN = 0.15;
export const ZOOM_MAX = 40;
export const ZOOM_WHEEL_SENSITIVITY = 0.0015;
```

### Функции масштаба (обязательны в `canvas-camera.ts` или `scale.transform.ts`)

```ts
export function orbitRadiusPx(aAu: number, mode: ScaleMode, zoom: number): number {
  if (mode === 'real') {
    return aAu * REAL_PX_PER_AU * zoom;
  }
  // Для visual орбитальная «характерная» полуось в px:
  return VISUAL_ORBIT_K * Math.log10(1 + aAu * VISUAL_ORBIT_LOG_SCALE) * zoom;
}

export function mapWorldAuToScenePx(
  posAu: Vec2,
  mode: ScaleMode,
  zoom: number
): Vec2 {
  if (mode === 'real') {
    return {
      x: posAu.x * REAL_PX_PER_AU * zoom,
      y: posAu.y * REAL_PX_PER_AU * zoom,
    };
  }
  // Visual: сохраняем направление, масштабируем длину радиус-вектора логарифмически
  const r = Math.hypot(posAu.x, posAu.y);
  if (r < 1e-12) return { x: 0, y: 0 };
  const targetR = VISUAL_ORBIT_K * Math.log10(1 + r * VISUAL_ORBIT_LOG_SCALE) * zoom;
  const s = targetR / r;
  return { x: posAu.x * s, y: posAu.y * s };
}

export function bodyRadiusPx(
  radiusKm: number,
  kind: BodyKind,
  mode: ScaleMode,
  zoom: number
): number {
  if (kind === 'star' && mode === 'visual') {
    return VISUAL_SUN_RADIUS_PX * Math.sqrt(zoom);
  }
  let r: number;
  if (mode === 'real') {
    r = radiusKm * REAL_RADIUS_PX_PER_KM * zoom;
  } else {
    r = VISUAL_RADIUS_BASE + VISUAL_RADIUS_K * Math.log10(Math.max(radiusKm, 1));
    r *= Math.sqrt(zoom);
  }
  return Math.min(MAX_BODY_SCREEN_RADIUS_PX, Math.max(MIN_BODY_SCREEN_RADIUS_PX, r));
}
```

Реализуй эти функции **полностью** в коде проекта.

---

## 5.3 Камера: screen transform

Центр canvas = origin world (0,0) + pan.

```ts
screenX = canvasWidth/2 + panX + sceneX
screenY = canvasHeight/2 + panY + sceneY
```

`zoomAt(mouseX, mouseY, factor)` — zoom относительно курсора (стандартный алгоритм: перед изменением zoom пересчитай pan так, чтобы world-точка под курсором сохранилась).

Default view on init:
1. `zoom` такой, чтобы орбита Нептуна (visual radius) занимала `min(width,height) * 0.42`.
2. `pan = {0,0}`.
3. Follow off.

Follow mode:
- каждый кадр после physics: `scene = mapWorldAuToScenePx(body.positionAu, ...)`
- `panX = -scene.x`, `panY = -scene.y` (тело в центре).

---

## 5.4 Resize & DPR

```ts
const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
canvas.width = Math.floor(cssWidth * dpr);
canvas.height = Math.floor(cssHeight * dpr);
ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
```

Рисуй в CSS-пикселях после setTransform. ResizeObserver на host.

---

## 5.5 Порядок слоёв (draw order)

1. Clear / space background gradient
2. `starfield.layer` (кэшируй offscreen или перерисовывай детерминированно от seed; не зависит от camera сильно — можно рисовать в screen space с лёгшим параллаксом `*0.02*pan` опционально)
3. `orbits.layer` — эллипсы/полилинии орбит видимых тел
4. `asteroid-belt.layer` — только если visual **или** real (в real почти сольётся — всё равно рисуй)
5. `rings.layer` — кольца Сатурна **под** диском Сатурна или сразу после bodies order: рисуй rings сразу перед Saturn body; проще: в bodies.layer для Saturn сначала rings, потом sphere
6. `bodies.layer` — Солнце и тела (Солнце первым или с glow)
7. `labels.layer` — если `showLabels`

---

## 5.6 Отрисовка тел (сферы с градиентом и тенью)

Для каждого тела в screen-координатах:

1. `radialGradient` от светлой точки (смещение `-0.35r, -0.35r`) цвета `color` к `colorDark`.
2. Для Солнца: дополнительный glow — большой градиент transparent с `SUN_GLOW_MULTIPLIER * r`, alpha low.
3. Тень: не имитируй от других планет; достаточно тёмной стороны градиента.
4. Обводка тонкая `rgba(255,255,255,0.15)` опционально для читаемости в visual.

Луна: всегда рисуй; размер в visual не меньше `MIN_BODY_SCREEN_RADIUS_PX`.

Selected body: дополнительное кольцо `accent` радиусом `r+3`.

---

## 5.7 Орбиты

Для каждого visible body с `elements`:

1. `sampleOrbitPoints` (см. 04) в AU относительно parent.
2. Если parent = Earth (Луна): каждый семпл `+= earth.positionAu`.
3. Каждый семпл → `mapWorldAuToScenePx` → screen.
4. `strokeStyle` = цвет тела с alpha 0.35; selected — alpha 0.8, lineWidth 1.5.
5. Не замыкай кривую артефактами — `beginPath`, lineTo по семплам, `closePath` если первый≈последний.

Наклон уже учтён в sampling через Ω,i,ω и `projectToScene`.

---

## 5.8 Кольца Сатурна

В `rings.layer.ts` или внутри bodies:

1. Возьми позицию Сатурна, наклони эллипс колец: используй inclination Сатурна для `ellipse` сжатия.
2. Inner/outer = `bodyRadiusPx * SATURN_RING_*_FACTOR` (экранные эллипсы вокруг планеты — схематично; это **не** физический AU-размер колец, а визуальный индикатор).
3. Заливка `rgba(210, 190, 150, 0.35)`, stroke alpha 0.5.
4. Рисуй **до** заливки сферы Сатурна, чтобы диск перекрывал внутреннюю часть.

---

## 5.9 Астероидный пояс

`asteroid-belt.data.ts` + layer:

1. Детерминированный PRNG от `seed` (mulberry32 или LCG — реализуй полностью).
2. Для i in 0..count-1: случайный r ∈ [innerAu, outerAu], случайный angle ∈ [0,2π), лёгкий jitter.
3. Позиции **статичны в world AU** (пояс не обязан крутиться; опционально медленное вращение `angle += 0.0001 * simulationTimeDays` — разрешено).
4. Рисуй точки radius 0.8..1.6 px, alpha из config.
5. В real mode точки будут редкими визуально — OK.

---

## 5.10 Labels

- Текст: `i18n.t(body.nameKey)` рядом с телом, offset `(r+6, -4)`.
- Не рисуй labels для астероидов пояса.
- Если два label перекрываются сильно — всё равно рисуй (упрощение допустимо); приоритет: selected сверху.
- Цвет: `#dce6f8`, shadow blur 3 для читаемости.

---

## 5.11 Pointer interaction

`canvas-pointer.controller.ts`:

1. **Wheel**: preventDefault, `zoomAt`.
2. **Pointer down + move**: pan (если не click без move).
3. **Click** (движение < 4px): pick body — nearest visible body within `PICK_RADIUS_PX` от screen position; учитывай screen radius тела (`max(bodyRadiusPx, PICK_RADIUS_PX)`).
4. Pick → `simulationStore.selectBody` + `cameraStore.enableFollow(id)`.
5. Cursor: grab/grabbing при pan; default иначе.

---

## 5.12 Snapshot для draw

Renderer получает immutable snapshot:

```ts
export interface RenderSnapshot {
  width: number;
  height: number;
  mode: ScaleMode;
  zoom: number;
  panX: number;
  panY: number;
  showLabels: boolean;
  showDwarfs: boolean;
  showComets: boolean;
  selectedBodyId: BodyId | null;
  bodies: CelestialBody[];
  states: Record<BodyId, BodyRuntimeState>;
  simulationTimeDays: number;
  locale: LocaleId; // для labels через i18n
}
```

---

## 5.13 Производительность

- Не создавай новые градиенты без нужды каждый раз — допустимо создавать per body per frame для простоты (при 15 телах OK).
- Не используй `shadowBlur` на всех телах (дорого) — только Солнце и selected.
- `ORBIT_SAMPLES = 180` достаточно.

---

## 5.14 Критерий готовности документа 05

DPR resize, real/visual transforms с константами выше, слои в порядке, Saturn rings, asteroid belt, labels, pan/zoom/pick/follow, glow spheres.

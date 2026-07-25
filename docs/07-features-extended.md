# 07 — Extended Features (пакет 1C)

Все фичи этого документа **обязательны**. Не помечай их optional в коде.

---

## 7.1 Карликовые планеты и кометы

### Данные
См. [appendix-a-orbital-elements.md](appendix-a-orbital-elements.md):
- Dwarfs: **Ceres**, **Pluto**, **Eris**
- Comets: **Halley**, **Encke**

### UI / State
- `ui.showDwarfs` default `false`
- `ui.showComets` default `false`
- `CatalogStore.visibleBodies` фильтрует по kind и флагам
- Sidebar секции появляются только при включённом слое
- Орбиты и тела рисуются только если слой включён
- Focus/compare/pick работают с ними так же, как с планетами

### Физика комет
- Высокий e → обязателен устойчивый Newton solver из документа 04 (multi-start).
- Периоды и a — из appendix A; не «упрощай» до круговых орбит.

### Визуал
- Кометы: чуть меньший radius visual; цвет хвоста **не обязателен**; допустима лёгкая черта-хвост длиной `8..16px` противоположно движению (опционально, если реализуешь — полностью, без TODO). Минимум: сфера + орбита.

---

## 7.2 Screenshot export

`services/screenshot.service.ts`:

```ts
@Injectable({ providedIn: 'root' })
export class ScreenshotService {
  private canvas: HTMLCanvasElement | null = null;

  setCanvas(canvas: HTMLCanvasElement | null): void { ... }

  capture(): void {
    // 1. assert canvas
    // 2. const url = canvas.toDataURL('image/png')
    // 3. создать <a download="orrery-web-pro-YYYYMMDD-HHmmss.png" href=url>
    // 4. click + remove
  }
}
```

Формат имени файла строго с timestamp локального времени, zero-pad.

Hotkey `S` → `capture()`.

---

## 7.3 Compare mode

Поведение:
1. `compareBodyIds: BodyId[]` max length **3**.
2. `toggleCompareBody(id)`: если id уже есть — удалить; иначе если length<3 — добавить; если length==3 — игнорировать или заменить последний (выбери **игнорировать** + toast/hint i18n `compare.limit`).
3. Таблица live metrics из `BodyRuntimeState` + static from catalog.
4. Кнопка Clear all.
5. Открытие панели не ставит паузу симуляции.

Реализуй computed в store или компоненте:

```ts
compareRows = computed(() => {
  // массив метрик { key, labelKey, values: (string|number)[] }
});
```

---

## 7.4 i18n (signal-словари)

### Файлы
- `i18n/locale.type.ts` — `LocaleId`
- `i18n/i18n.keys.ts` — union type всех ключей **или** const object `I18N_KEYS`
- `i18n/dictionaries/ru.ts` — `Record<string, string>` полный
- `i18n/dictionaries/en.ts` — полный зеркальный набор ключей
- `services/i18n.service.ts`

### I18nService

```ts
locale = signal<LocaleId>('ru'); // или читать из UiStore — единый источник: UiStore.locale
t(key: string, params?: Record<string, string | number>): string
setLocale(locale: LocaleId): void
toggleLocale(): void
```

Единый источник locale: **`UiStore.locale`**. I18nService читает его через inject.

### Правила
1. **Все** пользовательские строки UI — через `t()`. Запрещены захардкоженные `'Pause'` в шаблонах.
2. Имена тел: ключи `body.sun`, `body.mercury`, … `body.encke`.
3. Параметры: `t('time.speed', { value: '1.00', unit: t('time.unit.dayPerSec') })` с простой заменой `{value}` в строке.
4. ru.ts и en.ts должны содержать **одинаковый набор ключей**. Добавь unit-тест или runtime assert в dev на missing keys.

### Минимальный набор ключей (расширяй по мере UI, но эти обязаны быть)

```
app.title
app.subtitle
toolbar.labels
toolbar.dwarfs
toolbar.comets
toolbar.compare
toolbar.screenshot
toolbar.theme
toolbar.lang
toolbar.menu
time.play
time.pause
time.preset.hour
time.preset.day
time.preset.month
time.preset.year
time.speed
time.unit.dayPerSec
scale.real
scale.visual
scale.realWarning
scale.goVisual
scale.dismiss
sidebar.focusOff
sidebar.addCompare
card.mass
card.radius
card.semiMajorAxis
card.eccentricity
card.period
card.distanceSun
card.distanceParent
card.speed
card.trueAnomaly
card.kind
kind.star
kind.planet
kind.moon
kind.dwarf-planet
kind.comet
compare.title
compare.empty
compare.limit
compare.clear
section.star
section.planets
section.moon
section.dwarfs
section.comets
body.sun
body.mercury
body.venus
body.earth
body.mars
body.jupiter
body.saturn
body.uranus
body.neptune
body.moon
body.ceres
body.pluto
body.eris
body.halley
body.encke
unit.kg
unit.km
unit.au
unit.kmPerS
unit.days
```

Полные русские и английские значения пропиши в словарях (не оставляй key=value заглушки).

---

## 7.5 Hotkeys service

`services/hotkeys.service.ts`:
- `start()` добавляет `window` keydown listener
- `stop()` снимает
- Инициализация из AppComponent + DestroyRef
- Таблица клавиш — из [01-product-vision.md](01-product-vision.md) §1.5
- Игнор при typing в input/textarea/select/contenteditable

---

## 7.6 Theme

- `UiStore.theme` → `document.documentElement.dataset.theme = theme`
- effect в AppComponent или Theme initializer
- Default `dark`

---

## 7.7 Unit tests (обязательные)

### `newton-raphson.spec.ts`
1. e=0, M=1 → E≈1, residual < 1e-6
2. e=0.0167086 (Earth), M=π/2 → residual < 1e-6
3. e=0.9671429, M=0.5 → converges residual < 1e-4
4. M нормализуется / работает с M вне [0,2π)

### `kepler.spec.ts`
1. circular e=0: r === a
2. sampleOrbitPoints length === samples
3. Earth-like elements produce finite x,y
4. projectToScene changes y when z≠0

### `simulation.store.spec.ts`
1. pause stops advance effect on time (вызвать advance вручную при isPlaying false — время не менять; при true — менять)
2. setSpeedPreset('year') → timeScaleDaysPerSecond === 365.25
3. day preset: advance(1) → simulationTimeDays += 1

Запусти тесты в README/итоге: `npm test`.

---

## 7.8 Labels, rings, belt — подтверждение

Уже специфицированы в 05; здесь требование: **включить в DoD** и не вырезать при нехватке времени контекста.

---

## 7.9 Критерий готовности документа 07

Dwarfs/comets layers, screenshot, compare, полный i18n RU/EN, hotkeys, theme, unit tests зелёные.

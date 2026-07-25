# 06 — UI Panels

Все панели — standalone components, Signals, control flow `@if`/`@for`. Строки UI — только через `I18nService.t(...)`. Стили — SCSS + CSS variables из [01-product-vision.md](01-product-vision.md).

---

## 6.1 Toolbar (`owp-toolbar`)

Элементы слева направо:

1. Brand: **Orrery Web Pro** (текст, не только логотип-заглушка).
2. Spacer.
3. Toggle **Labels** (`L`) — `ui.showLabels`.
4. Toggle **Dwarfs** (`D`) — `ui.showDwarfs`.
5. Toggle **Comets** (`C`) — `ui.showComets`.
6. Button **Compare** — `ui.compareOpen` toggle.
7. Button **Screenshot** (`S`) — `ScreenshotService.capture(canvasEl)`.
8. Button **Theme** (`T`) — dark/light.
9. Button **Lang** (`G`) — показывает текущий `RU`/`EN`, клик переключает.

Требования:
- `aria-label` на каждой кнопке.
- Активные toggles визуально pressed (`aria-pressed`).
- Высота toolbar 48px; sticky top.

i18n keys (минимум): `toolbar.labels`, `toolbar.dwarfs`, `toolbar.comets`, `toolbar.compare`, `toolbar.screenshot`, `toolbar.theme`, `toolbar.lang`.

---

## 6.2 Sidebar (`owp-sidebar`)

### Список тел (`owp-body-list`)
- Источник: `catalogStore.visibleBodies()` (зависит от dwarfs/comets flags) + всегда Sun, planets, Moon.
- Группировка заголовками: Star / Planets / Moon / Dwarf planets / Comets (заголовки секций скрывай, если секция пуста).
- `@for (body of section; track body.id)`.
- Клик: `selectBody` + `enableFollow`.
- Selected: accent border / background.
- Показывать маленький color swatch.

### Карточка (`owp-body-card`)
Показывать, если `selectedBodyId != null`. Поля:

| Поле UI | Источник |
|---------|----------|
| Название | `t(body.nameKey)` |
| Тип | `t('kind.' + body.kind)` |
| Масса | `massKg` formatted |
| Радиус | `radiusKm` |
| a | `elements.semiMajorAxis` (+ единица AU или km для Луны) |
| e | `elements.eccentricity` |
| Период | `elements.periodDays` (+ humanize) |
| Расстояние от Солнца (сейчас) | `state.distanceFromSunAu` AU |
| Расстояние до родителя | если moon — km |
| Скорость | `state.speedKmPerS` km/s |
| True anomaly | градусы, 2 знака |
| Цвет | swatch |

Кнопка «Снять фокус» → `camera.disableFollow()` (selection можно сохранить).

Кнопка «Добавить к сравнению» → `ui.toggleCompareBody(id)` (если compare не открыт — открыть).

---

## 6.3 Time Player (`owp-time-player`)

Элементы:
1. Play/Pause button (`aria-pressed`).
2. Пресеты: Hour / Day / Month / Year — сегментированные кнопки; активный preset подсвечен.
3. Range slider: `TIME_SCALE_MIN..TIME_SCALE_MAX` (логируемый slider **обязателен**: UI значение линейное 0..1 мапится в log-space на days/sec — реализуй `sliderToScale` / `scaleToSlider` полностью).
4. Числовая индикация текущей скорости: например `× 1.00 day/s` / локализовано.
5. Индикация симуляционного времени: `t + N days` или приближённая дата от J2000 (опционально показать `JD = EPOCH + days`).

Пресеты выставляют точные значения из `TIME_SCALE_PRESETS` и `activePreset`. Движение слайдера ставит `activePreset = 'custom'`.

---

## 6.4 Scale Controls (`owp-scale-controls`)

Radio/segmented:
- Real (`1`)
- Visual (`2`)

Подпись-пояснение одной строкой под контролом (короткая; полный текст — в banner).

### Real Scale Banner (`owp-real-scale-banner`)
- `@if (ui.scaleMode() === 'real')` показать.
- Текст из i18n `scale.realWarning` (полный текст из документа 01).
- Кнопка «Перейти к визуальному» → set visual.
- Кнопка закрытия скрывает только до следующего включения real **или** закрывает на сессию через `warningDismissed` signal в UiStore — реализуй `dismissRealWarning()`; при уходе с real и возврате снова показывать.

---

## 6.5 Compare Panel (`owp-compare-panel`)

- Overlay справа или bottom sheet на desktop — **drawer справа поверх sidebar**, ширина 420px.
- Заголовок + Close.
- Multi-select до 3 тел: checklist всех visible bodies.
- Таблица:

| Metric | Body A | Body B | Body C? |
|--------|--------|--------|---------|
| kind | | | |
| massKg | | | |
| radiusKm | | | |
| a | | | |
| e | | | |
| periodDays | | | |
| distanceFromSunAu (live) | | | |
| speedKmPerS (live) | | | |

- Live-метрики читать из `simulationStore.bodyStates()`.
- Пустые слоты не показывать колонки.
- Если 0 выбранных — placeholder `compare.empty`.

Детали логики — также в [07-features-extended.md](07-features-extended.md).

---

## 6.6 Layout SCSS shell

В `app.component.scss`:

- `.owp-shell` display grid: `1fr 320px` columns; rows `1fr`.
- Canvas host `min-width: 0; min-height: 0; height: 100%`.
- Footer flex row, gap, padding 8px 12px, border-top.
- Media `@media (max-width: 899px)`: sidebar position fixed, translateX, toggle button в toolbar «Menu».

Добавь в Toolbar кнопку Menu только на mobile (`ui.sidebarOpen`).

---

## 6.7 Связь с Canvas для Screenshot

`OrreryCanvasComponent` экспортирует метод или регистрирует `HTMLCanvasElement` в `ScreenshotService.setCanvas(el)` при init, `clear` при destroy.

Не используй `document.querySelector` в screenshot service как единственный путь — допустим fallback, но основной — явная регистрация.

---

## 6.8 Пустые/ошибочные состояния

- Если physics ещё не посчитала state для id — карточка показывает `—`.
- Не крашись при отсутствии elements у Sun (карточка Солнца: масса, радиус, цвет; орбитальные поля скрыть через `@if`).

---

## 6.9 Критерий готовности документа 06

Toolbar, sidebar list+card, time player с log-slider и пресетами, scale controls + banner, compare shell, mobile sidebar, screenshot registration.

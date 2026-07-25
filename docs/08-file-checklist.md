# 08 — File Checklist

Генератор **обязан** создать каждый файл из списка. Отмечай мысленно ☑. Пропуск файла = провал DoD.

Рядом с путём — краткое содержание (1–2 предложения). Код внутри файла — **полный**, без сокращений.

---

## 8.1 Project root / Angular scaffold

| # | Path | Content |
|---|------|---------|
| 1 | `package.json` | Имя `orrery-web-pro`, scripts start/build/test |
| 2 | `angular.json` | project config, styles `src/styles.scss` |
| 3 | `tsconfig.json` | base TS config |
| 4 | `tsconfig.app.json` | app TS config |
| 5 | `tsconfig.spec.json` | spec TS config |
| 6 | `src/index.html` | title Orrery Web Pro, root element |
| 7 | `src/main.ts` | bootstrapApplication |
| 8 | `src/styles.scss` | CSS variables themes, reset, body full viewport |
| 9 | `README.md` | How to install, start, test, hotkeys summary |

---

## 8.2 App shell

| # | Path | Content |
|---|------|---------|
| 10 | `src/app/app.config.ts` | zoneless providers |
| 11 | `src/app/app.component.ts` | composition + hotkeys init + theme effect |
| 12 | `src/app/app.component.html` | toolbar, shell, footer, banner, compare |
| 13 | `src/app/app.component.scss` | shell layout grid/responsive |

---

## 8.3 Core constants

| # | Path | Content |
|---|------|---------|
| 14 | `src/app/core/constants/astronomy.constants.ts` | AU_KM, SUN_MU, EPOCH, EARTH_MU, … |
| 15 | `src/app/core/constants/time.constants.ts` | presets, min/max |
| 16 | `src/app/core/constants/scale.constants.ts` | REAL_/VISUAL_ коэффициенты |
| 17 | `src/app/core/constants/render.constants.ts` | DPR, stars, samples, rings factors |

---

## 8.4 Core models

| # | Path | Content |
|---|------|---------|
| 18 | `src/app/core/models/body-kind.model.ts` | BodyKind, BodyId |
| 19 | `src/app/core/models/orbital-elements.model.ts` | OrbitalElements |
| 20 | `src/app/core/models/celestial-body.model.ts` | CelestialBody |
| 21 | `src/app/core/models/body-runtime-state.model.ts` | Vec2, BodyRuntimeState |
| 22 | `src/app/core/models/simulation-state.model.ts` | SimulationState |
| 23 | `src/app/core/models/camera-state.model.ts` | CameraState |
| 24 | `src/app/core/models/scale-mode.model.ts` | ScaleMode |
| 25 | `src/app/core/models/compare-state.model.ts` | CompareState |
| 26 | `src/app/core/models/theme.model.ts` | ThemeId |
| 27 | `src/app/core/models/locale.model.ts` | LocaleId |

---

## 8.5 Domain astronomy

| # | Path | Content |
|---|------|---------|
| 28 | `src/app/domain/astronomy/anomaly.util.ts` | normalizeAngle |
| 29 | `src/app/domain/astronomy/julian.util.ts` | helpers JD / days |
| 30 | `src/app/domain/astronomy/newton-raphson.ts` | solveEccentricAnomaly |
| 31 | `src/app/domain/astronomy/kepler.ts` | anomalies, r, sampleOrbitPoints |
| 32 | `src/app/domain/astronomy/orbital-transform.ts` | ecliptic + projectToScene |
| 33 | `src/app/domain/astronomy/vis-viva.ts` | computeSpeedKmPerS |
| 34 | `src/app/domain/astronomy/format.util.ts` | formatMass, formatAu, … |
| 35 | `src/app/domain/astronomy/newton-raphson.spec.ts` | tests |
| 36 | `src/app/domain/astronomy/kepler.spec.ts` | tests |

---

## 8.6 Domain bodies data

| # | Path | Content |
|---|------|---------|
| 37 | `src/app/domain/bodies/sun.data.ts` | Sun definition |
| 38 | `src/app/domain/bodies/planets.data.ts` | 8 planets full elements |
| 39 | `src/app/domain/bodies/moon.data.ts` | Moon |
| 40 | `src/app/domain/bodies/dwarfs.data.ts` | Ceres, Pluto, Eris |
| 41 | `src/app/domain/bodies/comets.data.ts` | Halley, Encke |
| 42 | `src/app/domain/bodies/asteroid-belt.data.ts` | AsteroidBeltConfig |
| 43 | `src/app/domain/bodies/body-catalog.ts` | merge + deg→rad + maps |

---

## 8.7 State stores

| # | Path | Content |
|---|------|---------|
| 44 | `src/app/state/simulation.store.ts` | time + bodyStates + selection |
| 45 | `src/app/state/camera.store.ts` | pan zoom follow |
| 46 | `src/app/state/ui.store.ts` | theme locale scale layers compare |
| 47 | `src/app/state/catalog.store.ts` | catalog + visibleBodies |
| 48 | `src/app/state/simulation.store.spec.ts` | time scale tests |

---

## 8.8 Services

| # | Path | Content |
|---|------|---------|
| 49 | `src/app/services/physics.service.ts` | computeAll |
| 50 | `src/app/services/render-loop.service.ts` | rAF loop |
| 51 | `src/app/services/screenshot.service.ts` | PNG download |
| 52 | `src/app/services/hotkeys.service.ts` | keyboard map |
| 53 | `src/app/services/i18n.service.ts` | t() / dictionaries |

---

## 8.9 i18n

| # | Path | Content |
|---|------|---------|
| 54 | `src/app/i18n/locale.type.ts` | re-export/type |
| 55 | `src/app/i18n/i18n.keys.ts` | keys list |
| 56 | `src/app/i18n/dictionaries/ru.ts` | полный RU словарь |
| 57 | `src/app/i18n/dictionaries/en.ts` | полный EN словарь |

---

## 8.10 Feature: Canvas

| # | Path | Content |
|---|------|---------|
| 58 | `src/app/features/orrery-canvas/orrery-canvas.component.ts` | host canvas + lifecycle |
| 59 | `src/app/features/orrery-canvas/orrery-canvas.component.html` | canvas element |
| 60 | `src/app/features/orrery-canvas/orrery-canvas.component.scss` | full size |
| 61 | `src/app/features/orrery-canvas/canvas-renderer.ts` | draw snapshot |
| 62 | `src/app/features/orrery-canvas/canvas-camera.ts` | transforms + scale fns |
| 63 | `src/app/features/orrery-canvas/canvas-pointer.controller.ts` | pan zoom pick |
| 64 | `src/app/features/orrery-canvas/layers/starfield.layer.ts` | stars |
| 65 | `src/app/features/orrery-canvas/layers/orbits.layer.ts` | orbit polylines |
| 66 | `src/app/features/orrery-canvas/layers/asteroid-belt.layer.ts` | belt points |
| 67 | `src/app/features/orrery-canvas/layers/bodies.layer.ts` | spheres gradients |
| 68 | `src/app/features/orrery-canvas/layers/rings.layer.ts` | Saturn rings |
| 69 | `src/app/features/orrery-canvas/layers/labels.layer.ts` | text labels |

---

## 8.11 Feature: Sidebar

| # | Path | Content |
|---|------|---------|
| 70 | `src/app/features/sidebar/sidebar.component.ts` | container |
| 71 | `src/app/features/sidebar/sidebar.component.html` | layout |
| 72 | `src/app/features/sidebar/sidebar.component.scss` | styles |
| 73 | `src/app/features/sidebar/body-list.component.ts` | list |
| 74 | `src/app/features/sidebar/body-list.component.html` | @for sections |
| 75 | `src/app/features/sidebar/body-list.component.scss` | styles |
| 76 | `src/app/features/sidebar/body-card.component.ts` | details |
| 77 | `src/app/features/sidebar/body-card.component.html` | fields |
| 78 | `src/app/features/sidebar/body-card.component.scss` | styles |

---

## 8.12 Feature: Time / Scale / Compare / Toolbar

| # | Path | Content |
|---|------|---------|
| 79 | `src/app/features/time-player/time-player.component.ts` | player logic |
| 80 | `src/app/features/time-player/time-player.component.html` | controls |
| 81 | `src/app/features/time-player/time-player.component.scss` | styles |
| 82 | `src/app/features/scale-controls/scale-controls.component.ts` | mode switch |
| 83 | `src/app/features/scale-controls/scale-controls.component.html` | UI |
| 84 | `src/app/features/scale-controls/scale-controls.component.scss` | styles |
| 85 | `src/app/features/scale-controls/real-scale-banner.component.ts` | warning |
| 86 | `src/app/features/scale-controls/real-scale-banner.component.html` | text+actions |
| 87 | `src/app/features/scale-controls/real-scale-banner.component.scss` | styles |
| 88 | `src/app/features/compare/compare-panel.component.ts` | compare logic |
| 89 | `src/app/features/compare/compare-panel.component.html` | table |
| 90 | `src/app/features/compare/compare-panel.component.scss` | drawer styles |
| 91 | `src/app/features/toolbar/toolbar.component.ts` | toolbar |
| 92 | `src/app/features/toolbar/toolbar.component.html` | buttons |
| 93 | `src/app/features/toolbar/toolbar.component.scss` | styles |

---

## 8.13 Prompt docs (этот пакет — уже в репозитории)

Не удаляй папку `docs/` с промптами при генерации приложения. Если приложение создаётся в подпапке `orrery-web-pro/`, оставь `docs/` на уровне monorepo/pet корня или скопируй ссылку в README.

---

## 8.14 Итог

**Всего обязательных файлов приложения: 93** (плюс стандартные CLI служебные вроде `public/favicon.ico`, если CLI создаёт).

Перед сдачей: пройди таблицу сверху и убедись, что каждый path существует и не содержит `TODO` / `// ...`.

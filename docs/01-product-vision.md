# 01 — Product Vision & UX

Документ обязателен к исполнению целиком. Генератор кода не имеет права упрощать сценарии или выкидывать режимы.

---

## 1.1 Продукт

| Поле | Значение |
|------|----------|
| Название | **Orrery Web Pro** |
| Подзаголовок (RU) | Симулятор Солнечной Системы |
| Подзаголовок (EN) | Solar System Simulator |
| Тип | SPA, образовательно-научный интерактивный оррери |
| Платформа | Современный desktop Chrome/Firefox/Edge; mobile — usable (sidebar collapsible), desktop — primary |
| Рендер | HTML5 Canvas 2D |
| Научный уровень | Keplerian 2-body относительно Солнца; Луна — относительно Земли; без полной N-body гравитации |

**Ценность:** показать одновременно красоту Солнечной системы и её реальную пустоту (режим Real scale), дав инструменты для изучения орбит, периодов и сравнительных характеристик тел.

**Аудитория:** студенты, преподаватели, энтузиасты астрономии, разработчики, изучающие Angular + canvas simulations.

---

## 1.2 Информационная архитектура экрана

Один главный экран (без роутинга страниц):

```
┌────────────────────────────────────────────────────────────────┐
│ Toolbar: brand | theme | lang | labels | dwarfs | comets | 📷  │
├──────────────────────────────┬─────────────────────────────────┤
│                              │ Sidebar                         │
│                              │  - список тел                   │
│         Canvas (full)        │  - карточка выбранного          │
│                              │  - compare slot (если открыт)   │
│                              │                                 │
├──────────────────────────────┴─────────────────────────────────┤
│ Bottom bar: Time Player | Scale mode | speed presets | hint    │
└────────────────────────────────────────────────────────────────┘
│ Toast/Banner: Real-scale emptiness warning (когда Real active) │
```

- Canvas занимает всю доступную область под toolbar и над bottom bar.
- Sidebar справа, ширина **320px** desktop; на ширине `< 900px` — overlay с кнопкой закрытия.
- Z-index: canvas (0) < panels (10) < banners (20) < modals/compare drawer (30).

---

## 1.3 User Journeys (обязательные сценарии)

### J1 — Первый запуск / обзор системы
1. Пользователь открывает приложение.
2. Тема: **dark** (космос). Locale: **ru**.
3. Scale mode: **Visual**. Time: **playing**, скорость по умолчанию = **1 симуляционный день за 1 реальную секунду**.
4. Камера: центр на Солнце, zoom подобран так, чтобы орбита Нептуна целиком помещалась с padding 8%.
5. Видны: Солнце, 8 планет, орбиты, Луна, кольца Сатурна, астероидный пояс, labels включены.
6. Карлики и кометы **выключены** по умолчанию.

### J2 — Фокус на планете
1. Клик по планете на canvas **или** клик по строке в sidebar.
2. Тело становится `selectedBodyId`.
3. Камера плавно (или сразу — допустимо без анимации, но без скачков каждый кадр) переходит в режим **follow**: центр камеры = позиция тела каждый кадр.
4. Sidebar показывает карточку с live-метриками.
5. `Esc` или кнопка «Снять фокус» → follow off, камера остаётся на последней позиции (не прыгает к Солнцу).

### J3 — Реальный масштаб (пустота космоса)
1. Пользователь выбирает Scale mode **Real** (кнопка или клавиша `1`).
2. Появляется **неблокирующий banner** (RU/EN) с объяснением, почему планеты почти не видны.
3. Планеты становятся точками/субпиксельными кругами; Солнце тоже резко меньше относительно орбит, но остаётся маркером центра (минимальный экранный радиус clamp — см. 05).
4. Пользователь может zoom/pan, чтобы «найти» Землю.
5. Переключение на Visual (`2`) скрывает banner.

Текст предупреждения (RU):

> **Реальный масштаб:** расстояния между планетами огромны по сравнению с их размерами. Планеты выглядят как едва заметные точки — так выглядит пустота Солнечной системы. Для удобного изучения включите «Визуальный масштаб».

Текст (EN):

> **Real scale:** planetary distances dwarf the planets themselves. Worlds appear as tiny dots — this is the emptiness of the Solar System. Switch to Visual scale for comfortable study.

### J4 — Управление временем
1. Space → toggle pause/play.
2. Кнопки/пресеты: Day / Month / Year (и слайдер непрерывного множителя — см. 06).
3. При паузе позиции заморожены; при play — интегрируется симуляционное время.

### J5 — Сравнение тел
1. Пользователь открывает Compare (кнопка в sidebar или toolbar).
2. Выбирает 2 или 3 тела (checkbox / multi-select; максимум 3).
3. Таблица показывает side-by-side: mass, radius, a, e, current r (AU), current v (km/s), orbital period, kind.
4. Закрытие Compare не сбрасывает selection фокуса камеры.

### J6 — Скриншот
1. Кнопка 📷 / hotkey `S` (без модификаторов, только если фокус не в input).
2. Скачивается PNG текущего кадра canvas: `orrery-web-pro-YYYYMMDD-HHmmss.png`.
3. UI chrome (sidebar/toolbar) **не** обязан попадать в PNG — только canvas scene.

### J7 — Слои карликов и комет
1. Тумблер Dwarfs → появляются Ceres, Pluto, Eris + их орбиты.
2. Тумблер Comets → Halley, Encke + орбиты (сильно вытянутые).
3. Они участвуют в sidebar list (с фильтром по kind) и в compare/focus.

### J8 — Смена языка и темы
1. Lang RU↔EN мгновенно переводит все UI-строки через `t(key)`.
2. Theme dark↔light меняет CSS variables панелей; canvas фон остаётся космическим (тёмный), но цвет орбит/текста labels адаптируется для контраста на светлых панелях.

---

## 1.4 Режимы масштаба (продуктовое определение)

| Mode id | Имя RU | Имя EN | Назначение |
|---------|--------|--------|------------|
| `real` | Реальный масштаб | Real scale | Научная демонстрация пустоты: линейный масштаб AU→px и radius→px из одних констант |
| `visual` | Визуальный (схематичный) | Visual (schematic) | Обучение: орбиты сжаты log/custom, радиусы тел увеличены для читаемости |

Точные коэффициенты трансформации — в [05-canvas-renderer.md](05-canvas-renderer.md). Здесь запрещено оставлять «на усмотрение»: генератор **обязан** использовать коэффициенты из документа 05.

---

## 1.5 Горячие клавиши

| Клавиша | Действие |
|---------|----------|
| `Space` | Pause / Play |
| `+` или `=` | Увеличить скорость на один шаг пресета |
| `-` | Уменьшить скорость на один шаг пресета |
| `F` | Focus follow на текущем selected (если нет selected — на Earth) |
| `Esc` | Снять focus follow |
| `1` | Scale = Real |
| `2` | Scale = Visual |
| `L` | Toggle labels |
| `D` | Toggle dwarfs layer |
| `C` | Toggle comets layer |
| `S` | Screenshot |
| `T` | Toggle theme |
| `G` | Toggle language RU↔EN |

Игнорировать hotkeys, когда `event.target` — `INPUT`, `TEXTAREA`, `SELECT`, или `contenteditable`.

---

## 1.6 Доступность (a11y) — минимум

1. Все кнопки toolbar / player имеют `aria-label` (через i18n keys).
2. Play/Pause: `aria-pressed` отражает состояние.
3. Scale mode: radiogroup с `aria-checked`.
4. Sidebar list: роли `listbox` / `option` или кнопки с `aria-current` для selected.
5. Контраст текста панелей ≥ WCAG AA на обеих темах.
6. Canvas сам по себе не обязан быть screen-reader полным; рядом в sidebar дублируется семантическая информация о выбранном теле.
7. Focus trap для overlay sidebar на mobile при открытии — желателен; если сложно — хотя бы кнопка Close доступна с клавиатуры.

---

## 1.7 Визуальный язык UI (панели)

**Не** использовать «AI-дефолт»: фиолетовые градиенты, cream+#terracotta, Inter/Roboto как единственный шрифт.

Зафиксировать CSS variables:

```scss
:root, [data-theme='dark'] {
  --owp-bg-panel: #0b1220;
  --owp-bg-panel-elevated: #121a2b;
  --owp-border: #243049;
  --owp-text: #e8eefc;
  --owp-text-muted: #9aa8c3;
  --owp-accent: #3dbbff;      // ледяной циан, не purple
  --owp-accent-warm: #ffb454; // для Солнца/warning
  --owp-danger: #ff6b6b;
  --owp-font-ui: 'Segoe UI', 'Source Sans 3', system-ui, sans-serif;
  --owp-font-mono: 'JetBrains Mono', 'Consolas', monospace;
}

[data-theme='light'] {
  --owp-bg-panel: #f4f7fb;
  --owp-bg-panel-elevated: #ffffff;
  --owp-border: #d5deea;
  --owp-text: #142033;
  --owp-text-muted: #5b6b86;
  --owp-accent: #0077c8;
  --owp-accent-warm: #c45c00;
  --owp-danger: #c62828;
}
```

Canvas фон: радиальный градиент почти чёрного + слой procedural/starfield (см. 05). Панели — glass/solid поверх, не «карточки ради карточек» в hero; это app shell, карточка допустима только для detail/compare как контейнер данных.

Минимум motion:
1. Плавное появление banner Real scale (`opacity` + `translateY`, 200ms).
2. Подсветка selected row в sidebar.
3. Пульс glow у Солнца (очень лёгкий, через canvas time, не CSS spam).

---

## 1.8 Что НЕ входит в продукт

- Пользовательские аккаунты, backend, БД.
- Релятивистские поправки, возмущения планет, прецессия.
- Текстуры NASA photo-realistic (допустимы простые градиенты/цвета).
- VR/AR.
- SSR (отключён).

---

## 1.9 Критерий готовности документа 01

Генератор реализовал все journeys J1–J8, hotkeys, оба scale mode с warning, a11y-минимум и CSS variables выше.

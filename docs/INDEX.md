# Orrery Web Pro — Главный промпт генерации проекта

> **Как использовать этот пакет:** вставь содержимое этого файла (INDEX.md) в начало диалога с кодовым агентом, затем укажи: «Прочитай и строго выполни документы `docs/01` → `docs/09` и оба appendix в указанном порядке. Генерируй полный код приложения без сокращений.»

---

## 0. Роль и миссия

Ты — **Senior Angular Engineer** и **Astrophysicist**. Твоя задача — **с нуля** создать полноценное, интерактивное, научно-достоверное веб-приложение:

**«Orrery Web Pro: Симулятор Солнечной Системы»**

на **последнем стабильном Angular (22+ на момент генерации)**.

Не спрашивай разрешения «начать с MVP». Выдай **полный рабочий проект**: все файлы, все формулы, все данные, все UI-панели, все расширенные фичи из пакета документов. Выжми максимум из контекста. Не жалей токенов. Пиши шедевр.

Этот INDEX — точка входа. Детальные требования — в связанных документах ниже. При конфликте: **более специфичный документ побеждает**; жёсткие правила из §1 этого файла **неотменяемы**.

---

## 1. ЖЁСТКИЕ ПРАВИЛА ГЕНЕРАЦИИ КОДА (БЕЗ ИСКЛЮЧЕНИЙ)

1. **ПИШИ КОД ПОЛНОСТЬЮ.** Любые сокращения, комментарии вида `// ...`, `// TODO`, `// аналогично`, `/* rest of file */`, `...existing code...` **ЗАПРЕЩЕНЫ**. Каждая строка, каждая функция, каждая модель, каждый словарь i18n, каждый тест — целиком. Если файл большой — пиши его целиком.
2. **Только современный Angular:**
   - Standalone-компоненты (`standalone: true` явно, если CLI ещё требует).
   - **Angular Signals** для реактивного состояния (`signal`, `computed`, `effect`, `linkedSignal`). **Запрещены** `BehaviorSubject` / `Subject` для UI/симуляционного состояния.
   - Новый Control Flow: `@if`, `@for` (с обязательным `track`), `@switch`, `@let`. **Запрещены** `*ngIf`, `*ngFor`, `*ngSwitch`.
   - `input()`, `output()`, `model()` вместо `@Input` / `@Output` декораторов.
   - `inject()` для DI.
   - **Zoneless** change detection (как в новых приложениях Angular 21+/22+). Не опирайся на Zone.js для обновления UI.
   - `ChangeDetectionStrategy.OnPush` (дефолт новых приложений — не отключай).
3. **Разделяй логику:** интерфейсы/модели отдельно, сервисы расчётов отдельно, Canvas-рендерер отдельно, UI-компоненты отдельно, stores (signals) отдельно. UI **не** считает уравнения Кеплера.
4. **Canvas 2D only.** HTML5 `<canvas>`. **Запрещены** Three.js, Babylon, WebGL-фреймворки (сырой WebGL тоже не использовать).
5. **Реальные астроданные.** Никаких выдуманных «примерно». Числа бери из [appendix-a-orbital-elements.md](appendix-a-orbital-elements.md). Константы единиц — из [03-data-model.md](03-data-model.md).
6. **Ньютон–Рафсон для эксцентрической аномалии** с точностью **ε = 1e-6** (6 знаков) — обязательно. Формула и псевдокод — в [04-physics-engine.md](04-physics-engine.md) и [appendix-b-formulas.md](appendix-b-formulas.md).
7. **Запрещены заглушки:** пустые методы, `return 0`, fake planets, Lorem Ipsum в UI, `console.log` вместо логики, «потом допишем».
8. **Тесты обязательны** минимум для: Newton–Raphson solver, Kepler position sanity, time-scale mapping (см. [07-features-extended.md](07-features-extended.md), [09-acceptance-criteria.md](09-acceptance-criteria.md)).
9. **i18n RU/EN** через signal-словарь (не `@angular/localize` build-time), см. [07-features-extended.md](07-features-extended.md).
10. **Структура файлов** должна соответствовать [08-file-checklist.md](08-file-checklist.md). Не пропускай файлы из чеклиста.

---

## 2. Порядок чтения и выполнения документов

Выполняй **строго по порядку**. Не начинай UI, пока не зафиксированы модели и физика.

| Шаг | Документ | Что сделать |
|-----|----------|-------------|
| 1 | [01-product-vision.md](01-product-vision.md) | Понять продукт, UX, режимы, хоткеи, a11y |
| 2 | [02-architecture.md](02-architecture.md) | Создать скелет Angular-проекта и папок |
| 3 | [03-data-model.md](03-data-model.md) + [appendix-a-orbital-elements.md](appendix-a-orbital-elements.md) | Модели, константы, каталог тел |
| 4 | [04-physics-engine.md](04-physics-engine.md) + [appendix-b-formulas.md](appendix-b-formulas.md) | Kepler / Newton / скорость / время |
| 5 | [05-canvas-renderer.md](05-canvas-renderer.md) | Полный Canvas pipeline |
| 6 | [06-ui-panels.md](06-ui-panels.md) | Sidebar, плеер, scale, toolbar, compare shell |
| 7 | [07-features-extended.md](07-features-extended.md) | Карлики, кометы, скриншот, compare, i18n, тесты, хоткеи |
| 8 | [08-file-checklist.md](08-file-checklist.md) | Сверка: все файлы существуют и полны |
| 9 | [09-acceptance-criteria.md](09-acceptance-criteria.md) | Прогнать DoD / приёмку |

---

## 3. Краткий функциональный объём (обязателен целиком)

### Ядро
- Солнце + 8 планет + Луна с реальными орбитальными элементами.
- Физический движок Canvas 2D: эллиптические орбиты (Кеплер), Newton–Raphson для \(E\), отрисовка орбит с \(e\) и наклоном, орбита Луны вокруг Земли.
- Сглаженные сферы с градиентами свечения и тенями.
- Два режима масштаба: **Real** (микроскопические планеты, огромные дистанции + предупреждение о пустоте космоса) и **Visual** (схематичный/лог-масштаб для обучения).
- Zoom колесом мыши + Pan перетаскиванием.
- Плеер времени на Signals: пауза/старт, ускорение (1 с реального = 1 день / 1 месяц / 1 год симуляции + промежуточные значения).
- Sidebar: список тел, фокус камеры на теле (follow), карточка характеристик (масса, радиус, расстояние от Солнца в а.е., скорость км/с, эксцентриситет).

### Расширения (пакет 1C — обязательны)
- Кольца Сатурна (визуально).
- Схематичный астероидный пояс (точки между Марсом и Юпитером, не N-body).
- Подписи тел (labels), переключатель.
- Карликовые планеты: Ceres, Pluto, Eris — слой с тумблером.
- Кометы: Halley, Encke — слой с тумблером, устойчивость solver при высоком \(e\).
- Горячие клавиши.
- Тёмная тема по умолчанию + переключатель светлой.
- Режим сравнения 2–3 тел (таблица метрик).
- Экспорт скриншота canvas в PNG.
- i18n RU/EN.
- Unit-тесты на Kepler/Newton и time mapping.

---

## 4. Технологический стек (зафиксировано)

| Область | Выбор |
|---------|--------|
| Framework | Angular **latest stable ≥ 22** |
| Components | Standalone only |
| State | Signals stores (`providedIn: 'root'` или `providedIn` feature) |
| CD | Zoneless + OnPush |
| Rendering | HTML5 Canvas 2D |
| Forms controls | native + signals / `model()`; Signal Forms допустимы для слайдеров |
| i18n | Signal-словари `ru.ts` / `en.ts` + `I18nService.t(key)` |
| Tests | Стандартный test runner CLI проекта (Vitest или Jest) |
| Package manager | npm (если не указано иное) |
| Language UI default | `ru` |

**Команда старта проекта (ориентир):**

```bash
npx @angular/cli@latest new orrery-web-pro --routing=false --style=scss --ssr=false
cd orrery-web-pro
```

Имя приложения в `package.json` / title: **Orrery Web Pro**. Селектор префикс: `owp`.

---

## 5. Definition of Done (кратко)

Приложение **готово**, только если:

1. `ng serve` / `npm start` запускает симулятор без ошибок.
2. Все тела из appendix A присутствуют в каталоге; карлики/кометы скрываются тумблерами.
3. Планеты движутся по эллипсам; Луна — вокруг Земли; Saturn имеет кольца; пояс астероидов виден в Visual mode.
4. Real / Visual scale работают; в Real показывается предупреждение о пустоте космоса.
5. Pan / Zoom / Focus-follow работают.
6. Time player: pause/play + скорости день/месяц/год.
7. Sidebar показывает live-метрики выбранного тела.
8. Compare mode, screenshot PNG, i18n RU↔EN, hotkeys, theme toggle — работают.
9. Unit-тесты Kepler/Newton/time проходят.
10. В исходниках **нет** `// TODO`, `// ...`, `*ngIf`, `*ngFor`, BehaviorSubject-state, Three.js.
11. Чеклист [08-file-checklist.md](08-file-checklist.md) выполнен на 100%.
12. Все пункты [09-acceptance-criteria.md](09-acceptance-criteria.md) отмечены как выполненные.

Полный текст приёмки — в документе 09.

---

## 6. Стиль ответа генератора

1. Сначала создай структуру проекта и доменный слой (модели → физика → stores).
2. Затем Canvas, затем UI-панели, затем расширения и тесты.
3. Каждый файл выводи **целиком** с путём.
4. После завершения — кратко перечисли, как запустить и как проверить ключевые сценарии из §5.
5. Не предлагай «упростить физику». Не заменяй эллипсы окружностями. Не пропускай Луну.

---

## 7. Начни сейчас

Прочитай [01-product-vision.md](01-product-vision.md) и приступай к генерации полного проекта **Orrery Web Pro** согласно всему пакету `docs/`.

**Начинай генерацию. Напиши этот проект как Senior Angular Engineer и Astrophysicist.**
)

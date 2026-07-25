# 09 — Acceptance Criteria & Definition of Done

Чеклист приёмки. Генератор после завершения работ **обязан** пройти каждый пункт. Пункт провален → доработать код, не оправдываться.

---

## 9.1 Build & Run

- [ ] `npm install` завершается без ошибок
- [ ] `npm start` / `ng serve` поднимает приложение
- [ ] Консоль браузера без ошибок runtime при старте
- [ ] Нет красных ошибок Angular (NG0xxx) в консоли
- [ ] Zoneless: приложение реагирует на play/pause и selection без Zone.js hacks

---

## 9.2 Научная достоверность / физика

- [ ] В коде есть Newton–Raphson с формулой \(E_{n+1}=E_n-\frac{E_n-e\sin E_n-M}{1-e\cos E_n}\)
- [ ] Критерий остановки ε = **1e-6**
- [ ] Планеты движутся по эллипсам (не окружностям при e>0 — визуально у Меркурия/Марса/Плутона/комет смещение заметно)
- [ ] Использованы реальные данные из Appendix A (a, e, period, radius, mass, colors)
- [ ] True anomaly присутствует в runtime state и отображается в карточке
- [ ] Скорость считается vis-viva и отображается в km/s
- [ ] Луна обращается вокруг Земли (не вокруг Солнца как 9-я планета)
- [ ] Наклоны орбит учитываются (Ω, i, ω) в позициях/траекториях
- [ ] Кометы с высоким e не ломают симуляцию (нет NaN позиций)

---

## 9.3 Canvas / визуализация

- [ ] Солнце и планеты рисуются градиентными «сферами» с тёмной стороной
- [ ] У Солнца есть glow
- [ ] Орбитальные линии отрисованы для видимых тел
- [ ] Орбита Луны видна вокруг Земли
- [ ] Кольца Сатурна видны
- [ ] Астероидный пояс виден (особенно в Visual)
- [ ] Labels включаются/выключаются тумблером
- [ ] Selected body имеет визуальный акцент
- [ ] Resize окна не ломает canvas (DPR учтён)

---

## 9.4 Масштаб / камера

- [ ] Режим **Visual** по умолчанию; все планеты до Нептуна читаемы
- [ ] Режим **Real**: планеты ≈ точки; показывается warning banner о пустоте космоса
- [ ] Переключение 1/2 и UI controls работает
- [ ] Zoom колесом к курсору
- [ ] Pan перетаскиванием
- [ ] Focus follow: камера следует за выбранным телом по орбите
- [ ] Esc снимает follow

---

## 9.5 Время

- [ ] Play/Pause работает (Space)
- [ ] Пресеты Hour / Day / Month / Year задают корректные days/sec
- [ ] Slider меняет скорость (log mapping)
- [ ] При паузе позиции не обновляются со временем

---

## 9.6 Sidebar / карточка

- [ ] Список тел кликабелен и фокусирует камеру
- [ ] Карточка показывает: mass, radius, distance from Sun (AU), speed km/s, eccentricity (+ остальные поля из 06)
- [ ] Метрики live обновляются во время play
- [ ] Для Солнца орбитальные поля скрыты корректно

---

## 9.7 Расширения 1C

- [ ] Тумблер Dwarfs показывает/скрывает Ceres, Pluto, Eris
- [ ] Тумблер Comets показывает/скрывает Halley, Encke
- [ ] Compare: выбор 2–3 тел, таблица метрик live
- [ ] Screenshot скачивает PNG с именем `orrery-web-pro-*.png`
- [ ] i18n: переключение RU↔EN меняет все UI-строки
- [ ] Theme dark/light переключает панели
- [ ] Hotkeys из документа 01 работают

---

## 9.8 Архитектура / качество кода

- [ ] Standalone components only
- [ ] Signals для состояния; нет BehaviorSubject-state
- [ ] Control flow `@if`/`@for`/`@switch`; нет `*ngIf`/`*ngFor`
- [ ] UI не импортирует newton-raphson/kepler напрямую
- [ ] Нет `// TODO`, `// ...`, `// аналогично`, placeholder Lorem
- [ ] Нет Three.js / Pixi / WebGL frameworks
- [ ] Структура соответствует [08-file-checklist.md](08-file-checklist.md)

---

## 9.9 Тесты

- [ ] `npm test` / `ng test` проходит для:
  - [ ] newton-raphson.spec.ts
  - [ ] kepler.spec.ts
  - [ ] simulation.store.spec.ts
- [ ] Есть кейс e≈0.967 (comet-like) на сходимость solver

---

## 9.10 UX journeys regression

Пройди вручную:

1. J1 First launch — visual overview OK
2. J2 Focus Earth — follow OK, card OK
3. J3 Real scale — banner OK, planets tiny
4. J4 Time year preset — outer planets заметно движутся
5. J5 Compare Earth/Jupiter/Saturn — table OK
6. J6 Screenshot — file downloads
7. J7 Enable dwarfs+comets — appear in list and canvas
8. J8 Switch EN + light theme — strings/theme OK

---

## 9.11 Финальный DoD (из INDEX)

Приложение готово **только если** все секции 9.1–9.10 выполнены.

После этого генератор кратко пишет в ответе:
1. Как запустить
2. Список hotkeys
3. Подтверждение: «All acceptance criteria in docs/09 satisfied.»

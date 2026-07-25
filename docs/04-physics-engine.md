# 04 — Physics Engine

Реализуй физику **точно** по этому документу и [appendix-b-formulas.md](appendix-b-formulas.md). Не заменяй эллипсы окружностями. Не используй Euler integration позиций «вперёд по касательной» вместо Кеплера.

---

## 4.1 Файлы

| Файл | Назначение |
|------|------------|
| `domain/astronomy/anomaly.util.ts` | Нормализация углов в \([-\pi, \pi]\) и \([0, 2\pi)\) |
| `domain/astronomy/julian.util.ts` | Работа с JD / днями от эпохи (минимум) |
| `domain/astronomy/newton-raphson.ts` | Решение Кеплерова уравнения \(M = E - e\sin E\) |
| `domain/astronomy/kepler.ts` | M→E→ν→ позиция в орбитальной плоскости |
| `domain/astronomy/orbital-transform.ts` | Поворот в эклиптику (3-1-3 / Ω, i, ω) |
| `domain/astronomy/vis-viva.ts` | Скорость по vis-viva |
| `services/physics.service.ts` | Оркестрация: все тела → `BodyRuntimeState` |

---

## 4.2 Время симуляции

Пусть \(t\) — `simulationTimeDays` (дни от эпохи элементов, согласованной с `epochJd` в data; для простоты можно считать `epochJd = J2000` и `simulationTimeDays = 0` на старте соответствует эпохе).

Для тела с периодом \(P\) (дни) и средней аномалией на эпоху \(M_0\):

\[
n = \frac{2\pi}{P}
\]

\[
M(t) = M_0 + n \cdot (t - t_{\text{epoch}})
\]

где \(t_{\text{epoch}} = 0\), если все элементы приведены к одной эпохе в Appendix A.

Нормализуй \(M\) в диапазон \([0, 2\pi)\).

`PhysicsService.advance(dtRealSeconds)`:
1. `daysDelta = dtRealSeconds * timeScaleDaysPerSecond`
2. `simulationTimeDays += daysDelta`
3. Пересчитать все активные тела.

---

## 4.3 Ньютон–Рафсон для эксцентрической аномалии

Уравнение Кеплера:

\[
M = E - e \sin E
\]

Итерация:

\[
E_{n+1} = E_n - \frac{E_n - e \sin E_n - M}{1 - e \cos E_n}
\]

**Требования реализации** (`solveEccentricAnomaly(M: number, e: number): number`):

1. Начальное приближение:
   - если \(e < 0.8\): \(E_0 = M\)
   - иначе: \(E_0 = \pi\) (лучше для комет)
2. Точность: останавливайся когда \(|\Delta E| < 10^{-6}\) (**ε = 1e-6**).
3. `maxIterations = 50`.
4. Если не сошлось — после maxIterations верни последнее \(E\) и `console.warn` один раз на тело (не каждый кадр: используй flag/set), либо бросай в тестах.
5. Защита знаменателя: если \(|1 - e\cos E| < 1e-12\), слегка сдвинь \(E\) на `1e-8`.
6. Для \(e \ge 0.95\) (кометы): после решения дополнительно clamp проверку невязки \(|E - e\sin E - M|\); если \(> 1e-4\), повтори с другим \(E_0\) (`M`, `π`, `π - e` — перебери 3 старта, выбери минимальную невязку).

Экспортируй также `keplerResidual(E, M, e)` для тестов.

---

## 4.4 Истинная аномалия и радиус

\[
\tan\frac{\nu}{2} = \sqrt{\frac{1+e}{1-e}} \tan\frac{E}{2}
\]

Практичная устойчивая форма:

\[
\cos\nu = \frac{\cos E - e}{1 - e\cos E},\quad
\sin\nu = \frac{\sqrt{1-e^2}\sin E}{1 - e\cos E}
\]

\[
\nu = \operatorname{atan2}(\sin\nu, \cos\nu)
\]

Радиус-вектор в орбитальной плоскости:

\[
r = a (1 - e \cos E)
\]

Позиция в орбитальной плоскости (перицентр along +x):

\[
x_{\text{orb}} = r \cos\nu,\quad y_{\text{orb}} = r \sin\nu,\quad z_{\text{orb}} = 0
\]

Для планет \(a\) в AU → \(r\) в AU. Для Луны \(a\) в km → \(r\) в km.

---

## 4.5 Поворот в эклиптическую систему

Используй стандартный набор вращений (Ω, i, ω):

\[
\begin{align*}
x &= r\big(\cos\Omega\cos(\omega+\nu) - \sin\Omega\sin(\omega+\nu)\cos i\big) \\
y &= r\big(\sin\Omega\cos(\omega+\nu) + \cos\Omega\sin(\omega+\nu)\cos i\big) \\
z &= r\big(\sin(\omega+\nu)\sin i\big)
\end{align*}
\]

В 2D canvas используй проекцию **на плоскость эклиптики**: бери `(x, y)`, а наклон визуализируй дополнительно сжатием эллипса орбиты по фактору \(\cos i\) при отрисовке траектории (см. 05). Для позиции тела также можно слегка учитывать \(z\) как `y' = y - k*z` (рекомендуется \(k = 0.15\) visual tilt) — зафиксируй `ORBIT_Z_TILT = 0.15` в `orbital-transform.ts` и применяй:

```ts
export function projectToScene(x: number, y: number, z: number): Vec2 {
  return { x, y: y - ORBIT_Z_TILT * z };
}
```

Так наклон орбит виден и у траекторий, и у тел.

---

## 4.6 Vis-viva скорость

\[
v = \sqrt{GM\left(\frac{2}{r} - \frac{1}{a}\right)}
\]

Для heliocentric тел:

- \(GM = \texttt{SUN\_MU\_KM3\_S2}\)
- \(r, a\) переведи в **km** (`aKm = aAu * AU_KM`, `rKm = rAu * AU_KM`)
- \(v\) в km/s

Для Луны (относительно Земли):

- Используй \(\mu_E = G \cdot M_E\), \(M_E = 5.9722\times10^{24}\) kg, переведи в km³/s²:
  \(\mu_E = 398600.4418\) km³/s² (зафиксируй константу `EARTH_MU_KM3_S2 = 398600.4418`).
- \(r, a\) в km.

Функция: `computeSpeedKmPerS(mu, rKm, aKm): number`.

---

## 4.7 Алгоритм по типам тел

### Солнце
- `positionAu = {0,0}`
- anomalies = 0
- `distanceFromSunAu = 0`
- `speedKmPerS = 0`

### Планеты, карлики, кометы (heliocentric)
1. Compute M, E, ν, r_au
2. Orbital plane → ecliptic → projectToScene
3. `positionAu = {x,y}`
4. speed via Sun μ
5. `distanceToParent = distanceFromSunAu`, unit `'au'`

### Луна (geocentric)
1. Сначала получи `earthState.positionAu`
2. Реши Кеплера для Луны с a в km → получи offset km → `offsetAu = offsetKm / AU_KM`
3. `positionAu = earth + offsetAu` (после тех же поворотов/проекции для лунной орбиты)
4. `distanceToParent = r_moon_km`, unit `'km'`
5. `distanceFromSunAu = hypot(positionAu)`
6. `speedKmPerS` — относительно Земли (vis-viva Earth μ)

Порядок обновления в `PhysicsService`: **сначала все parent-less heliocentric**, затем Луна (зависит от Earth).

---

## 4.8 PhysicsService API

```ts
@Injectable({ providedIn: 'root' })
export class PhysicsService {
  /** Полный пересчёт всех тел каталога на момент simulationTimeDays */
  computeAll(
    bodies: readonly CelestialBody[],
    simulationTimeDays: number
  ): Record<BodyId, BodyRuntimeState>;
}
```

`SimulationStore.advance`:
1. обновляет время
2. вызывает `computeAll`
3. `bodyStates.set(result)`

Не кэшируй между кадрами некорректно: при каждом advance нужен свежий snapshot. Оптимизации допустимы только если тесты зелёные и код полный.

---

## 4.9 Траектории (для рендера, не для физики движения)

Движение всегда из Кеплера. Для линии орбиты renderer дискретизирует истинную аномалию \(\nu \in [0, 2\pi)\) шагом например 2°, считает позицию тем же `orbital-transform`, без Newton на каждом семпле (можно из ν напрямую через полярное уравнение \(r = a(1-e^2)/(1+e\cos\nu)\)).

Вынеси `sampleOrbitPoints(elements, samples=180): Vec2[]` в `kepler.ts` или `orbital-transform.ts`.

Для Луны sample относительно Земли, renderer смещает на earth position каждый кадр.

---

## 4.10 Тесты (минимум) — детали в 07/09

1. `solveEccentricAnomaly(0, 0) ≈ 0`
2. Для \(e=0.0167\), \(M=1\), остаток \(|E - e\sin E - M| < 1e-6`
3. Для \(e=0.967\) (Halley-like) solver сходится с residual < 1e-4
4. Земля при t=0 имеет finite position, distance ~ a (с поправкой на e)
5. `TIME_SCALE` mapping: dt=1s при day preset → +1 day

---

## 4.11 Критерий готовности документа 04

Newton–Raphson с ε=1e-6, полный Kepler pipeline, vis-viva, Луна относительно Земли, PhysicsService + store advance, sampleOrbitPoints для renderer.

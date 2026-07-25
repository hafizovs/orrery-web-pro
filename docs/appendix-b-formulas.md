# Appendix B — Formulas & Algorithms

Справочник формул. Реализации — в `domain/astronomy/*` согласно [04-physics-engine.md](04-physics-engine.md).

---

## B.1 Обозначения

| Symbol | Meaning | Unit |
|--------|---------|------|
| \(a\) | semi-major axis | AU (heliocentric) or km (Moon) |
| \(e\) | eccentricity | — |
| \(i\) | inclination | rad |
| \(\Omega\) | longitude of ascending node | rad |
| \(\omega\) | argument of periapsis | rad |
| \(M\) | mean anomaly | rad |
| \(E\) | eccentric anomaly | rad |
| \(\nu\) | true anomaly | rad |
| \(r\) | radial distance | same as \(a\) |
| \(P\) | orbital period | days |
| \(n\) | mean motion \(2\pi/P\) | rad/day |
| \(\mu\) | GM | km³/s² |
| \(t\) | simulation time from epoch | days |

---

## B.2 Mean anomaly

\[
M(t) = M_0 + \frac{2\pi}{P}\, t
\]

```
function meanAnomaly(M0, periodDays, tDays):
  n = 2 * PI / periodDays
  M = M0 + n * tDays
  return normalizeToTwoPi(M)
```

---

## B.3 Kepler equation & Newton–Raphson

\[
f(E) = E - e\sin E - M = 0
\]

\[
f'(E) = 1 - e\cos E
\]

\[
E_{n+1} = E_n - \frac{f(E_n)}{f'(E_n)} = E_n - \frac{E_n - e\sin E_n - M}{1 - e\cos E_n}
\]

```
function solveEccentricAnomaly(M, e, eps=1e-6, maxIter=50):
  M = normalizeToTwoPi(M)
  if e < 0.8:
    E = M
  else:
    E = PI

  for iter in 1..maxIter:
    f = E - e * sin(E) - M
    fp = 1 - e * cos(E)
    if abs(fp) < 1e-12:
      fp = 1e-12
    dE = f / fp
    E = E - dE
    if abs(dE) < eps:
      return E

  // comet fallback: try starts [M, PI, PI - e], pick min residual
  return bestE
```

**Точность:** \(|\Delta E| < 10^{-6}\).

Residual для тестов:

\[
R = |E - e\sin E - M|
\]

---

## B.4 True anomaly & radius

\[
\cos\nu = \frac{\cos E - e}{1 - e\cos E}
\]

\[
\sin\nu = \frac{\sqrt{1-e^2}\,\sin E}{1 - e\cos E}
\]

\[
\nu = \operatorname{atan2}(\sin\nu,\cos\nu)
\]

\[
r = a(1 - e\cos E)
\]

Эквивалентно полярное уравнение (для sampling орбиты без \(E\)):

\[
r(\nu) = \frac{a(1-e^2)}{1 + e\cos\nu}
\]

---

## B.5 Orbital plane coordinates

\[
x_{\text{orb}} = r\cos\nu,\quad y_{\text{orb}} = r\sin\nu,\quad z_{\text{orb}} = 0
\]

---

## B.6 Rotation to ecliptic

Пусть \(u = \omega + \nu\).

\[
\begin{align*}
x &= r(\cos\Omega\cos u - \sin\Omega\sin u\cos i) \\
y &= r(\sin\Omega\cos u + \cos\Omega\sin u\cos i) \\
z &= r(\sin u\sin i)
\end{align*}
\]

Scene projection (2D):

\[
x_s = x,\quad y_s = y - 0.15\, z
\]

(`ORBIT_Z_TILT = 0.15`)

---

## B.7 Vis-viva

\[
v = \sqrt{\mu\left(\frac{2}{r}-\frac{1}{a}\right)}
\]

Heliocentric: \(\mu = \texttt{SUN\_MU\_KM3\_S2}\), \(r,a\) в km.  
Moon: \(\mu = \texttt{EARTH\_MU\_KM3\_S2}\).

```
function computeSpeedKmPerS(mu, rKm, aKm):
  return sqrt(mu * (2 / rKm - 1 / aKm))
```

---

## B.8 Moon composition

```
earthPosAu = state[earth].positionAu
moonOffsetKm = keplerPositionKm(moon.elements, t)
moonOffsetAu = { x: moonOffsetKm.x / AU_KM, y: moonOffsetKm.y / AU_KM }
moonPosAu = earthPosAu + moonOffsetAu
```

---

## B.9 Orbit polyline sampling

```
function sampleOrbitPoints(elements, samples=180):
  pts = []
  for k in 0..samples-1:
    nu = 2*PI * k / samples
    r = a * (1 - e*e) / (1 + e * cos(nu))
    // rotate with Ω,i,ω using u = ω+nu
    // projectToScene
    pts.push(vec)
  return pts
```

Для Луны renderer добавляет `earthPosAu` к каждому семплу.

---

## B.10 Time mapping

| Preset | `timeScaleDaysPerSecond` |
|--------|--------------------------|
| hour | \(1/24\) |
| day | \(1\) |
| month | \(30\) |
| year | \(365.25\) |

```
daysDelta = realDtSeconds * timeScaleDaysPerSecond
simulationTimeDays += daysDelta
```

Log slider:

```
function sliderToScale(t01): // t in [0,1]
  return TIME_SCALE_MIN * (TIME_SCALE_MAX / TIME_SCALE_MIN) ** t01

function scaleToSlider(scale):
  return log(scale / TIME_SCALE_MIN) / log(TIME_SCALE_MAX / TIME_SCALE_MIN)
```

---

## B.11 Real vs Visual scale (summary)

**Real:**

\[
(x_{px}, y_{px}) = (x_{AU}, y_{AU})\cdot \texttt{REAL\_PX\_PER\_AU}\cdot zoom
\]

\[
R_{px} = \mathrm{clamp}(R_{km}\cdot \texttt{REAL\_RADIUS\_PX\_PER\_KM}\cdot zoom)
\]

**Visual:**

\[
r = \sqrt{x^2+y^2},\quad
R_{\text{orb}} = K\log_{10}(1 + r\cdot S)\cdot zoom
\]

\[
(x_{px},y_{px}) = (x,y)\cdot R_{\text{orb}} / r
\]

\[
R_{px} = \mathrm{clamp}\big((B + C\log_{10} R_{km})\sqrt{zoom}\big)
\]

Константы — в [05-canvas-renderer.md](05-canvas-renderer.md).

---

## B.12 Deterministic PRNG (asteroid belt)

```
function mulberry32(seed):
  return function():
    seed |= 0; seed = seed + 0x6D2B79F5 | 0
    t = Math.imul(seed ^ seed >>> 15, 1 | seed)
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
    return ((t ^ t >>> 14) >>> 0) / 4294967296
```

---

## B.13 Pick body

```
for body in visibleBodies:
  screen = worldToScreen(mapWorldAuToScenePx(state[body].positionAu))
  hitR = max(bodyRadiusPx(...), PICK_RADIUS_PX)
  if dist(mouse, screen) <= hitR: candidate
select nearest candidate
```

---

## B.14 Zoom-to-cursor

```
worldBefore = screenToWorld(mouse)
zoom = clamp(zoom * factor, ZOOM_MIN, ZOOM_MAX)
worldAfter = screenToWorld(mouse) // with new zoom
pan += (worldAfter - worldBefore) mapped to pan delta
```

Реализуй корректно под выбранную модель pan (screen-space pan в этом проекте).

---

## B.15 End-to-end frame

```
dt = clamp((now - last)/1000, 0, 0.05)
if playing: store.advance(dt)
if follow: camera.centerOn(state[focus].positionAu)
renderer.draw(snapshot)
```

---

## B.16 Критерий готовности Appendix B

Все формулы из B.2–B.7 реализованы в коде один-в-один; тесты проверяют residual Newton и finite Kepler positions.

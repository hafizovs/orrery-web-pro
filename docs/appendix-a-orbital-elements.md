# Appendix A — Orbital Elements & Physical Data

**Источник для data-файлов.** Вставляй значения в `*.data.ts` как числа. Углы в таблицах — в **градусах**; `body-catalog.ts` конвертирует в радианы.

Эпоха элементов: **J2000.0** (`epochJd = 2451545.0`), если не указано иное.  
Средние орбитальные элементы — достаточная точность для образовательного оррери (не OSPL/ephemeris DE440).

Константы:

| Symbol | Value | Unit |
|--------|-------|------|
| AU | 149597870.7 | km |
| Sun mass | 1.98847e30 | kg |
| Sun radius | 695700 | km |
| Earth μ | 398600.4418 | km³/s² |
| Sun μ | 1.32712440018e11 | km³/s² |

---

## A.1 Солнце

| Field | Value |
|-------|-------|
| id | `sun` |
| kind | `star` |
| nameKey | `body.sun` |
| parentId | `null` |
| radiusKm | 695700 |
| massKg | 1.98847e30 |
| color | `#ffd27a` |
| colorDark | `#ff8c1a` |
| hasRings | false |
| elements | `null` |
| sortOrder | 0 |

---

## A.2 Планеты (heliocentric, a в AU, period в днях)

Углы: `i`, `Ω` (long. ascending node), `ω` (argument periapsis), `M0` (mean anomaly at epoch) — градусы.

### Mercury
| Field | Value |
|-------|-------|
| id | `mercury` |
| a (AU) | 0.387098 |
| e | 0.205630 |
| i (deg) | 7.0049 |
| Ω (deg) | 48.3317 |
| ω (deg) | 29.1243 |
| M0 (deg) | 174.796 |
| periodDays | 87.969 |
| radiusKm | 2439.7 |
| massKg | 3.3011e23 |
| color | `#9e9e9e` |
| colorDark | `#5c5c5c` |
| hasRings | false |
| sortOrder | 10 |

### Venus
| Field | Value |
|-------|-------|
| id | `venus` |
| a | 0.723332 |
| e | 0.006772 |
| i | 3.3946 |
| Ω | 76.6807 |
| ω | 54.8523 |
| M0 | 50.115 |
| periodDays | 224.701 |
| radiusKm | 6051.8 |
| massKg | 4.8675e24 |
| color | `#e6c89a` |
| colorDark | `#b0894f` |
| hasRings | false |
| sortOrder | 20 |

### Earth
| Field | Value |
|-------|-------|
| id | `earth` |
| a | 1.000000 |
| e | 0.0167086 |
| i | 0.00005 |
| Ω | -11.2606 |
| ω | 114.2078 |
| M0 | 358.617 |
| periodDays | 365.256 |
| radiusKm | 6371.0 |
| massKg | 5.9722e24 |
| color | `#3d8bfd` |
| colorDark | `#1a4f8c` |
| hasRings | false |
| sortOrder | 30 |

### Mars
| Field | Value |
|-------|-------|
| id | `mars` |
| a | 1.523679 |
| e | 0.0934 |
| i | 1.850 |
| Ω | 49.558 |
| ω | 286.502 |
| M0 | 19.373 |
| periodDays | 686.980 |
| radiusKm | 3389.5 |
| massKg | 6.4171e23 |
| color | `#d9644a` |
| colorDark | `#7a2e1f` |
| hasRings | false |
| sortOrder | 40 |

### Jupiter
| Field | Value |
|-------|-------|
| id | `jupiter` |
| a | 5.2044 |
| e | 0.0489 |
| i | 1.303 |
| Ω | 100.464 |
| ω | 273.867 |
| M0 | 20.020 |
| periodDays | 4332.59 |
| radiusKm | 69911 |
| massKg | 1.8982e27 |
| color | `#d4b48c` |
| colorDark | `#8a6a3e` |
| hasRings | false |
| sortOrder | 50 |

### Saturn
| Field | Value |
|-------|-------|
| id | `saturn` |
| a | 9.5826 |
| e | 0.0565 |
| i | 2.485 |
| Ω | 113.665 |
| ω | 339.392 |
| M0 | 317.020 |
| periodDays | 10759.22 |
| radiusKm | 58232 |
| massKg | 5.6834e26 |
| color | `#f0d9a0` |
| colorDark | `#b8974e` |
| hasRings | **true** |
| sortOrder | 60 |

### Uranus
| Field | Value |
|-------|-------|
| id | `uranus` |
| a | 19.2184 |
| e | 0.0463 |
| i | 0.773 |
| Ω | 74.006 |
| ω | 96.998 |
| M0 | 142.238 |
| periodDays | 30688.5 |
| radiusKm | 25362 |
| massKg | 8.6810e25 |
| color | `#7fdbd0` |
| colorDark | `#2f7a72` |
| hasRings | false |
| sortOrder | 70 |

### Neptune
| Field | Value |
|-------|-------|
| id | `neptune` |
| a | 30.1104 |
| e | 0.0095 |
| i | 1.768 |
| Ω | 131.784 |
| ω | 273.187 |
| M0 | 256.228 |
| periodDays | 60182.0 |
| radiusKm | 24622 |
| massKg | 1.0241e26 |
| color | `#4166f5` |
| colorDark | `#1b2f8c` |
| hasRings | false |
| sortOrder | 80 |

Общие для планет: `kind: 'planet'`, `parentId: 'sun'`, `epochJd: 2451545.0`.

---

## A.3 Луна (geocentric)

**Важно:** `semiMajorAxis` в **километрах**, не AU.

| Field | Value |
|-------|-------|
| id | `moon` |
| kind | `moon` |
| parentId | `earth` |
| a (km) | 384399 |
| e | 0.0549 |
| i (deg) | 5.145 |
| Ω (deg) | 125.08 |
| ω (deg) | 318.15 |
| M0 (deg) | 135.27 |
| periodDays | 27.321661 |
| radiusKm | 1737.4 |
| massKg | 7.342e22 |
| color | `#cfd6df` |
| colorDark | `#6d7580` |
| hasRings | false |
| epochJd | 2451545.0 |
| sortOrder | 35 |
| nameKey | `body.moon` |

Примечание: лунные Ω/ω прецессируют быстро; для оррери фиксированные J2000-подобные значения допустимы.

---

## A.4 Карликовые планеты (heliocentric)

### Ceres
| Field | Value |
|-------|-------|
| id | `ceres` |
| kind | `dwarf-planet` |
| a | 2.769 |
| e | 0.0758 |
| i | 10.594 |
| Ω | 80.305 |
| ω | 73.597 |
| M0 | 77.372 |
| periodDays | 1683.15 |
| radiusKm | 473 |
| massKg | 9.3835e20 |
| color | `#b0b0b0` |
| colorDark | `#666666` |
| hasRings | false |
| sortOrder | 100 |

### Pluto
| Field | Value |
|-------|-------|
| id | `pluto` |
| kind | `dwarf-planet` |
| a | 39.482 |
| e | 0.2488 |
| i | 17.16 |
| Ω | 110.30 |
| ω | 113.76 |
| M0 | 14.86 |
| periodDays | 90560 |
| radiusKm | 1188.3 |
| massKg | 1.303e22 |
| color | `#d8c3a5` |
| colorDark | `#8a7355` |
| hasRings | false |
| sortOrder | 110 |

### Eris
| Field | Value |
|-------|-------|
| id | `eris` |
| kind | `dwarf-planet` |
| a | 67.864 |
| e | 0.4361 |
| i | 44.04 |
| Ω | 35.95 |
| ω | 151.64 |
| M0 | 204.16 |
| periodDays | 204199 |
| radiusKm | 1163 |
| massKg | 1.66e22 |
| color | `#e8e8f0` |
| colorDark | `#8a8a9a` |
| hasRings | false |
| sortOrder | 120 |

Все: `parentId: 'sun'`, `epochJd: 2451545.0`.

---

## A.5 Кометы (heliocentric, высокий e)

### 1P/Halley
| Field | Value |
|-------|-------|
| id | `halley` |
| kind | `comet` |
| a | 17.834 |
| e | 0.96714 |
| i | 162.26 |
| Ω | 58.42 |
| ω | 111.33 |
| M0 | 38.69 |
| periodDays | 27793.5 |
| radiusKm | 5.5 |
| massKg | 2.2e14 |
| color | `#9ec9ff` |
| colorDark | `#3a5f8c` |
| hasRings | false |
| sortOrder | 200 |

### 2P/Encke
| Field | Value |
|-------|-------|
| id | `encke` |
| kind | `comet` |
| a | 2.215 |
| e | 0.848 |
| i | 11.78 |
| Ω | 334.57 |
| ω | 186.55 |
| M0 | 0.0 |
| periodDays | 1203.0 |
| radiusKm | 2.4 |
| massKg | 1.0e13 |
| color | `#b7ffcf` |
| colorDark | `#3d7a55` |
| hasRings | false |
| sortOrder | 210 |

Все: `parentId: 'sun'`, `epochJd: 2451545.0`.  
Массы комет — порядковые оценки; для UI допустимы.

---

## A.6 Asteroid belt config

```ts
{
  innerAu: 2.1,
  outerAu: 3.3,
  count: 600,
  seed: 42,
  color: '#8b9099',
  alpha: 0.55
}
```

---

## A.7 TypeScript data shape (пример для генератора)

В `planets.data.ts` храни «сырые» градусы:

```ts
export interface RawOrbitalBody {
  id: BodyId;
  kind: BodyKind;
  nameKey: string;
  parentId: BodyId | null;
  radiusKm: number;
  massKg: number;
  color: string;
  colorDark: string;
  hasRings: boolean;
  sortOrder: number;
  elements: {
    semiMajorAxis: number; // AU or km
    eccentricity: number;
    inclinationDeg: number;
    longitudeAscendingNodeDeg: number;
    argumentPeriapsisDeg: number;
    meanAnomalyAtEpochDeg: number;
    periodDays: number;
    epochJd: number;
  } | null;
}
```

`body-catalog.ts` мапит `*Deg → radians` через `deg * Math.PI / 180`.

---

## A.8 Sanity checks после загрузки

1. Все `BodyId` из union присутствуют ровно один раз.
2. `0 ≤ e < 1` для всех эллиптических тел этого приложения.
3. `periodDays > 0`, `radiusKm > 0`, `massKg > 0`.
4. Saturn `hasRings === true`; остальные false.
5. Moon `parentId === 'earth'` и a > 300000 km.

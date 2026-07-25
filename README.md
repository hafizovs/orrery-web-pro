# Orrery Web Pro

Interactive Solar System simulator built with **Angular 22+** (standalone components, Signals, zoneless change detection, Canvas 2D).

Product docs live at [`../docs/`](../docs/).

## Install

```bash
cd orrery_web_pro_auto
npm install
```

Requires Node.js ≥ 22.14 and npm ≥ 10.

## Start

```bash
npm start
```

Then open the URL printed by the Angular CLI (usually `http://localhost:4200`).

## Test

```bash
npm test
# or unit-only:
npm run test:unit
```

## Hotkeys

| Key | Action |
|-----|--------|
| `Space` | Pause / Play |
| `+` / `=` | Increase time-scale preset |
| `-` | Decrease time-scale preset |
| `F` | Focus-follow selected body (Earth if none) |
| `Esc` | Disable focus-follow |
| `1` | Real scale |
| `2` | Visual scale |
| `L` | Toggle labels |
| `D` | Toggle dwarf planets |
| `C` | Toggle comets |
| `S` | Screenshot (PNG of canvas) |
| `T` | Toggle theme |
| `G` | Toggle language RU ↔ EN |

Hotkeys are ignored while typing in `input`, `textarea`, `select`, or `contenteditable` elements.

## UI shell

- Toolbar: brand, layer toggles, compare, screenshot, theme, language, mobile menu
- Canvas + sidebar (body list + detail card)
- Footer: time player (log slider + presets) and Real/Visual scale controls
- Real-scale emptiness banner
- Compare drawer (up to 3 bodies, live metrics)

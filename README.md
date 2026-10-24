## Live demo

https://hafizovs.github.io/orrery-web-pro/

# Orrery Web Pro

Interactive Solar System simulator built with **Angular 22+** (standalone components, Signals, zoneless change detection, Canvas 2D).

## About

Orrery Web Pro is an interactive Solar System simulator built with Angular 22+ standalone components, Signals, zoneless change detection, and Canvas 2D. The shell is a toolbar, a canvas with a body list and detail card, and a footer time player. You can follow a body, compare up to three, switch real versus visual scale, and export the canvas as PNG.

## Capabilities

- Pause/play and time-scale presets on a log slider
- Real scale and visual scale, with a banner when real scale leaves the view mostly empty
- Toggles for labels, dwarf planets, and comets
- Focus-follow for the selected body (Earth if none is selected)
- Compare drawer for up to three bodies with live metrics
- PNG screenshot, RU/EN language, and theme toggle

## Functionality

- Pause or play with `Space`, and raise or lower the time-scale preset with `+` / `=` and `-`
- Select a body, press `F` to follow it (Earth if none is selected), and `Esc` to stop following
- Switch real scale (`1`) or visual scale (`2`); toggle labels (`L`), dwarf planets (`D`), and comets (`C`)
- Open the compare drawer, save a PNG with `S`, and switch theme (`T`) or language (`G`)
- Hotkeys are ignored while typing in `input`, `textarea`, `select`, or `contenteditable` elements

## Install

```bash
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

## Build

```bash
npm run build
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

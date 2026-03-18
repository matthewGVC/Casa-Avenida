# Leaflet Neighborhood Map — Design Document

**Date:** 2026-03-18
**Status:** Approved

---

## Goal

Replace the decorative grid placeholder in `components/map/NeighborhoodMap.tsx` with a real interactive Leaflet map using Carto Dark Matter tiles and Casa Avenida brand colors.

---

## Architecture

### New files
- `components/map/LeafletMap.tsx` — the Leaflet map component (client-only, loaded via dynamic import)

### Modified files
- `components/map/NeighborhoodMap.tsx` — replace fake placeholder `lg:col-span-3` div with dynamic LeafletMap
- `styles/globals.css` — add Leaflet container overrides

### Package installs
```
npm install react-leaflet leaflet
npm install -D @types/leaflet
```

### SSR bypass
Leaflet uses browser APIs — must be loaded client-side only:
```tsx
const LeafletMap = dynamic(() => import('./LeafletMap'), { ssr: false })
```

---

## Tile Layer

**Carto Dark Matter** — free, no API key, no account required:
```
https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png
```
Attribution: `© OpenStreetMap contributors © CARTO`

---

## Map Configuration

- **Center:** `[26.4616, -80.0731]` (Casa Avenida)
- **Initial zoom:** 15
- **Zoom controls:** disabled (custom buttons not in scope — omit entirely for clean luxury feel)
- **Scroll wheel zoom:** disabled by default on desktop (prevents accidental zoom while page scrolling); enabled on map click
- **Attribution control:** disabled (branded attribution added as absolute-positioned text)
- **Container height:** `min-h-[360px] lg:min-h-[480px]`

---

## Markers

### Casa Avenida pin
Custom `L.divIcon` HTML:
```html
<div class="ca-pin-home">
  <div class="ca-pin-home__dot">A</div>
  <div class="ca-pin-home__tail"></div>
</div>
```
Styled in globals.css:
- 40×44px total (dot + tail)
- Dot: 40×40 sapling `#DFD1A7` circle, `font-display` "A" in lunar
- Outer glow: `box-shadow: 0 0 0 8px rgba(223,209,167,0.15)`
- Tail: downward triangle in sapling

### POI pins
Custom `L.divIcon` HTML:
```html
<div class="ca-pin-poi ca-pin-poi--{category}"></div>
```
- 12×12px circle
- Color per category (matches existing `CATEGORY_COLORS`):
  - restaurant → `#F59E0B` (amber-500)
  - hotel → `#006A8E` (bahama)
  - beach → `#38BDF8` (sky-400)
  - fitness → `#10B981` (emerald-500)
  - grocery → `#84CC16` (lime-500)
  - entertainment → `#DFD1A7` (sapling)
- Border: 2px `#373A36` (lunar) — makes pins pop against dark map
- Selected state: 18×18px, `box-shadow: 0 0 0 3px #DFD1A7`
- Hover: scale 1.3× via CSS transition

---

## Props Interface

```tsx
interface LeafletMapProps {
  pois: POI[];
  filtered: POI[];           // Already-filtered array from parent
  selectedPoi: POI | null;
  onSelectPoi: (poi: POI | null) => void;
}
```

Parent `NeighborhoodMap` already manages `filtered` and `selectedPoi` state — LeafletMap is purely presentational.

---

## Interaction

- **Click POI pin** → calls `onSelectPoi(poi)` (parent updates right panel)
- **Click Casa Avenida pin** → no action (it's the home pin, not a POI)
- **selectedPoi changes** → map pans to that POI's coordinates with `map.panTo([lat, lng], { animate: true, duration: 0.5 })`
- **Category filter** → parent re-passes `filtered` array; markers re-render

---

## CSS Overrides (globals.css)

```css
/* Leaflet map container */
.leaflet-container {
  background: var(--color-lunar);
  font-family: var(--font-body);
}

/* Remove default focus outline on tiles */
.leaflet-tile:focus { outline: none; }

/* Casa Avenida home pin */
.ca-pin-home { ... }
.ca-pin-home__dot { ... }
.ca-pin-home__tail { ... }

/* POI pins */
.ca-pin-poi { ... }
.ca-pin-poi--selected { ... }
/* Category color variants */
.ca-pin-poi--restaurant { background: #F59E0B; }
.ca-pin-poi--hotel      { background: #006A8E; }
.ca-pin-poi--beach      { background: #38BDF8; }
.ca-pin-poi--fitness    { background: #10B981; }
.ca-pin-poi--grocery    { background: #84CC16; }
.ca-pin-poi--entertainment { background: #DFD1A7; }
```

---

## What Does NOT Change

- Right-side POI list and detail panel — zero changes
- Category filter buttons — zero changes
- `selectedPoi` / `activeCategory` state in `NeighborhoodMap` — zero changes
- `neighborhood.json` — zero changes
- The neighborhood page layout — zero changes

---

## Out of Scope

- Leaflet zoom control buttons (omitted for clean look)
- Custom map cursor
- Clustering (only 12 POIs, no clustering needed)
- Google Maps migration path (handled separately when API key available)

# Leaflet Neighborhood Map Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the decorative grid placeholder in `components/map/NeighborhoodMap.tsx` with a real interactive Leaflet map using Carto Dark Matter tiles and Casa Avenida brand colors.

**Architecture:** Install `react-leaflet` + `leaflet`. Create a new `LeafletMap.tsx` client component loaded via `dynamic(() => import(...), { ssr: false })` since Leaflet requires browser APIs. The parent `NeighborhoodMap.tsx` passes its existing `filtered`, `selectedPoi`, and `onSelectPoi` state down as props — LeafletMap is purely presentational. Add Leaflet CSS overrides and custom marker CSS to `styles/globals.css`.

**Tech Stack:** Next.js 14 App Router, `react-leaflet` ^4, `leaflet` ^1.9, TypeScript strict, Tailwind CSS, CSS custom properties

---

## Task 1: Install packages

**Files:** none (package.json + node_modules)

**Step 1: Install runtime packages**

```bash
cd "C:\Users\Matthew Bloomdield\Desktop\Casa Avenida Website"
npm install react-leaflet leaflet
```

Expected output: `added N packages` with no peer dependency errors.

**Step 2: Install TypeScript types**

```bash
npm install -D @types/leaflet
```

Expected: `added 1 package`

**Step 3: Verify install**

```bash
npm ls react-leaflet leaflet @types/leaflet
```

Expected: three lines showing installed versions (react-leaflet ~4.x, leaflet ~1.9.x).

**Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install react-leaflet, leaflet, @types/leaflet"
```

---

## Task 2: Add Leaflet CSS overrides and custom marker styles to globals.css

**Files:**
- Modify: `styles/globals.css`

**Context:** Leaflet ships its own stylesheet that must be imported in the component (`import 'leaflet/dist/leaflet.css'`). It sets `background: #ddd` on the map container and adds a default attribution. We override that and add CSS for our custom `divIcon` markers. Add this block at the end of `styles/globals.css`, before the final empty line.

**Step 1: Add the CSS block**

Append to `styles/globals.css`:

```css
/* ─────────────────────────────────────────────
   Leaflet map overrides + Casa Avenida marker styles
───────────────────────────────────────────── */

/* Map container background — lunar instead of Leaflet default grey */
.leaflet-container {
  background: var(--color-lunar);
  font-family: var(--font-body);
}

/* Remove default tile focus ring */
.leaflet-tile:focus {
  outline: none;
}

/* Hide default Leaflet attribution (we add our own) */
.leaflet-control-attribution {
  display: none;
}

/* Casa Avenida home pin */
.ca-pin-home {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40px;
  height: 48px;
}

.ca-pin-home__dot {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-sapling);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 1rem;
  color: var(--color-lunar);
  box-shadow: 0 0 0 8px rgba(223, 209, 167, 0.15),
              0 4px 16px rgba(0, 0, 0, 0.4);
  flex-shrink: 0;
}

.ca-pin-home__tail {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 7px solid var(--color-sapling);
  margin-top: -1px;
}

/* POI pins — base */
.ca-pin-poi {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--color-lunar);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  cursor: pointer;
}

.ca-pin-poi:hover {
  transform: scale(1.4);
}

.ca-pin-poi--selected {
  width: 18px;
  height: 18px;
  border-color: var(--color-sapling);
  box-shadow: 0 0 0 3px rgba(223, 209, 167, 0.4);
  transform: scale(1.2);
}

/* POI category colors */
.ca-pin-poi--restaurant   { background: #F59E0B; }
.ca-pin-poi--hotel        { background: #006A8E; }
.ca-pin-poi--beach        { background: #38BDF8; }
.ca-pin-poi--fitness      { background: #10B981; }
.ca-pin-poi--grocery      { background: #84CC16; }
.ca-pin-poi--entertainment { background: #DFD1A7; }
```

**Step 2: Verify no build errors**

```bash
npm run build 2>&1 | tail -5
```

Expected: `✓ Generating static pages` — CSS-only change, no TS errors possible.

**Step 3: Commit**

```bash
git add styles/globals.css
git commit -m "style: add Leaflet container overrides and Casa Avenida marker CSS"
```

---

## Task 3: Create LeafletMap component

**Files:**
- Create: `components/map/LeafletMap.tsx`

**Context:** This is the actual Leaflet component. It MUST import `leaflet/dist/leaflet.css` at the top. It is always loaded via `dynamic()` with `ssr: false` from the parent — it will never run on the server. Uses `react-leaflet` hooks: `MapContainer`, `TileLayer`, `Marker`, `useMap`. Custom markers use `L.divIcon`.

The component receives:
- `pois: POI[]` — ALL pois (for Casa Avenida pin reference — actually not needed, just the filtered ones)
- `filtered: POI[]` — currently-visible POIs (after category filter)
- `selectedPoi: POI | null`
- `onSelectPoi: (poi: POI | null) => void`

**Step 1: Create the file**

```tsx
"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import type { POI } from "@/lib/types";

// ── Types ────────────────────────────────────────────────────────────────────

interface LeafletMapProps {
  filtered: POI[];
  selectedPoi: POI | null;
  onSelectPoi: (poi: POI | null) => void;
}

// ── Casa Avenida coordinates ─────────────────────────────────────────────────

const CASA_AVENIDA: [number, number] = [26.4616, -80.0731];

// ── Custom icons ─────────────────────────────────────────────────────────────

/** Home pin — sapling gold "A" circle with tail */
function createHomeIcon(): L.DivIcon {
  return L.divIcon({
    html: `<div class="ca-pin-home">
      <div class="ca-pin-home__dot">A</div>
      <div class="ca-pin-home__tail"></div>
    </div>`,
    className: "",          // clear Leaflet's default white box class
    iconSize: [40, 48],
    iconAnchor: [20, 48],   // anchor at bottom-center (tip of tail)
    popupAnchor: [0, -48],
  });
}

/** POI pin — colored circle, selected state via CSS class */
function createPoiIcon(category: string, isSelected: boolean): L.DivIcon {
  const cls = `ca-pin-poi ca-pin-poi--${category}${isSelected ? " ca-pin-poi--selected" : ""}`;
  const size = isSelected ? 18 : 12;
  return L.divIcon({
    html: `<div class="${cls}"></div>`,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

// ── Pan-to effect: re-centers map when selectedPoi changes ───────────────────

function MapPanner({ selectedPoi }: { selectedPoi: POI | null }) {
  const map = useMap();
  const prevId = useRef<string | null>(null);

  useEffect(() => {
    if (selectedPoi && selectedPoi.id !== prevId.current) {
      prevId.current = selectedPoi.id;
      map.panTo([selectedPoi.lat, selectedPoi.lng], { animate: true, duration: 0.5 });
    }
  }, [selectedPoi, map]);

  return null;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function LeafletMap({ filtered, selectedPoi, onSelectPoi }: LeafletMapProps) {
  const homeIcon = createHomeIcon();

  return (
    <MapContainer
      center={CASA_AVENIDA}
      zoom={15}
      scrollWheelZoom={false}
      zoomControl={false}
      attributionControl={false}
      className="w-full h-full min-h-[360px] lg:min-h-[480px]"
    >
      {/* Carto Dark Matter tiles — free, no API key */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        maxZoom={20}
        subdomains="abcd"
      />

      {/* Casa Avenida home pin — always shown */}
      <Marker position={CASA_AVENIDA} icon={homeIcon} />

      {/* POI pins — filtered by category */}
      {filtered.map((poi) => (
        <Marker
          key={poi.id}
          position={[poi.lat, poi.lng]}
          icon={createPoiIcon(poi.category, selectedPoi?.id === poi.id)}
          eventHandlers={{
            click: () => onSelectPoi(selectedPoi?.id === poi.id ? null : poi),
          }}
        />
      ))}

      {/* Pan map when selectedPoi changes */}
      <MapPanner selectedPoi={selectedPoi} />
    </MapContainer>
  );
}
```

**Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no output (zero errors).

**Step 3: Commit**

```bash
git add components/map/LeafletMap.tsx
git commit -m "feat: create LeafletMap component with Carto dark tiles and branded markers"
```

---

## Task 4: Wire LeafletMap into NeighborhoodMap

**Files:**
- Modify: `components/map/NeighborhoodMap.tsx`

**Context:** `NeighborhoodMap.tsx` currently renders a fake `lg:col-span-3` div with decorative grid lines. We replace that div entirely with the dynamic `LeafletMap` import. The right-side POI list (`lg:col-span-2`) stays untouched.

**Step 1: Read the current file**

Read `components/map/NeighborhoodMap.tsx` in full before editing.

**Step 2: Add dynamic import at top of file**

After the existing imports, add:
```tsx
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full min-h-[360px] lg:min-h-[480px] bg-lunar border border-white/10 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border border-sapling/30 flex items-center justify-center">
          <span className="font-display text-sapling text-sm">A</span>
        </div>
        <p className="font-heading text-white/20 text-[9px] tracking-widest">LOADING MAP…</p>
      </div>
    </div>
  ),
});
```

**Step 3: Replace the fake map div**

Find and remove the entire `{/* Static map placeholder */}` block (the `<div className="lg:col-span-3 relative min-h-[360px]...">`). Replace it with:

```tsx
{/* Interactive Leaflet map */}
<div className="lg:col-span-3 relative min-h-[360px] lg:min-h-[480px] border border-white/10 overflow-hidden">
  <LeafletMap
    filtered={filtered}
    selectedPoi={selectedPoi}
    onSelectPoi={setSelectedPoi}
  />

  {/* Branded attribution — bottom left */}
  <div className="absolute bottom-3 left-3 z-[400] pointer-events-none">
    <p className="font-heading text-sapling/40 text-[8px] tracking-heading">
      102 SE 5TH AVE · DELRAY BEACH
    </p>
  </div>
</div>
```

Note: Leaflet's z-index for tiles is ~200, controls ~1000. Attribution text at `z-[400]` sits above tiles but below controls.

**Step 4: Remove the old CSS custom property inline styles**

The old placeholder used `style={{ backgroundImage: "linear-gradient(...)" }}` for the grid effect. This is now gone. Remove any lingering inline style attributes from the replaced block.

**Step 5: TypeScript check**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no output.

**Step 6: Build check**

```bash
npm run build 2>&1 | tail -10
```

Expected: `✓ Generating static pages (25/25)` — zero errors, zero warnings.

**Step 7: Commit**

```bash
git add components/map/NeighborhoodMap.tsx
git commit -m "feat: wire LeafletMap into NeighborhoodMap, replace decorative placeholder"
```

---

## Task 5: Verify full build passes

**Step 1: Clean build**

```bash
npm run build 2>&1
```

Expected:
```
✓ Compiled successfully
✓ Generating static pages (25/25)
```

Zero TypeScript errors. Zero warnings.

**Step 2: Confirm `/neighborhood` page still static**

In the build output, confirm:
```
○ /neighborhood
```
The `○` symbol means statically prerendered — correct since the map loads client-side via dynamic import.

**Step 3: Final commit if any loose files**

```bash
git status
```

If clean: done. If any untracked changes: `git add -A && git commit -m "chore: leaflet map complete"`

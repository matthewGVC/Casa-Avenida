# Floorplans Page — Design Document
**Date:** 2026-03-16
**Status:** Approved

## Overview
A dedicated `/floorplans` page serving as the primary unit detail experience. Users select a unit (1–8) via pill tabs and see that unit's combined all-floors floorplan image large, with full specs and PDF downloads alongside. The page replaces the need for separate unit detail pages for the floorplan use case.

## Route
`/floorplans` — static page (SSG)

## Nav
Add `{ href: "/floorplans", label: "Floorplans" }` to `NAV_LINKS` in `Navbar.tsx` and `MobileNav` list, positioned after "Residences".

## Data Source
All data from `getUnits()` via `lib/content.ts`. No new JSON required. All 8 floorplan `.webp` images exist at `/images/floorplans/[n] FP Info Tab.webp`. PDFs at `/pdfs/floorplans/U[n] Floorplan Handout - Landscape Branded.pdf` and `U[n] All Floors.pdf`. Combined all-units PDF at `/pdfs/floorplans/Floorplans.pdf`.

## Page Structure

### 1. Page Header (Server, static)
- Eyebrow: `THE FLOORPLANS`
- H1 in font-display: `ALL RESIDENCES`
- Subtext: brief editorial line about 4-level townhomes
- Right-aligned: "Download All Floorplans" button → `/pdfs/floorplans/Floorplans.pdf`

### 2. Unit Selector (Client)
- Pills: `01 · 02 · 03 · 04 · 05 · 06 · 07 · 08`
- Each pill shows unit number + status badge color (gold border = available, muted = sold)
- Active pill: sapling bg, lunar text
- Switching: crossfade on the image panel (CSS opacity transition, 300ms)

### 3. Main Content — Two-Column (lg+), Stacked (mobile)

**LEFT — Floorplan Viewer (~60% width)**
- `react-zoom-pan-pinch` wrapper: scroll/pinch to zoom, drag to pan
- Reset zoom button (bottom-right of image)
- "Scroll or pinch to zoom" hint (top-left, fades out after 3s)
- Image: `[n] FP Info Tab.webp` via `encodeImagePath()`, `placeholder="empty"`, `bg-[#373A36]`

**RIGHT — Unit Info Panel (~40% width)**
- Unit name (font-heading, sapling)
- Status badge
- Specs grid: GSF · Under Air SF · Exterior SF · BR · BA · Levels
- Floor-by-floor summary (Ground → Second → Third → Fourth), each as a labeled row
- Finish packages: BRISA / NOIR pill badges
- CTA buttons:
  - Primary: "DOWNLOAD FLOORPLAN" → Handout PDF
  - Secondary: "ALL FLOORS PDF" → All Floors PDF
- Tertiary link: "EXPLORE THE GALLERY →" → `/gallery`

### 4. Mobile Layout
Selector → Image (full-width, aspect-[4/3]) → Info panel stacked vertically

## Components
- `app/floorplans/page.tsx` — Server Component, exports metadata
- `components/floorplans/FloorplansViewer.tsx` — Client Component (tab state + zoom)

## Animations
- Tab switch: CSS opacity crossfade on image (300ms)
- Info panel: Motion `AnimatePresence` + `initial={opacity:0,y:8}` → `animate={opacity:1,y:0}` on unit change
- ScrollFade on page header sections

## SEO
- Title: `Floorplans | Casa Avenida — Delray Beach`
- Description: mentions 4-level townhomes, 8 residences, SF range
- Canonical: `https://casaavenidadelray.com/floorplans`

## What's Excluded
- No "VIEW FULL RESIDENCE" link (this page is the detail view)
- No per-floor image switcher (assets don't exist; the combined `.webp` shows all floors)
- No building key plan (deferred, waiting on client SVG asset)

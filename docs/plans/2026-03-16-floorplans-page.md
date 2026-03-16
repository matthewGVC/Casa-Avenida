# Floorplans Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build `/floorplans` — a standalone page where users select Unit 1–8 via pill tabs to view that unit's combined all-floors floorplan image with zoom/pan, full specs, floor summaries, and PDF download buttons. Add "Floorplans" to the navbar.

**Architecture:** Two files: a Server Component page (`app/floorplans/page.tsx`) that loads all units from JSON and renders metadata + static header, and a Client Component viewer (`components/floorplans/FloorplansViewer.tsx`) that owns tab state, image crossfade, and zoom/pan via `react-zoom-pan-pinch`. Nav is updated by adding one entry to the `NAV_LINKS` array in `Navbar.tsx` — MobileNav inherits it automatically.

**Tech Stack:** Next.js 14 App Router, TypeScript strict, Tailwind CSS, Motion (`motion/react`), `react-zoom-pan-pinch`, brand tokens from `tailwind.config.ts`, `encodeImagePath()` from `lib/content.ts`.

---

### Task 1: Add "Floorplans" to the navbar

**Files:**
- Modify: `components/nav/Navbar.tsx` — add one entry to `NAV_LINKS`

**Step 1: Open `Navbar.tsx` and locate `NAV_LINKS`**

It currently reads:
```ts
const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/residences", label: "Residences" },
  { href: "/gallery", label: "Gallery" },
  ...
];
```

**Step 2: Add Floorplans after Residences**

```ts
const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/residences", label: "Residences" },
  { href: "/floorplans", label: "Floorplans" },
  { href: "/gallery", label: "Gallery" },
  { href: "/virtual-tour", label: "Virtual Tour" },
  { href: "/neighborhood", label: "Neighborhood" },
  { href: "/news", label: "News" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Contact" },
];
```

MobileNav receives `links` prop from Navbar — no changes needed there.

**Step 3: Verify build compiles**
```bash
npm run build
```
Expected: ✓ Compiled successfully. No errors, no warnings.

**Step 4: Commit**
```bash
git add components/nav/Navbar.tsx
git commit -m "feat: add Floorplans to navbar"
```

---

### Task 2: Create the FloorplansViewer client component

**Files:**
- Create: `components/floorplans/FloorplansViewer.tsx`

**Key facts:**
- All floorplan images: `/images/floorplans/[n] FP Info Tab.webp` (n = 1–8, with space before "FP")
- All handout PDFs: `/pdfs/floorplans/U[n] Floorplan Handout - Landscape Branded.pdf`
- All Floors PDFs: `/pdfs/floorplans/U[n] All Floors.pdf`
- Unit data shape (from `lib/types.ts`): `Unit` — has `id`, `name`, `status`, `gsf`, `underAirSF`, `exteriorSF`, `bedrooms`, `bathrooms`, `levels`, `floorSummaries`, `finishPackages`, `allFloorsImage`, `floorplanPdf`, `allFloorsPdf`
- `encodeImagePath(path: string): string` — imported from `@/lib/content`, must wrap all image src values from JSON
- Brand tokens in Tailwind: `text-sapling`, `bg-lunar`, `text-lunar`, `border-sapling`, `text-bahama`
- Font classes: `font-display`, `font-heading`, `font-body`, `font-ui`
- `react-zoom-pan-pinch` usage: `<TransformWrapper>` wraps `<TransformComponent>` + exposes `resetTransform` via render prop

**Step 1: Create `components/floorplans/FloorplansViewer.tsx`**

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import type { Unit } from "@/lib/types";
import Badge from "@/components/ui/Badge";
import { encodeImagePath } from "@/lib/content";

interface FloorplansViewerProps {
  units: Unit[];
}

const FLOOR_LABELS: Record<string, string> = {
  ground: "Ground",
  second: "Second",
  third: "Third",
  fourth: "Fourth",
};

export default function FloorplansViewer({ units }: FloorplansViewerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const unit = units[activeIndex];

  return (
    <div>
      {/* ── Unit selector ──────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-10">
        {units.map((u, i) => (
          <button
            key={u.id}
            onClick={() => setActiveIndex(i)}
            aria-pressed={i === activeIndex}
            className={[
              "relative font-heading text-xs tracking-heading px-5 py-2.5 border transition-all duration-200",
              i === activeIndex
                ? "border-sapling bg-sapling text-lunar"
                : "border-white/20 text-white/60 hover:border-white/50 hover:text-white",
            ].join(" ")}
          >
            {String(i + 1).padStart(2, "0")}
            {/* Status indicator dot */}
            <span
              className={[
                "absolute top-1 right-1 w-1.5 h-1.5 rounded-full",
                u.status === "available"
                  ? "bg-sapling"
                  : u.status === "under-contract"
                  ? "bg-bahama"
                  : "bg-white/30",
              ].join(" ")}
              aria-hidden="true"
            />
          </button>
        ))}
      </div>

      {/* ── Two-column layout ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 lg:gap-12 items-start">

        {/* LEFT — Floorplan image viewer */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={unit.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {unit.allFloorsImage ? (
                <TransformWrapper
                  initialScale={1}
                  minScale={0.5}
                  maxScale={4}
                  centerOnInit
                  wheel={{ step: 0.1 }}
                  pinch={{ step: 5 }}
                >
                  {({ resetTransform }) => (
                    <div
                      className="relative w-full overflow-hidden border border-white/10 bg-[#373A36]"
                      style={{ paddingBottom: "75%" }}
                    >
                      {/* Zoom hint */}
                      <span className="absolute top-3 left-3 z-10 font-body text-[10px] text-white/30 pointer-events-none select-none">
                        Scroll or pinch to zoom
                      </span>

                      <TransformComponent
                        wrapperStyle={{
                          width: "100%",
                          display: "block",
                          position: "absolute",
                          inset: 0,
                        }}
                        contentStyle={{ width: "100%", height: "100%" }}
                      >
                        <div className="relative w-full h-full">
                          <Image
                            src={encodeImagePath(unit.allFloorsImage)}
                            alt={`${unit.name} — All Floors Floorplan`}
                            fill
                            className="object-contain p-6"
                            placeholder="empty"
                            sizes="(max-width: 1024px) 100vw, 60vw"
                            priority={activeIndex === 0}
                          />
                        </div>
                      </TransformComponent>

                      {/* Reset zoom */}
                      <button
                        onClick={() => resetTransform()}
                        aria-label="Reset zoom"
                        className="absolute bottom-3 right-3 z-10 font-heading text-[9px] tracking-heading text-white/40 border border-white/15 hover:border-white/40 hover:text-white/70 px-3 py-1.5 transition-colors duration-200 bg-lunar/80 backdrop-blur-sm"
                      >
                        RESET ZOOM
                      </button>
                    </div>
                  )}
                </TransformWrapper>
              ) : (
                <div className="w-full aspect-[4/3] bg-[#373A36] border border-white/10 flex items-center justify-center">
                  <p className="font-heading text-white/20 text-xs tracking-heading">
                    FLOORPLAN COMING SOON
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT — Unit info panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={unit.id + "-info"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Unit name + status */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-heading text-sapling/60 text-[10px] tracking-heading mb-1">
                  RESIDENCE
                </p>
                <h2 className="font-display text-white text-[clamp(1.5rem,3vw,2.5rem)] leading-none">
                  {unit.name.toUpperCase()}
                </h2>
              </div>
              <Badge variant={unit.status} />
            </div>

            {/* Specs grid */}
            <div className="grid grid-cols-3 gap-px bg-white/10">
              {[
                { label: "TOTAL SF", value: unit.gsf.toLocaleString() },
                { label: "UNDER AIR", value: unit.underAirSF.toLocaleString() },
                { label: "EXTERIOR SF", value: unit.exteriorSF.toLocaleString() },
                { label: "BEDROOMS", value: unit.bedrooms },
                { label: "BATHROOMS", value: unit.bathrooms },
                { label: "LEVELS", value: unit.levels },
              ].map(({ label, value }) => (
                <div key={label} className="bg-lunar p-4">
                  <p className="font-heading text-white/30 text-[9px] tracking-heading mb-1">
                    {label}
                  </p>
                  <p className="font-body text-white text-base font-medium">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* Floor summaries */}
            {unit.floorSummaries && (
              <div className="space-y-3">
                <p className="font-heading text-white/30 text-[9px] tracking-heading">
                  FLOOR BY FLOOR
                </p>
                {(["ground", "second", "third", "fourth"] as const).map((floor) => {
                  const summary = unit.floorSummaries?.[floor];
                  if (!summary) return null;
                  return (
                    <div
                      key={floor}
                      className="flex items-baseline gap-3 border-b border-white/10 pb-3 last:border-0"
                    >
                      <span className="font-heading text-sapling/60 text-[10px] tracking-heading w-16 shrink-0">
                        {FLOOR_LABELS[floor].toUpperCase()}
                      </span>
                      <span className="font-body text-white/60 text-sm leading-snug">
                        {summary}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Finish packages */}
            {unit.finishPackages && unit.finishPackages.length > 0 && (
              <div>
                <p className="font-heading text-white/30 text-[9px] tracking-heading mb-2">
                  FINISH PACKAGES
                </p>
                <div className="flex gap-2">
                  {unit.finishPackages.map((pkg) => (
                    <span
                      key={pkg}
                      className="font-heading text-[10px] tracking-heading text-sapling border border-sapling/40 px-3 py-1"
                    >
                      {pkg.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Download CTAs */}
            <div className="flex flex-col gap-3">
              {unit.floorplanPdf && (
                <a
                  href={unit.floorplanPdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 font-heading text-xs tracking-heading text-lunar bg-sapling hover:bg-sapling/90 px-6 py-3.5 transition-colors duration-200"
                >
                  <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true">
                    <path d="M1 1H8L11 4V13H1V1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                    <path d="M8 1V4H11" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                    <path d="M3.5 7.5H8.5M6 5.5V9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  DOWNLOAD FLOORPLAN
                </a>
              )}
              {unit.allFloorsPdf && (
                <a
                  href={unit.allFloorsPdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 font-heading text-xs tracking-heading text-white border border-white/20 hover:border-white/50 px-6 py-3.5 transition-colors duration-200"
                >
                  ALL FLOORS PDF
                </a>
              )}
            </div>

            {/* Gallery link */}
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 font-heading text-xs tracking-heading text-sapling/70 hover:text-sapling border-b border-sapling/20 hover:border-sapling/60 pb-0.5 transition-colors duration-200"
            >
              EXPLORE THE GALLERY
              <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
```

**Step 2: Verify TypeScript compiles**
```bash
npm run build 2>&1 | grep -E "(error|Error|✓)"
```
Expected: `✓ Compiled successfully`

**Step 3: Commit**
```bash
git add components/floorplans/FloorplansViewer.tsx
git commit -m "feat: add FloorplansViewer client component"
```

---

### Task 3: Create the `/floorplans` page (Server Component)

**Files:**
- Create: `app/floorplans/page.tsx`

**Key facts:**
- `getUnits()` from `@/lib/content` returns `Unit[]` from `content/units.json`
- `ScrollFade` from `@/components/animations/ScrollFade` — wraps children in a fade-in-on-scroll animation
- All PDFs live in `public/pdfs/` — referenced as `/pdfs/...` in `href`
- The `Combined all-units PDF` is at `/pdfs/floorplans/Floorplans.pdf`
- Page must have unique `metadata` export and a server-rendered `<h1>`

**Step 1: Create `app/floorplans/page.tsx`**

```tsx
import type { Metadata } from "next";
import { getUnits } from "@/lib/content";
import FloorplansViewer from "@/components/floorplans/FloorplansViewer";
import ScrollFade from "@/components/animations/ScrollFade";

export const metadata: Metadata = {
  title: "Floorplans | Casa Avenida — Delray Beach",
  description:
    "Explore all eight floorplans at Casa Avenida — four-level luxury townhomes ranging from 3,000+ SF at 102 SE 5th Ave, Delray Beach. Download individual or combined PDF floorplans.",
  alternates: {
    canonical: "https://casaavenidadelray.com/floorplans",
  },
  openGraph: {
    title: "Floorplans | Casa Avenida",
    description:
      "Eight four-level luxury townhome floorplans. Private elevator, rooftop terrace, cocktail pool. Delray Beach, FL.",
  },
};

export default function FloorplansPage() {
  const units = getUnits();

  return (
    <>
      {/* Page header */}
      <section className="bg-lunar pt-32 pb-16 lg:pt-40 lg:pb-20 px-6 lg:px-12 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto">
          <ScrollFade>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
              <div>
                <p className="font-heading text-sapling/60 text-xs tracking-heading mb-4">
                  102 SE 5TH AVE · DELRAY BEACH
                </p>
                <h1 className="font-display text-white text-[clamp(2.5rem,6vw,5rem)] leading-none mb-4">
                  THE FLOORPLANS
                </h1>
                <p className="font-body text-white/50 text-sm lg:text-base max-w-lg leading-relaxed">
                  Eight four-level residences, each with private elevator, rooftop terrace, and
                  cocktail pool. Select a residence below to explore its layout.
                </p>
              </div>

              {/* Download all CTA */}
              <a
                href="/pdfs/floorplans/Floorplans.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-heading text-[10px] tracking-heading text-sapling border border-sapling/40 hover:border-sapling px-5 py-3 transition-colors duration-200 shrink-0 self-start sm:self-auto"
              >
                <svg width="11" height="13" viewBox="0 0 12 14" fill="none" aria-hidden="true">
                  <path d="M1 1H8L11 4V13H1V1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                  <path d="M8 1V4H11" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                  <path d="M3.5 7.5H8.5M6 5.5V9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                DOWNLOAD ALL FLOORPLANS
              </a>
            </div>
          </ScrollFade>
        </div>
      </section>

      {/* Viewer */}
      <section className="bg-lunar py-16 lg:py-24 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto">
          <FloorplansViewer units={units} />
        </div>
      </section>
    </>
  );
}
```

**Step 2: Run full build**
```bash
npm run build
```
Expected:
```
✓ Compiled successfully
Route (app)
...
├ ○ /floorplans
...
```
The route must appear as `○ (Static)`.

**Step 3: Commit**
```bash
git add app/floorplans/page.tsx
git commit -m "feat: add /floorplans page with unit selector and viewer"
```

---

### Task 4: Fix PDF paths in units.json

**Context:** The design doc references `unit.floorplanPdf` and `unit.allFloorsPdf`. These must point to the correct `/pdfs/floorplans/` paths (not `/images/floorplans/`).

**Files:**
- Verify/Modify: `content/units.json`

**Step 1: Check current `floorplanPdf` values in `units.json`**

Open `content/units.json` and check a sample unit. Expected correct values:
```json
"floorplanPdf": "/pdfs/floorplans/U1 Floorplan Handout - Landscape Branded.pdf",
"allFloorsPdf": "/pdfs/floorplans/U1 All Floors.pdf"
```

If values are pointing to `/images/floorplans/unit-1/...` instead, update all 8 units to use the `/pdfs/floorplans/` paths. The actual files confirmed in `/public/pdfs/floorplans/` are:
- `U1 Floorplan Handout - Landscape Branded.pdf` through `U8...`
- `U1 All Floors.pdf` through `U8 All Floors.pdf`
- `Floorplans.pdf` (all units combined)

**Step 2: Verify browser navigation works**

Run dev server: `npm run dev`
Navigate to `http://localhost:3000/floorplans`
- Tab 01 shows Unit One's floorplan image
- Download buttons open correct PDFs in new tab
- Switching tabs crossfades the image and updates the info panel

**Step 3: Commit (only if changes were needed)**
```bash
git add content/units.json
git commit -m "fix: correct PDF paths in units.json for floorplans page"
```

---

### Task 5: Final build verification and cleanup

**Step 1: Run full build**
```bash
npm run build 2>&1 | tail -30
```
Expected:
- `✓ Compiled successfully`
- `/floorplans` appears as `○ (Static)`
- Zero TypeScript errors
- Zero warnings

**Step 2: Verify nav item appears in desktop and mobile nav**
- Desktop: "Floorplans" link visible between "Residences" and "Gallery"
- Mobile: hamburger menu shows "FLOORPLANS" in staggered list

**Step 3: Final commit**
```bash
git add -A
git commit -m "feat: floorplans page complete — unit selector, zoom viewer, PDF downloads, nav link"
```

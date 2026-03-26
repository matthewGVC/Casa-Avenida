# Luxury UX Improvements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Raise CTA conversion rate and overall luxury feel through an inline inquiry modal, FloatingCTA refinements, gold atmospheric extension, and UI polish across 8 components.

**Architecture:** All changes are additive. The inquiry modal is a new client component (`InquiryModal`) that wraps the existing `InquiryForm` — no API route changes. CSS gold utilities extend the existing `globals.css` pattern. Everything else is small targeted edits to existing components.

**Tech Stack:** Next.js 14 App Router, Motion (`motion/react`), Tailwind CSS, CSS custom properties, TypeScript strict

---

## Task 1: InquiryModal component

Create a reusable modal that wraps the existing `InquiryForm`. Used by FloatingCTA, MobileInquireBar, and UnitCard "Inquire" button.

**Files:**
- Create: `components/contact/InquiryModal.tsx`

**Step 1: Write the component**

```tsx
"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import InquiryForm from "./InquiryForm";
import type { Unit } from "@/lib/types";

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  units: Unit[];
  defaultUnit?: string;
}

export default function InquiryModal({ isOpen, onClose, units, defaultUnit }: InquiryModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 32 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Inquire about a residence"
            className="fixed inset-x-4 bottom-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-[61] w-auto md:w-full md:max-w-xl bg-lunar border border-sapling/20 shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-white/10">
              <div>
                <p className="font-heading text-sapling text-[10px] tracking-[0.2em] mb-1">CASA AVENIDA</p>
                <h2 className="font-heading text-white text-sm tracking-heading">INQUIRE ABOUT A RESIDENCE</h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Close inquiry form"
                className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-sapling transition-colors duration-200"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Form — reuse existing InquiryForm */}
            <div className="px-8 py-8">
              <InquiryForm units={units} defaultUnit={defaultUnit} onSuccess={onClose} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

**Step 2: Note on InquiryForm — add `onSuccess` prop**

`InquiryForm` currently calls `router.push("/thank-you")` on success. When used inside the modal, we want it to instead call `onSuccess()` so the modal can close. This is addressed in Task 2.

**Step 3: Commit**

```bash
git add components/contact/InquiryModal.tsx
git commit -m "feat: add InquiryModal wrapping existing InquiryForm"
```

---

## Task 2: Update InquiryForm to accept optional `onSuccess` callback

**Files:**
- Modify: `components/contact/InquiryForm.tsx`

**Step 1: Add `onSuccess` to props interface**

In `InquiryForm`, add `onSuccess?: () => void` to the props interface and parameter destructuring:

```tsx
interface InquiryFormProps {
  units: Unit[];
  defaultUnit?: string;
  onSuccess?: () => void;   // ← add this
}

export default function InquiryForm({ units, defaultUnit = "", onSuccess }: InquiryFormProps) {
```

**Step 2: Call `onSuccess` instead of redirect when callback provided**

In the `handleSubmit` success branch, replace:
```tsx
sessionStorage.setItem("form_submitted", "1");
router.push("/thank-you");
```
With:
```tsx
sessionStorage.setItem("form_submitted", "1");
if (onSuccess) {
  onSuccess();
} else {
  router.push("/thank-you");
}
```

**Step 3: Add success state for modal usage**

When `onSuccess` is provided (modal context), instead of routing, show an inline thank-you state within the modal. Add a `"success"` variant to status:

```tsx
const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
```

In the success branch:
```tsx
if (onSuccess) {
  setStatus("success");
  setTimeout(onSuccess, 1800); // auto-close after showing "Thank you" for 1.8s
} else {
  sessionStorage.setItem("form_submitted", "1");
  router.push("/thank-you");
}
```

Add success state UI above the submit button section:
```tsx
{status === "success" && (
  <div className="py-10 text-center space-y-3">
    <div className="w-10 h-10 rounded-full border border-sapling/40 flex items-center justify-center mx-auto">
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
        <path d="M1 6l5 5L15 1" stroke="var(--color-sapling)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
    <p className="font-heading text-sapling text-xs tracking-heading">INQUIRY RECEIVED</p>
    <p className="font-body text-white/50 text-sm">Our team will be in touch shortly.</p>
  </div>
)}
```

Wrap the main form content in `{status !== "success" && ( ... )}`.

**Step 4: Commit**

```bash
git add components/contact/InquiryForm.tsx
git commit -m "feat: add onSuccess callback to InquiryForm for modal usage"
```

---

## Task 3: Wire FloatingCTA to open modal instead of navigate

FloatingCTA needs access to `units` data and modal state. It currently lives in `app/layout.tsx` — but `units` data is server-only JSON. Best approach: create a `FloatingCTAWrapper` client component that fetches units client-side, or pass units from the home page. Since FloatingCTA is home-page-only per PRD, we'll make it a prop-driven client component that receives units.

**Files:**
- Modify: `components/layout/FloatingCTA.tsx`
- Modify: `app/page.tsx` (home page — add FloatingCTA with units prop)
- Modify: `app/layout.tsx` (remove FloatingCTA from global layout if present)

**Step 1: Rewrite FloatingCTA to embed modal**

```tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import InquiryModal from "@/components/contact/InquiryModal";
import type { Unit } from "@/lib/types";

interface FloatingCTAProps {
  units: Unit[];
}

export default function FloatingCTA({ units }: FloatingCTAProps) {
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      // Show after 30%, hide after 90%
      setVisible(pct > 0.3 && pct < 0.9);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  return (
    <>
      <div
        className={`
          fixed bottom-8 left-1/2 -translate-x-1/2 z-40
          transition-all duration-500
          ${visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"}
        `}
        aria-hidden={!visible}
      >
        <button
          onClick={openModal}
          tabIndex={visible ? 0 : -1}
          className="btn-sweep flex items-center gap-3 font-heading text-xs tracking-nav px-7 py-3.5 border border-sapling text-sapling hover:text-lunar transition-colors duration-300 shadow-lg backdrop-blur-sm bg-lunar/60"
        >
          INQUIRE ABOUT A RESIDENCE
          <span aria-hidden="true" className="text-sapling/60">→</span>
        </button>
      </div>

      <InquiryModal
        isOpen={modalOpen}
        onClose={closeModal}
        units={units}
      />
    </>
  );
}
```

**Step 2: Check layout.tsx — FloatingCTA placement**

Open `app/layout.tsx`. If FloatingCTA is rendered there globally, it must be moved to `app/page.tsx` (home page only) since it now requires units data. Remove it from layout.tsx.

**Step 3: Add FloatingCTA to home page with units**

In `app/page.tsx`, import units from content loader and pass to FloatingCTA:

```tsx
import { getUnits } from "@/lib/content";
import FloatingCTA from "@/components/layout/FloatingCTA";

// Inside the page component (Server Component):
const units = await getUnits();

// In JSX, after hero section:
<FloatingCTA units={units} />
```

**Step 4: Commit**

```bash
git add components/layout/FloatingCTA.tsx app/page.tsx app/layout.tsx
git commit -m "feat: FloatingCTA opens inquiry modal, hides at 90% scroll"
```

---

## Task 4: Wire MobileInquireBar to open modal

Same pattern as FloatingCTA. MobileInquireBar is in `layout.tsx` globally — it needs units data. Best approach: make it a client component with a local modal and client-side units fetch via a tiny `/api/units` route, OR include it in `app/layout.tsx` as a server-fetched prop. Since layout.tsx can be async in Next.js App Router, we'll pass units to MobileInquireBar from layout.

**Files:**
- Modify: `components/layout/MobileInquireBar.tsx`
- Modify: `app/layout.tsx`

**Step 1: Rewrite MobileInquireBar**

```tsx
"use client";

import { useState, useCallback } from "react";
import InquiryModal from "@/components/contact/InquiryModal";
import type { Unit } from "@/lib/types";

interface MobileInquireBarProps {
  units: Unit[];
}

export default function MobileInquireBar({ units }: MobileInquireBarProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  return (
    <>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 safe-area-bottom">
        <button
          onClick={openModal}
          className="flex items-center justify-center w-full h-11 bg-sapling text-lunar font-heading text-xs tracking-nav hover:bg-sapling/90 transition-colors duration-200"
          aria-label="Inquire about a residence"
        >
          INQUIRE ABOUT A RESIDENCE
        </button>
      </div>

      <InquiryModal
        isOpen={modalOpen}
        onClose={closeModal}
        units={units}
      />
    </>
  );
}
```

**Step 2: Pass units from layout.tsx**

In `app/layout.tsx`, make the root layout async and pass units:

```tsx
import { getUnits } from "@/lib/content";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const units = await getUnits();
  // ...
  return (
    <html>
      <body>
        <Navbar />
        {children}
        <Footer />
        <MobileInquireBar units={units} />
        <GrainOverlay />
        <CookieBanner />
      </body>
    </html>
  );
}
```

**Step 3: Commit**

```bash
git add components/layout/MobileInquireBar.tsx app/layout.tsx
git commit -m "feat: MobileInquireBar opens inquiry modal instead of navigating"
```

---

## Task 5: Add "Inquire" button to UnitCard

Each unit card gets a secondary "INQUIRE →" button that opens modal with that unit pre-selected.

**Files:**
- Modify: `components/units/UnitCard.tsx`

**Note:** UnitCard currently renders as a `<Link>` wrapper — the whole card is a link to `/floorplans?unit=X`. We need to convert it to a `<div>` with the link on a button, and add a separate inquire button. This means splitting the card into two actions.

**Step 1: Convert UnitCard to use separate action buttons**

The card image + name area still links to floorplans. The inquire button opens modal. We need to pass units array down — but UnitCard is a Server Component used in UnitGrid. We'll add an `onInquire` prop pattern OR use a client wrapper.

Simplest approach: keep UnitCard as a server component (Link wrapper), add a small separate `UnitCardInquire` client component that renders the inquire button and its own modal instance.

Create `components/units/UnitCardInquireButton.tsx`:

```tsx
"use client";

import { useState, useCallback } from "react";
import InquiryModal from "@/components/contact/InquiryModal";
import type { Unit } from "@/lib/types";

interface UnitCardInquireButtonProps {
  unit: Unit;
  allUnits: Unit[];
}

export default function UnitCardInquireButton({ unit, allUnits }: UnitCardInquireButtonProps) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true); }}
        className="btn-sweep font-heading text-[10px] tracking-heading px-4 py-2 border border-sapling/40 text-sapling/60 hover:text-lunar hover:border-sapling transition-colors duration-300"
        aria-label={`Inquire about ${unit.name}`}
      >
        INQUIRE →
      </button>

      <InquiryModal
        isOpen={open}
        onClose={close}
        units={allUnits}
        defaultUnit={unit.id}
      />
    </>
  );
}
```

**Step 2: Add `UnitCardInquireButton` to UnitCard**

In `UnitCard.tsx`, import and render the button at the bottom of the info div, after the specs row:

```tsx
import UnitCardInquireButton from "./UnitCardInquireButton";

// UnitCard receives allUnits prop
interface UnitCardProps {
  unit: Unit;
  allUnits: Unit[];   // ← add
  delay?: number;
}

// In the info div, after specs:
<div className="flex items-center justify-between border-t border-white/10 pt-4 mt-4">
  <span className="font-heading text-sapling text-[10px] tracking-heading">VIEW FLOORPLAN →</span>
  <UnitCardInquireButton unit={unit} allUnits={allUnits} />
</div>
```

**Step 3: Update UnitGrid to pass `allUnits` to each UnitCard**

In `components/units/UnitGrid.tsx`, pass `allUnits={units}` to each UnitCard.

**Step 4: Update home page ResidenceTeaser similarly if it uses its own card pattern**

Check `components/home/ResidenceTeaser.tsx` — if it renders its own card, add the same button pattern.

**Step 5: Commit**

```bash
git add components/units/UnitCardInquireButton.tsx components/units/UnitCard.tsx components/units/UnitGrid.tsx
git commit -m "feat: unit cards have inline Inquire button opening pre-filled modal"
```

---

## Task 6: Nav letter-spacing hover transition

**Files:**
- Modify: `components/nav/Navbar.tsx`

**Step 1: Add `transition-[letter-spacing]` to nav links**

The nav link className currently has `transition-all duration-200`. `transition-all` covers letter-spacing but can be janky with many properties. Make it explicit:

In `Navbar.tsx`, find the Link className on desktop nav links and ensure it includes `transition-all duration-300` (bump from 200 to 300ms for a smoother luxury feel). `tracking-nav` → `hover:tracking-nav-hover` is already present. No other change needed.

Verify `tailwind.config.ts` has:
```js
tracking: {
  nav: "0.1em",
  "nav-hover": "0.15em",
  heading: "0.075em",
}
```

If `nav-hover` isn't in the config, add it. Check and add if missing.

**Step 2: Commit**

```bash
git add components/nav/Navbar.tsx tailwind.config.ts
git commit -m "polish: nav link letter-spacing transition smoothed to 300ms"
```

---

## Task 7: Unit card hover glow

**Files:**
- Modify: `components/units/UnitCard.tsx`

**Step 1: Add ambient glow on hover**

Change the card's outer element className. Currently:
```
bg-lunar border border-white/10 hover:border-sapling/40 transition-colors duration-300
```

Update to:
```
bg-lunar border border-white/10 hover:border-sapling/30 transition-all duration-500
hover:[box-shadow:0_0_0_1px_rgba(223,209,167,0.08),0_8px_32px_rgba(223,209,167,0.06)]
```

Since Tailwind doesn't support arbitrary box-shadow hover by default, add this to globals.css:

```css
/* Unit card luxury hover glow */
.unit-card-hover {
  transition: border-color 0.5s ease, box-shadow 0.5s ease;
}
.unit-card-hover:hover {
  border-color: rgba(223, 209, 167, 0.3);
  box-shadow: 0 0 0 1px rgba(223, 209, 167, 0.08), 0 8px 32px rgba(223, 209, 167, 0.06);
}
```

Apply `unit-card-hover` class to the card's outer element.

**Step 2: Commit**

```bash
git add components/units/UnitCard.tsx styles/globals.css
git commit -m "polish: unit cards have ambient gold glow on hover"
```

---

## Task 8: Stats strip gold atmosphere + marquee gold edge

**Files:**
- Modify: `components/home/StatsStrip.tsx`
- Modify: `components/home/MarqueeStrip.tsx` (check filename)

**Step 1: Apply `bg-lunar-warm` to StatsStrip**

In `StatsStrip.tsx`, add `bg-lunar-warm gold-edge-top` to the section className. These classes already exist in globals.css.

**Step 2: Apply `gold-edge-top` to MarqueeStrip**

Find the marquee component file. Add `gold-edge-top` to its section wrapper — ensuring it has `position: relative` (the class adds a `::before` pseudo-element).

**Step 3: Commit**

```bash
git add components/home/StatsStrip.tsx components/home/MarqueeStrip.tsx
git commit -m "polish: stats strip and marquee get gold atmospheric edges"
```

---

## Task 9: Footer gold rule

**Files:**
- Modify: `components/layout/Footer.tsx`

**Step 1: Replace footer top border with gold rule**

Change:
```tsx
<footer className="bg-lunar border-t border-white/10 pt-16 pb-8 px-6 lg:px-12">
```
To:
```tsx
<footer className="bg-lunar pt-16 pb-8 px-6 lg:px-12">
```

And add a `<hr className="gold-rule" />` as the first child inside the footer, before the `<div className="max-w-[1440px]...">`.

Actually, cleaner: use `border-t` with sapling color rather than a separate element:
```tsx
<footer className="bg-lunar border-t border-sapling/20 pt-16 pb-8 px-6 lg:px-12">
```

**Step 2: Commit**

```bash
git add components/layout/Footer.tsx
git commit -m "polish: footer top border now uses sapling/gold tone"
```

---

## Task 10: Floorplan viewer hint + reset button polish

**Files:**
- Modify: `components/floorplans/FloorplansViewer.tsx`

**Step 1: Restyle hint text**

Find the `[CLICK TO ZOOM]` or similar hint text. Change to:
```tsx
<p className="font-heading text-[9px] tracking-[0.25em] text-sapling/35 select-none">
  PINCH OR SCROLL TO ZOOM · DRAG TO PAN
</p>
```

**Step 2: Restyle reset button**

Find the reset/zoom-out button. Restyle to match gold palette:
```tsx
<button
  onClick={resetTransform}
  className="font-heading text-[9px] tracking-widest text-sapling/50 hover:text-sapling border border-sapling/20 hover:border-sapling/40 px-3 py-1.5 transition-colors duration-200"
  aria-label="Reset zoom"
>
  RESET VIEW
</button>
```

**Step 3: Commit**

```bash
git add components/floorplans/FloorplansViewer.tsx
git commit -m "polish: floorplan viewer hint and reset button styled to gold palette"
```

---

## Task 11: Build verification

**Step 1: Run build**

```bash
cd "C:\Users\Matthew Bloomdield\Desktop\Casa Avenida Website"
npm run build
```

Expected: zero errors, zero warnings.

**Step 2: Fix any TypeScript errors**

Common issues to watch:
- `onSuccess` prop optional type matching in InquiryForm
- `allUnits` prop threading through UnitGrid → UnitCard
- `units` prop required in FloatingCTA and MobileInquireBar — ensure callers pass it

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat: luxury UX improvements — inquiry modal, gold atmosphere, CTA polish"
```

---

## Implementation Order

Execute tasks in this order (dependencies respected):

1. Task 2 — InquiryForm `onSuccess` prop (modal depends on it)
2. Task 1 — InquiryModal component (FloatingCTA/Mobile depend on it)
3. Task 3 — FloatingCTA modal wiring
4. Task 4 — MobileInquireBar modal wiring
5. Task 5 — UnitCard inquire button
6. Task 6 — Nav letter-spacing
7. Task 7 — Unit card hover glow
8. Task 8 — Stats strip + marquee gold edges
9. Task 9 — Footer gold rule
10. Task 10 — Floorplan viewer polish
11. Task 11 — Build verification

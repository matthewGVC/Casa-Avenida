# Casa Avenida — Product Requirements Document v2.1
## Complete Build Brief for Claude Code

**Project:** Casa Avenida luxury real estate website
**Address:** 102 SE 5th Ave, Delray Beach, FL 33483
**Units:** 8 boutique townhome residences
**Price:** From the low $3M
**Completion:** Q2 2027
**Sales:** TJ Verdiglione & Nicole Melveney, Douglas Elliman
**Developers:** Kastelo & 4TRO
**Architecture:** RWB-Linares Architecture
**Interiors:** Stef Leonel Interior Design, Ava Gray Interiors

**Domain:** casaavenidadelray.com
**Status:** Pre-construction marketing

---

## Part 1: Tech Stack & Architecture

### Core Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Next.js 14, App Router, TypeScript | SSR/SSG for SEO, Server Components by default |
| Hosting | Vercel | Zero-config deploy, edge functions, image CDN |
| Styling | Tailwind CSS + CSS custom properties | Brand tokens as CSS vars, Tailwind for layout |
| Animation | Motion (`motion/react`) + CSS + native TS | No GSAP — MIT license, 2.5x faster than GSAP, tree-shakable |
| Images | `/public/images/` → Next.js `<Image>` | WebP, blur placeholder, Next.js CDN optimization |
| Content | JSON flat files in `/content/` | No database, no CMS subscription required |
| Forms | Resend API via `/api/contact` route | Server-side only, key in Vercel env vars |
| Lead logging | Google Sheets webhook | Free, permanent lead record, no CRM required |
| Maps | Google Maps JavaScript API | Custom styled, API key domain-restricted |
| Email subs | MailerLite API | Already connected, auto-adds to configured group |
| Analytics | Vercel Analytics | Built-in, no additional setup |
| Font loading | `next/font/google` | Zero layout shift for Raleway + Afacad Flux |

### Animation Library Rationale

**Motion (formerly Framer Motion) + CSS + native TypeScript. No GSAP.**

- GSAP is owned by Webflow. Its license prohibits use in tools competing with Webflow and can be terminated at Webflow's discretion — unacceptable risk for a client project
- Motion is MIT licensed, irrevocable, fully tree-shakable
- Motion benchmarks 2.5x faster than GSAP on value animations, better INP scores
- Pure CSS handles: hero crossfade, Ken Burns, grain overlay, marquee, nav transition, button sweeps
- Native TS (~15 lines each) handles: magnetic buttons, counter animation, scroll detection
- Motion handles: page transitions, stagger animations, scroll-fade-ins, gallery layout reflow, lightbox

---

## Part 2: Brand System

### Color Tokens

```css
--color-lunar:   #373A36;   /* Primary dark background */
--color-saddle:  #4F2C1D;   /* Deep warm brown accent */
--color-bahama:  #006A8E;   /* Bahama blue accent */
--color-sapling: #DFD1A7;   /* Primary gold */
--color-white:   #FFFFFF;
```

### Typography

| Role | Font | Treatment | Loading |
|---|---|---|---|
| Display / Hero | Quake Regular | ALL CAPS, `letter-spacing: 0` | Local WOFF2: `/public/fonts/Quake.woff2` |
| Heading | Raleway Light | ALL CAPS, `letter-spacing: 0.075em` | `next/font/google` |
| Body | Afacad Flux | Sentence case, variable weight | `next/font/google` |
| UI / Labels | Helvetica Neue | Sentence case | System font stack |

> ⚠️ **Quake font:** Confirm `Quake.woff2` exists in `/public/fonts/` before using it. If missing, substitute `Cormorant Garamond` as display font. Do not block build on this.

### Logo Variants

Three versions in `/public/images/logos/`:
- `logo-gold.svg` — Sapling gold on dark (primary)
- `logo-white.svg` — White on dark
- `logo-dark.svg` — Dark on light

---

## Part 3: File Structure

```
casa-avenida/
├── app/
│   ├── page.tsx                         ← Home
│   ├── residences/
│   │   ├── page.tsx                     ← Grid + building key plan
│   │   ├── unit-[id]/page.tsx           ← Unit detail (tabbed)
│   │   └── finishes/page.tsx            ← Standalone finishes page
│   ├── gallery/page.tsx
│   ├── virtual-tour/page.tsx
│   ├── neighborhood/page.tsx
│   ├── news/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── team/page.tsx
│   ├── contact/page.tsx
│   ├── thank-you/page.tsx
│   ├── legal/
│   │   ├── privacy-policy/page.tsx
│   │   └── disclaimer/page.tsx
│   ├── not-found.tsx
│   ├── error.tsx
│   ├── layout.tsx                       ← Root: Nav, Footer, CookieBanner, fonts
│   └── api/
│       ├── contact/route.ts             ← Form handler
│       └── subscribe/route.ts           ← MailerLite handler
├── components/
│   ├── nav/                             ← Navbar, MobileNav, NavLink
│   ├── hero/                            ← HeroCarousel, HeroText, GrainOverlay
│   ├── home/                            ← VisionSection, CredibilityStrip, StatsStrip,
│   │                                       AmenitiesSection, ResidenceTeaser,
│   │                                       ArchitectureFeature, ConstructionTimeline,
│   │                                       GalleryTeaser, NeighborhoodTeaser, InquiryCTA
│   ├── units/                           ← UnitCard, UnitGrid, BuildingKeyPlan,
│   │                                       FloorplanViewer, FinishesToggle
│   ├── gallery/                         ← MasonryGrid, Lightbox, CategoryFilter
│   ├── contact/                         ← InquiryForm, AgentCard
│   ├── news/                            ← ArticleCard, ArticleGrid, SubscribeForm
│   ├── map/                             ← NeighborhoodMap, MapPin, PinSidePanel
│   ├── animations/                      ← ScrollFade, Counter, Marquee, MagneticButton
│   ├── ui/                              ← Button, Badge, Tab, Modal, ImagePlaceholder
│   └── layout/                          ← Footer, CookieBanner, FloatingCTA (home only),
│                                           BackToTop, MobileInquireBar
├── content/
│   ├── units.json
│   ├── gallery.json
│   ├── news.json
│   ├── team.json
│   ├── settings.json
│   ├── neighborhood.json
│   ├── finishes.json
│   └── images.json
├── content/articles/                    ← MDX files: [slug].mdx
├── lib/
│   ├── types.ts                         ← All TypeScript interfaces
│   ├── content.ts                       ← JSON loader utilities
│   ├── maps.ts                          ← Google Maps helpers
│   └── mailerlite.ts                    ← MailerLite API wrapper
├── public/
│   ├── fonts/Quake.woff2
│   ├── images/                          ← See Part 5: Image Protocol
│   └── pdfs/
├── styles/globals.css
├── middleware.ts                         ← Rate limiting, security headers
├── next.config.js
├── CLAUDE.md                            ← AI context file
└── README.md
```

---

## Part 4: Navigation & Global UI

### Primary Navigation (8 items)

`Home · Residences · Gallery · Virtual Tour · Neighborhood · News · Team · Contact`

Note: "About" content is embedded in the Home page Vision section and Team page. No standalone About nav item.

### Desktop Nav Behavior

- Transparent over hero → solid `--color-lunar` background on scroll past hero height
- Active page: thin `--color-sapling` underline
- All nav labels: Raleway Light, ALL CAPS, `letter-spacing: 0.1em`
- Hover: letter-spacing expands from 0.1em → 0.15em via CSS transition
- Right side: "INQUIRE" pill button (gold border, transparent bg, gold text → fills gold on hover)

### Mobile Nav

- Hamburger icon → animated transition to × on open
- Full-screen overlay: `--color-lunar` background
- Logo centered top
- Links in Raleway, ALL CAPS, large — stagger animate in with Motion
- Close: × button top-right or tap outside

### Global Components

**Footer:** Logo, address (`102 SE 5th Ave, Delray Beach, FL 33483`), agent names + click-to-call `tel:` + `mailto:` links (no WhatsApp), nav links, social links (GVC team socials — placeholder `""` until URLs supplied), Douglas Elliman disclaimer (full text, small Afacad Flux), copyright.

**Back-to-top button:** Gold "A" monogram with upward arrow. Appears after 50% scroll on all pages. Smooth scroll to top.

**Cookie banner:** First visit only. Bottom of screen. `--color-lunar` bg. Functional cookies always on, analytics opt-in. Dismiss saves to localStorage. Minimal — 1 line of text + Accept/Decline.

**Mobile Inquire bar:** On mobile only. Thin gold bar pinned at bottom (above safe area). Text: "INQUIRE" centered in Raleway. Taps open the inquiry modal. Appears on all pages.

**FloatingCTA (home page only):** After user scrolls 30% of home page, a pill appears centered at bottom: "INQUIRE ABOUT A RESIDENCE →". Fades in. Not shown on other pages.

**ImagePlaceholder:** Used anywhere an image may be missing. `background: var(--color-lunar)`, centered Sapling "A" in Raleway.

---

## Part 5: Image Protocol

### ⚠️ Critical Build Order

1. Scaffold the entire `/public/images/` folder structure with empty `.gitkeep` files first
2. Real images are dropped in by hand before visual components are built
3. All image components must render `<ImagePlaceholder>` gracefully if source is missing
4. Never block build or throw errors on missing images

### Folder Structure

```
/public/images/
  hero/                   hero-01.jpg … hero-08.jpg
  gallery/                descriptive names: kitchen-angle-1.jpg, pool-angle-1.jpg
  units/
    unit-1/ … unit-8/     unit-specific renders
  floorplans/
    unit-1/ … unit-8/     ground.jpg, second.jpg, third.jpg, fourth.jpg
                          (unit-5 also: ground-alt.jpg for Alt.2 variant)
  finishes/
    brisa/                swatch + render images
    noir/                 swatch + render images
  team/                   tj.jpg, nicole.jpg
  logos/                  logo-gold.svg, logo-white.svg, logo-dark.svg
  neighborhood/           static-map-fallback.jpg
  og-default.jpg          ← OpenGraph fallback image

/public/pdfs/
  floorplans/             Unit_1_Floorplan.pdf … Unit_8_Floorplan.pdf
  finishes/               Brisa_Finishes.pdf, Noir_Finishes.pdf

/public/fonts/
  Quake.woff2             ← Check existence before using
```

### Performance Requirements

- Hero images: ≤200KB each, WebP format
- `<Image priority={true}>` on first hero image only
- All other images: `placeholder="blur"` + `blurDataURL` generated at build time
- Max gallery images: ≤500KB each before optimization
- Central manifest in `content/images.json` — one path update updates all instances

---

## Part 6: Content JSON Schemas

### `content/units.json` — Array of Unit objects

```typescript
interface Unit {
  id: string;                    // "unit-1" through "unit-8"
  name: string;                  // "Unit One"
  tagline: string;               // "Corner residence with pool garden and rooftop terrace"
  gsf: number;                   // Total gross SF
  underAirSF: number;
  exteriorSF: number;
  bedrooms: number;
  bathrooms: number;
  levels: number;                // 4
  status: "available" | "under-contract" | "sold";
  priceDisplay: "INQUIRE FOR PRICING";
  description: string;           // 2-3 sentence editorial copy
  features: string[];            // ["Private in-unit elevator", "Cocktail pool", ...]
  floorImages: {
    ground: string;              // "/images/floorplans/unit-1/ground.jpg"
    second: string;
    third: string;
    fourth: string;
    groundAlt?: string;          // Unit 5 only: Alt.2 variant
  };
  floorSummaries: {              // One-line room summary per floor for tab label
    ground: string;              // "Garage, Foyer, Bedroom"
    second: string;
    third: string;
    fourth: string;
  };
  floorplanPdf: string;          // "/pdfs/floorplans/Unit_1_Floorplan.pdf"
  heroImage: string;
  galleryImages: string[];
  finishPackages: ("brisa" | "noir")[];
  groundFloorAlternates?: number; // Unit 5: 2
}
```

### `content/gallery.json` — Array of GalleryImage objects

```typescript
interface GalleryImage {
  id: string;
  filename: string;              // Relative to /images/gallery/
  title: string;                 // "Kitchen — Backsplash Detail" — ALWAYS present
  category: "interiors" | "kitchen" | "primary-suite" | "living" |
            "terrace" | "pool" | "rooftop" | "exterior";
  alt: string;
  unit?: string;                 // Optional: "unit-1"
}
```

### `content/settings.json`

```typescript
interface SiteSettings {
  siteName: string;              // "Casa Avenida"
  address: string;               // "102 SE 5th Ave, Delray Beach, FL 33483"
  phone: string;                 // Primary contact phone
  email: string;                 // Primary contact email
  completionDate: string;        // "Q2 2027"
  priceFrom: string;             // "From the low $3M"
  agents: Agent[];
  social: {
    instagram: string;           // GVC Instagram — leave "" until provided
    facebook: string;
    linkedin: string;
  };
  disclaimer: string;            // Full Douglas Elliman disclaimer text
  constructionTimeline: {
    milestones: {
      label: string;             // "Foundation"
      date?: string;             // "Q3 2025" — optional
      completed: boolean;
    }[];
    currentPhase: string;        // Label of the current milestone
    completionDate: string;      // "Q2 2027"
  };
}

interface Agent {
  id: string;
  name: string;
  title: string;
  company: string;               // "Douglas Elliman"
  phone: string;
  email: string;
  headshot: string;              // "/images/team/tj.jpg"
  bio: string;                   // Placeholder text until provided
  // No WhatsApp field
}
```

### `content/neighborhood.json` — Array of POI objects

```typescript
interface POI {
  id: string;
  name: string;
  category: "restaurant" | "hotel" | "beach" | "fitness" | "grocery" | "entertainment";
  lat: number;
  lng: number;
  distanceText: string;          // "1 block", "5 min walk"
  description?: string;
}
```

### `content/finishes.json`

```typescript
interface FinishesPackage {
  id: "brisa" | "noir";
  name: string;                  // "Brisa" or "Noir"
  tagline: string;
  description: string;
  heroImage: string;
  swatches: {
    category: string;            // "Exterior", "Flooring", "Cabinetry", etc.
    items: {
      name: string;
      image: string;
      description?: string;
    }[];
  }[];
  pdf: string;                   // "/pdfs/finishes/Brisa_Finishes.pdf"
}
```

---

## Part 7: Page Specifications

### 7.1 Home (`/`)

**Sections in order:**

1. **Hero** (full-viewport)
   - Autoplay crossfade of 6–8 renders, 1.5s crossfade, 8s interval
   - Each image: Ken Burns slow zoom (CSS `transform: scale(1.0 → 1.08)` over 8s, reset on crossfade)
   - CSS grain overlay: SVG noise at 3% opacity, `position: fixed`, zero JS cost
   - Logo centered, "DELRAY BEACH · 2027" in Raleway below
   - Scroll-linked: headline scales up + fades out tied to scroll (Motion `useScroll` + `useTransform`)
   - CTA: "EXPLORE RESIDENCES" — gold bordered pill, magnetic hover (±4px within 30px)
   - No curtain reveal animation

2. **Marquee strip**
   - Slow infinite ticker: `CASA AVENIDA · DELRAY BEACH · 8 EXCLUSIVE RESIDENCES · COMPLETION Q2 2027 · ✦`
   - `--color-lunar` bg, Raleway Light text
   - Pause on hover
   - **Built as a toggleable component with `data-marquee-enabled` attribute** — can be removed later without touching other code

3. **Vision/Story** (two-column)
   - Left: editorial pull quote in Quake display
   - Right: render
   - Slow fade + translate-up on scroll enter
   - ⚠️ Copy: placeholder text — needs team approval

4. **Credibility strip** (thin, subtle)
   - Single row: `RWB-LINARES ARCHITECTURE · KASTELO DEVELOPMENT · 4TRO CAPITAL · DOUGLAS ELLIMAN`
   - Raleway, small, letter-spaced, Sapling gold on dark
   - No logos — text only until brand permissions confirmed

5. **By the Numbers** (animated counter strip)
   - `8` RESIDENCES · `~3,000` SQ FT · `4` LEVELS · `1` BLOCK TO ATLANTIC AVE
   - Numbers count 0→N using `IntersectionObserver` + `requestAnimationFrame` when viewport enters
   - Gold numbers, white labels

6. **Amenities showcase** (full-bleed dark section)
   - Private in-unit elevator · Cocktail pool + garden · Rooftop terrace · Private garage + EV station
   - Icon or thin graphic per amenity
   - Bahama Blue accent details
   - ⚠️ Copy: placeholder

7. **Residence Teaser** (horizontal scroll)
   - 8 unit cards in a horizontal drag/swipe container
   - Each card: render bg with gradient overlay, gold unit number (Quake, large), GSF, availability badge
   - Scroll hint arrow on first load

8. **Architecture Feature** (full-bleed)
   - Dark Lunar bg, Bahama Blue accent
   - Three architecture pillars with thin gold rule separators
   - ⚠️ Copy: placeholder

9. **Construction Timeline**
   - Horizontal milestone strip driven by `settings.json` `constructionTimeline`
   - Each milestone: dot, label, optional date
   - Current phase: highlighted in Sapling gold
   - Final milestone "Q2 2027" always in gold regardless of current phase
   - Fully data-driven — no code changes needed to update milestone status

10. **Gallery Teaser** (3-column masonry)
    - 6 preview images
    - "VIEW FULL GALLERY" CTA pill

11. **Neighborhood Teaser**
    - Editorial paragraph + static map image
    - Distance callouts: `1 block to Atlantic Ave · 5 min to the beach · 2 min to dining`
    - "EXPLORE THE NEIGHBORHOOD" CTA
    - ⚠️ Copy: placeholder

12. **Footer** (see Global Components)

**Home-page-only:** Floating pill "INQUIRE ABOUT A RESIDENCE →" fades in after 30% scroll, bottom-center.

---

### 7.2 Residences (`/residences`)

**Sections:**

1. **Building Key Plan**
   - Top-down SVG site plan showing all 8 units and their spatial relationship
   - Each unit: clickable region, hover = gold highlight, availability badge
   - Click navigates to `/residences/unit-[id]`
   - ⚠️ **DEFERRED — waiting on site plan images from team**
   - Build `BuildingKeyPlanPlaceholder` component first: branded dark bg, "SITE PLAN COMING SOON" in Raleway, with 8 labeled unit buttons that still navigate correctly

2. **Unit Grid** (4×2 responsive)
   - 8 cards, stagger animate in (Motion `staggerChildren: 0.1s`)
   - Each card:
     - Full-bleed render bg + dark gradient overlay (bottom)
     - Gold unit number (Quake, top-left)
     - Status badge (top-right): AVAILABLE (green) / UNDER CONTRACT (amber) / SOLD (red + 50% dark overlay on whole card)
     - Hover: card lifts `translateY(-6px)`, secondary info fades up (GSF, beds/baths)
     - "INQUIRE FOR PRICING" — never show dollar amounts
     - Click → unit detail page

---

### 7.3 Unit Detail (`/residences/unit-[id]`)

**Tab navigation:** Overview · Floorplan · Finishes · Inquire

**Overview tab:**
- Full-bleed hero render with unit name + key specs overlay
- Swipe carousel of unit renders
- Feature list with thin gold rule separators
- GSF breakdown: Total GSF / Under Air SF / Exterior SF
- Unit tagline in Quake display
- Status badge + "INQUIRE FOR PRICING" CTA

**Floorplan tab** *(priority feature — must be excellent)*:
- Floor selector: `Ground · Second · Third · Fourth` as pill tabs
  - **Unit 5 exception:** Ground tab has a sub-selector: `Alt. 1 · Alt. 2`
- Main viewer: high-res floor image fills available width
- Interaction: `react-zoom-pan-pinch` — pinch-to-zoom mobile, scroll-to-zoom desktop, pan
- Floor transitions: CSS opacity crossfade (not slide — cleaner for technical drawings)
- Key plan thumbnail: always visible in bottom-right corner, current unit highlighted in gold
- "All floors" option: vertically stacked view of all 4 floors
- Floor tab header shows room summary: `"Ground — Garage, Foyer, Bedroom"`
- "DOWNLOAD FLOORPLAN PDF" button: always visible, positioned above viewer

**Finishes tab:**
- Toggle: Brisa / Noir (pill toggle, animated switch)
- Per-package: hero render, swatch grids by category
- "DOWNLOAD FINISHES PDF" button

**Inquire tab:**
- Full inquiry form pre-filled with this unit name in "Unit of Interest" field
- Same form as `/contact`

---

### 7.4 Gallery (`/gallery`)

- Masonry grid layout, lazy-loaded, blur-up fade
- **Every image has a visible title caption** — semi-transparent `--color-lunar` bar at image bottom, white Afacad Flux text. Always visible (not hover-dependent)
- Category filter pills: `All · Interiors · Kitchen · Primary Suite · Living · Terrace · Pool · Rooftop · Exterior`
- Filter change: Motion `layout` animation (grid reflows smoothly)
- Lightbox on click:
  - Fullscreen overlay
  - Image counter: "4 / 23"
  - Caption visible at bottom
  - Keyboard ← → navigation
  - Swipe navigation on mobile
  - ESC or background click closes
  - Motion `AnimatePresence` open/close animation
- Mobile: full-screen swipe gallery replaces masonry grid (no masonry on small screens)

---

### 7.5 Virtual Tour (`/virtual-tour`)

- Nav auto-hides on this page (scrolling up reveals it via Motion)
- Cinematic header: "STEP INSIDE" in Quake
- Full-viewport iframe: `100vw × 80vh` minimum
- Branded loading state: gold "A" pulsing while iframe initializes
- Custom branded fullscreen button (bottom-right of iframe container)
- Below fold: 1-2 sentence description + "SCHEDULE IN PERSON" CTA
- ⚠️ `NEXT_PUBLIC_VIRTUAL_TOUR_URL` env var — leave placeholder until team provides

---

### 7.6 Neighborhood (`/neighborhood`)

- Hero: "ONE BLOCK FROM ATLANTIC AVENUE" in Quake
- Interactive Google Maps embed:
  - Custom map styling JSON: Lunar/Sapling color scheme
  - Custom "A" monogram pin for Casa Avenida (`102 SE 5th Ave`)
  - Map centered on `[26.4558, -80.0651]` (approximate — confirm exact coordinates)
  - Color-coded POI markers by category (from `neighborhood.json`)
  - Category toggle buttons filter visible pins
  - Click pin → custom side panel card (NOT Google default InfoWindow):
    - Name, category label, distance from Casa Avenida, "Get Directions" `href`
    - Slides in from right on desktop, slides up from bottom on mobile
- Static fallback image if Maps API key missing or fails
- Lifestyle editorial grid (4 cards): Dining · Beach · Wellness · Culture
  - Each: image, headline, 2-3 sentence body
  - ⚠️ Copy: placeholder
- Distance callouts strip: `1 block to Atlantic Ave · 5 min to the beach · 2 min to dining`

---

### 7.7 News (`/news`)

- Article card grid: cover image, date, title, 2-line excerpt
- Tag filter pills: `Market Updates · Lifestyle · Development Progress`
- Filter: Motion layout animation

**First 4 articles (Haven newsletters):**
| Slug | Source | Season |
|---|---|---|
| `haven-june-2025` | June newsletter | Summer |
| `haven-october-2025` | October newsletter | Fall |
| `haven-november-2025` | November newsletter | Fall |
| `haven-january-2026` | January newsletter | Winter |

Content: Web copy only (no PDF embed). Key images from newsletters inline in article body. No PDF download option.

**Article detail (`/news/[slug]`):**
- Luxury editorial layout: generous whitespace, large drop cap first letter
- Brand typography throughout (Quake for article headline, Afacad Flux for body)
- Inline images (from MDX)
- No comments, no social sharing
- MailerLite subscribe section at article bottom:
  - Email field only + "SUBSCRIBE" button
  - Posts to `/api/subscribe`
  - Success state: "You're on the list."

**MDX content:** `/content/articles/[slug].mdx`

---

### 7.8 Team (`/team`)

- TJ Verdiglione and Nicole Melveney
- Each: headshot (ImagePlaceholder until provided), name, title, company (Douglas Elliman), bio (placeholder), credentials
- Click-to-call: `tel:` links
- Email: `mailto:` links
- **No WhatsApp links anywhere on this page or site**

---

### 7.9 Contact (`/contact`)

**Form fields:**
- First Name (required)
- Last Name (required)
- Email (required, validated)
- Phone (optional)
- Unit of Interest (dropdown): General Inquiry / Unit 1 / Unit 2 / … / Unit 8 / All Units
- Finish Preference: Brisa / Noir / Undecided (radio)
- Preferred Contact Method: Email / Phone (radio) — no WhatsApp option
- Message (optional textarea)
- `email_confirm` (honeypot — hidden via CSS, never via `display:none`, must not be `aria-hidden`)
- reCAPTCHA v3 invisible (uses `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, verifies with `RECAPTCHA_SECRET_KEY`)

**API route `/api/contact`:**
1. Honeypot check: if `email_confirm` has value → return 200 silently (do not reveal detection)
2. reCAPTCHA v3: verify score server-side (threshold: 0.5)
3. Rate limit: 20 req/min/IP via Edge middleware
4. Send email via Resend
5. Log to Google Sheets via webhook (`GOOGLE_SHEETS_WEBHOOK_URL`)
6. Return `{ success: true }` → client redirects to `/thank-you`

**Agent cards** below form: TJ and Nicole with click-to-call `tel:` and `mailto:` links.

**Douglas Elliman disclaimer** visible on this page (plus in footer).

---

### 7.10 Thank You (`/thank-you`)

- Direct URL navigation → 404 redirect (only accessible post-form submit)
- Implemented via: check `sessionStorage` flag set by form submit, or use referrer check
- Content: confirmation message + agent contact cards + "Explore the Gallery" CTA
- Conversion pixel placeholder: empty `<script>` tag with comment `<!-- Conversion pixel goes here -->`
- No back button shown

---

### 7.11 Finishes Standalone (`/residences/finishes`)

- Brisa / Noir toggle (same component as unit detail Finishes tab)
- Package hero render
- Full swatch grids by category
- Package description
- "DOWNLOAD FINISHES PDF" for each package
- Link from: Residences nav dropdown, unit detail Finishes tab

---

### 7.12 Legal

**`/legal/disclaimer`** — Full Douglas Elliman disclaimer text (verbatim from `settings.json`)

**`/legal/privacy-policy`** — Cookie policy, form data handling, no third-party sale statement
- ⚠️ Needs attorney review before site goes live
- Placeholder content until reviewed

---

### 7.13 404 Not Found

- Dark Lunar bg
- Large gold "404" in Quake
- Single sentence: "This page doesn't exist."
- "RETURN HOME" CTA
- Zero stack traces, zero technical detail

---

### 7.14 500 Error

- Same visual treatment as 404
- "Something went wrong."
- Zero stack traces, zero env vars exposed

---

## Part 8: Animation Specification

| Effect | Implementation | Notes |
|---|---|---|
| Hero crossfade | CSS `@keyframes` opacity 0→1 | 1.5s duration, 8s interval |
| Ken Burns | CSS `@keyframes` `transform: scale(1.0→1.08)` | 8s, reset on crossfade |
| CSS grain overlay | SVG `feTurbulence` noise at 3% opacity, `position: fixed` | No JS |
| Scroll-linked hero text | Motion `useScroll` + `useTransform` | Scale up + `opacity: 0` at scroll |
| Marquee | CSS `animation: marquee 30s linear infinite` | JS class toggle for hover-pause |
| Magnetic CTA | TS `mousemove` → `transform: translate(x,y)` ±4px | Within 30px radius only |
| Scroll fade-in | Motion `whileInView` `{opacity:0, y:20}→{opacity:1, y:0}` | `viewport={{once:true}}` |
| Unit card stagger | Motion `staggerChildren: 0.1` | On grid mount |
| Counter | `IntersectionObserver` + `requestAnimationFrame` | 2s ease, fires once |
| Nav scroll | CSS `transition: background-color 0.3s` + scroll listener | Transparent → Lunar |
| Mobile nav overlay | Motion `AnimatePresence` slide in from top | Nav link stagger |
| Gallery layout | Motion `layout` prop | Filter change reflow |
| Lightbox | Motion `AnimatePresence` scale+opacity | From clicked image |
| Page transitions | Motion `AnimatePresence` fade | 0.3s, all routes |
| Floor crossfade | CSS opacity transition | 0.3s between floor images |
| Button hover | CSS `::after` pseudo-element | Sapling fill sweeps left→right |

**Accessibility — mandatory:**
```tsx
// Apply to all Motion animations
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// If true: skip motion animations, use instant state changes only
```

---

## Part 9: SEO Specification

- `next/metadata` per page — unique `<title>` and `<meta name="description">` on all routes
- **Every page must have server-rendered `<h1>`** — never client-only
- `sitemap.xml` auto-generated from all routes (Next.js `sitemap.ts`)
- `robots.txt`: allow all, disallow `/api/`, `/thank-you/`
- Schema.org structured data:
  - `RealEstateListing` on each `/residences/unit-[id]` page
  - `LocalBusiness` on `/contact` and home page
  - `Organization` globally in root layout
- Canonical URLs on all pages
- OpenGraph: branded image per page, fallback `/public/og-default.jpg` (1200×630)
- All `<Image>` components: `alt` from JSON manifest, never empty string
- Semantic HTML: proper `<h1>` hierarchy, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`

---

## Part 10: Security Specification

### API Security
```typescript
// middleware.ts — applies to all /api/ routes
- Rate limit: 20 req/min/IP on /api/contact
- CSP header: whitelist Google Maps, MailerLite, virtual tour host, Vercel Analytics, Google Fonts
- X-Frame-Options: SAMEORIGIN (except virtual tour page)
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
```

### Form Security
- Honeypot: hidden field `email_confirm` — if populated, silently accept and discard
- reCAPTCHA v3: server-side score verification, threshold 0.5
- All validation server-side in `/api/contact/route.ts`
- Never log PII in production console

### Secrets
```bash
# All in Vercel env vars. .gitignore includes .env.local
GOOGLE_MAPS_API_KEY      # Domain-restricted to casaavenidadelray.com
RESEND_API_KEY
GOOGLE_SHEETS_WEBHOOK_URL
MAILERLITE_API_KEY
MAILERLITE_GROUP_ID
RECAPTCHA_SECRET_KEY     # Server-side only, never in NEXT_PUBLIC_
NEXT_PUBLIC_RECAPTCHA_SITE_KEY  # Client-safe, used in contact form
NEXT_PUBLIC_VIRTUAL_TOUR_URL    # Placeholder until team provides
```

---

## Part 11: Legal Requirements

- **Douglas Elliman disclaimer in footer on every single page** — not just legal page
- `/legal/disclaimer` — full disclaimer page
- `/legal/privacy-policy` — ⚠️ attorney review required before launch
- Pre-construction notice on all unit pages and under render images:
  *"Renderings are artist's conceptual interpretations. All plans, specifications, and features are subject to change without notice."*
- Florida Statute 718.503 disclosure — use exact language from brochure

---

## Part 12: Environment Variables

```bash
# .env.example (commit this to repo — no values)
GOOGLE_MAPS_API_KEY=
RESEND_API_KEY=
GOOGLE_SHEETS_WEBHOOK_URL=
MAILERLITE_API_KEY=
MAILERLITE_GROUP_ID=
RECAPTCHA_SECRET_KEY=
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
NEXT_PUBLIC_VIRTUAL_TOUR_URL=
```

Never commit `.env.local`. Add to `.gitignore`:
```
.env.local
.env.*.local
```

---

## Part 13: Active TODO List

These items are deferred pending external input. Build placeholder states for each — never block progress.

| # | Item | Placeholder behavior |
|---|---|---|
| 1 | Virtual tour iframe URL | `NEXT_PUBLIC_VIRTUAL_TOUR_URL=""` — show branded "Coming Soon" state |
| 2 | GVC social media URLs | Leave `""` in `settings.json` — hide social icons if empty |
| 3 | Quake font WOFF2 file | Fall back to Cormorant Garamond if `/public/fonts/Quake.woff2` missing |
| 4 | Building key plan site plan images | `BuildingKeyPlanPlaceholder` with labeled unit navigation buttons |
| 5 | Per-unit copy/descriptions | Lorem placeholder in `units.json` |
| 6 | Developer/architect/designer bios | Lorem placeholder |
| 7 | Agent bios + headshots | `ImagePlaceholder` + lorem bio text |
| 8 | Google Maps API key | Static image fallback map |
| 9 | Google Sheets webhook URL | Skip logging step, don't fail form |
| 10 | Resend API key | Log to console in dev, skip in prod |
| 11 | MailerLite group ID | Return success without API call |
| 12 | reCAPTCHA key pair | Skip verification in dev (`NODE_ENV !== 'production'`) |
| 13 | Privacy policy copy | Legal placeholder text |
| 14 | DNS pointing to Vercel | N/A — deploy to Vercel subdomain first |
| 15 | Real render images | `ImagePlaceholder` throughout |
| 16 | Construction timeline dates | Placeholder milestones in `settings.json` |
| 17 | Social handles (Instagram, etc.) | Leave `""` — component conditionally renders |
| 18 | Marquee strip — keep or remove | Built as toggleable, `data-marquee-enabled` |

---

## Part 14: Development Standards

- TypeScript strict mode — no `any` types
- All interfaces defined in `lib/types.ts`
- Server Components by default — `'use client'` only when required
- No hardcoded strings — all content from JSON or env vars
- All `<Image>` components: `alt`, `width`, `height`, `placeholder="blur"` required
- No inline styles — Tailwind classes or CSS custom properties only
- Form validation: server-side in API routes — never trust client-only
- Mobile-first responsive: 375px · 768px · 1280px · 1440px breakpoints
- No custom cursor

---

## Part 15: Build Sequence Recommendation

Suggested order to build efficiently:

1. **Foundation** — Next.js project setup, brand tokens, global CSS, fonts, layout (nav + footer)
2. **Content layer** — All JSON files with placeholder data, `lib/types.ts`, `lib/content.ts`
3. **Image scaffolding** — `/public/images/` folder structure with `.gitkeep` files
4. **UI primitives** — Button, Badge, Tab, Modal, ImagePlaceholder, ScrollFade
5. **Home page** — All sections top to bottom (Hero last, as it's most complex)
6. **Residences** — Unit grid → Unit detail (floorplan viewer is the hardest, build last)
7. **Gallery** — Masonry grid → Lightbox → Category filter
8. **Neighborhood** — Static fallback first, then Google Maps interactive layer
9. **News** — Article grid → Article detail → Subscribe form
10. **Contact** — Form → API routes → Thank You page
11. **Team, Virtual Tour, Finishes** — Straightforward pages
12. **Legal, 404, 500** — Final polish
13. **Animations** — Layer in Motion animations after structure is solid
14. **SEO** — Metadata, schema, sitemap, robots.txt
15. **Security** — Middleware, CSP headers, rate limiting audit

---

*PRD v2.1 — Complete. Ready for Claude Code.*

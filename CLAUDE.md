# CLAUDE.md — Casa Avenida Website
## AI Development Context & Guiding Intelligence

---

## What This Project Is

Casa Avenida is a boutique luxury real estate development — **8 townhome residences** at 102 SE 5th Ave, Delray Beach, FL 33483. Prices starting from the low $3M range. Expected completion Q2 2027. Developed by Kastelo & 4TRO, designed by RWB-Linares Architecture, interiors by Stef Leonel and Ava Gray. Sales through TJ Verdiglione and Nicole Melveney at Douglas Elliman.

This website is the primary digital marketing asset for the development. Its job is singular: **convert high-net-worth buyers into qualified inquiries.** Every design and code decision should serve that goal.

---

## The Brand Feel — Read This Before Touching a Component

This is not a typical real estate website. It should feel like a **luxury editorial publication** crossed with a **cinematic property experience**. Think: Architectural Digest meets a Renzo Piano development site.

The buyer arriving at this site likely lives in a $2M+ home already. They are visually literate, style-conscious, and will immediately sense when something feels off. **Cheap, template-y, or rushed work will kill trust instantly.** Precision, restraint, and craft signal the quality of the development itself.

**Key emotional beats to hit:**
- Arrival → Calm, cinematic, prestigious
- Exploration → Confident and unhurried — nothing rushes the buyer
- Inquiry → Natural, discreet, never pushy (except home page scroll CTA)

---

## Brand Tokens — Never Deviate

```css
/* Colors */
--color-lunar:   #373A36;   /* Primary dark background */
--color-saddle:  #4F2C1D;   /* Deep warm brown accent */
--color-bahama:  #006A8E;   /* Bahama blue accent */
--color-sapling: #DFD1A7;   /* Primary gold / Sapling */
--color-white:   #FFFFFF;

/* Typography */
--font-display:  'Quake', serif;              /* ALL CAPS, tracking 0 — hero headlines only */
--font-heading:  'Raleway', sans-serif;       /* ALL CAPS, letter-spacing: 0.075em — section headers */
--font-body:     'Afacad Flux', sans-serif;   /* Sentence case — all body copy, variable weight */
--font-ui:       'Helvetica Neue', Helvetica, sans-serif; /* Sentence case — labels, badges, UI chrome */
```

**Afacad Flux** is loaded via `next/font/google`. **Raleway** via `next/font/google`. **Quake** must be loaded as a local WOFF2 file from `/public/fonts/Quake.woff2` — confirm the file exists before using it; if missing, fall back to `Cormorant Garamond` for display.

---

## Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 14 (App Router, TypeScript) | Use Server Components by default, Client Components only when interactivity requires it |
| Hosting | Vercel | Deploy on every push to `main` |
| Styling | Tailwind CSS + CSS custom properties | Brand tokens as CSS vars, Tailwind for layout/spacing |
| Animation | Motion (formerly Framer Motion) + CSS + native TS | No GSAP — Motion handles all JS animation |
| Images | `/public/images/` → Next.js `<Image>` | WebP format, blur placeholder always, `priority` on hero |
| Content | JSON flat files in `/content/` | No database, no CMS subscription |
| Forms | Resend API (server route) + Google Sheets webhook | Both via Vercel env vars |
| Maps | Google Maps JavaScript API | Custom styled, API key in env vars only |
| Email subs | MailerLite API | Auto-add on news subscribe form |
| Analytics | Vercel Analytics | Built-in, no setup needed |
| Font | `next/font/google` for Raleway + Afacad Flux | Zero layout shift |

---

## Project Structure

```
casa-avenida/
├── app/                          ← Next.js App Router
│   ├── page.tsx                  ← Home
│   ├── residences/
│   │   ├── page.tsx              ← Residences grid + building key plan
│   │   ├── unit-[id]/
│   │   │   └── page.tsx          ← Unit detail: Overview · Floorplan · Finishes · Inquire tabs
│   │   └── finishes/
│   │       └── page.tsx          ← Standalone finishes page
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
│   ├── not-found.tsx             ← Branded 404
│   ├── error.tsx                 ← Branded 500 (no stack traces)
│   ├── layout.tsx                ← Root: Nav, Footer, CookieBanner, fonts
│   └── api/
│       ├── contact/route.ts      ← Form submission handler
│       └── subscribe/route.ts    ← MailerLite newsletter handler
├── components/
│   ├── nav/                      ← Navbar, MobileNav, NavLink
│   ├── hero/                     ← HeroCarousel, HeroText, GrainOverlay
│   ├── home/                     ← VisionSection, StatsStrip, ResidenceTeaser,
│   │                                AmenitiesSection, ArchitectureFeature,
│   │                                ConstructionTimeline, GalleryTeaser,
│   │                                NeighborhoodTeaser, CredibilityStrip
│   ├── units/                    ← UnitCard, UnitGrid, BuildingKeyPlan,
│   │                                FloorplanViewer, FinishesToggle
│   ├── gallery/                  ← MasonryGrid, Lightbox, CategoryFilter
│   ├── contact/                  ← InquiryForm, AgentCard
│   ├── news/                     ← ArticleCard, ArticleGrid, SubscribeForm
│   ├── map/                      ← NeighborhoodMap, MapPin, PinSidePanel
│   ├── animations/               ← ScrollFade, Counter, Marquee, MagneticButton
│   ├── ui/                       ← Button, Badge, Tab, Modal, ImagePlaceholder
│   └── layout/                   ← Footer, CookieBanner, FloatingCTA (home only),
│                                    BackToTop, MobileInquireBar
├── content/
│   ├── units.json
│   ├── gallery.json
│   ├── news.json
│   ├── team.json
│   ├── settings.json
│   ├── neighborhood.json
│   ├── finishes.json
│   └── images.json
├── lib/
│   ├── types.ts                  ← All TypeScript interfaces
│   ├── content.ts                ← JSON loader utilities
│   ├── maps.ts                   ← Google Maps helpers
│   └── mailerlite.ts             ← MailerLite API wrapper
├── public/
│   ├── fonts/
│   │   └── Quake.woff2           ← Must be confirmed present before use
│   └── images/                   ← See Image Protocol below
├── styles/
│   └── globals.css               ← CSS custom properties, base resets
├── middleware.ts                  ← Rate limiting, CSP headers
└── next.config.js                 ← Image domains, security headers
```

---

## Content JSON Schemas

These are the source-of-truth data shapes. Do not deviate — components must consume these schemas.

### `/content/units.json`
```typescript
interface Unit {
  id: string;                    // "unit-1" through "unit-8"
  name: string;                  // "Unit One"
  tagline: string;               // Short editorial line: "Corner residence with pool garden"
  gsf: number;                   // Total gross SF
  underAirSF: number;
  exteriorSF: number;
  bedrooms: number;
  bathrooms: number;
  levels: number;                // Always 4
  status: "available" | "under-contract" | "sold";
  priceDisplay: "INQUIRE FOR PRICING"; // Always this string
  description: string;           // 2-3 sentence editorial description
  features: string[];            // ["Private elevator", "Cocktail pool", ...]
  floorImages: {                 // One image per floor
    ground: string;
    second: string;
    third: string;
    fourth: string;
    groundAlt?: string;          // Unit 5 has two ground floor variants
  };
  floorplanPdf: string;          // Path to full PDF
  heroImage: string;             // Primary render
  galleryImages: string[];       // Additional renders
  finishPackages: ("brisa" | "noir")[];
  groundFloorAlternates?: number; // Unit 5: 2
}
```

### `/content/gallery.json`
```typescript
interface GalleryImage {
  id: string;
  filename: string;
  title: string;                 // ALWAYS present — shown as caption
  category: "interiors" | "kitchen" | "primary-suite" | "living" |
            "terrace" | "pool" | "rooftop" | "exterior";
  alt: string;
  unit?: string;                 // Optional: "unit-1"
}
```

### `/content/settings.json`
```typescript
interface SiteSettings {
  phone: string;
  email: string;
  address: string;
  agents: {
    name: string;
    title: string;
    phone: string;
    email: string;
    headshot: string;
    // No WhatsApp
  }[];
  social: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    // All GVC team socials — populated later, leave as "" placeholder
  };
  disclaimer: string;            // Full Douglas Elliman legal disclaimer text
  completionDate: string;        // "Q2 2027"
  address: string;
}
```

### `/content/neighborhood.json`
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

---

## Image Protocol — Critical

> ⚠️ **Build order:** Scaffold `/public/images/` folder structure FIRST with empty placeholder files. Real assets are dropped in by hand. Components must degrade gracefully if an image file is missing.

```
/public/images/
  hero/               ← hero-01.jpg through hero-08.jpg
  gallery/            ← descriptively named: kitchen-angle-1.jpg, pool-angle-1.jpg
  units/
    unit-1/           ← unit-specific renders
    unit-2/ … unit-8/
  floorplans/
    unit-1/           ← ground.jpg, second.jpg, third.jpg, fourth.jpg
    unit-2/ … unit-8/ ← unit-5 also has ground-alt.jpg
  finishes/
    brisa/
    noir/
  team/               ← tj.jpg, nicole.jpg
  logos/              ← logo-gold.svg, logo-white.svg, logo-dark.svg
  neighborhood/       ← static-map-fallback.jpg
/public/pdfs/
  floorplans/         ← Unit_1_Floorplan.pdf … Unit_8_Floorplan.pdf
  finishes/           ← Brisa_Finishes.pdf, Noir_Finishes.pdf
```

**The `ImagePlaceholder` component** renders a `#373A36` background with a subtle Sapling "A" centered in it. Use it anywhere an image might be missing.

**Performance requirements:**
- Hero images: ≤200KB each (WebP, optimized before adding to repo)
- All `<Image>` components: `placeholder="blur"` + `blurDataURL` always set
- Hero images: `priority={true}` on the first visible image
- All other images: `loading="lazy"` (Next.js default)

---

## Animation Reference

All animations use **Motion** (`motion/react`) or pure CSS/TypeScript. No GSAP.

| Effect | Method | Notes |
|---|---|---|
| Hero crossfade | CSS keyframes + `opacity` transition | 1.5s crossfade, 8s interval |
| Ken Burns zoom | CSS `@keyframes` scale 1.0→1.08 over 8s | Reset on each crossfade |
| CSS grain overlay | SVG noise filter at 3% opacity, `position: fixed` | Zero JS cost |
| Scroll-linked hero text | Motion `useScroll` + `useTransform` | Scale up + fade out on scroll |
| Marquee strip | CSS `animation: marquee linear infinite` | Pause on hover via JS class toggle |
| Magnetic CTA buttons | Native TS `mousemove` + `transform: translate()` | ±4px pull within 30px radius |
| Scroll fade-in | Motion `whileInView`, `initial: {opacity:0,y:20}` | `viewport={{ once: true }}` |
| Unit card stagger | Motion `staggerChildren: 0.1` on grid container | Enter viewport once |
| Counter animation | `IntersectionObserver` + `requestAnimationFrame` | Count 0→N over 2s, eased |
| Nav scroll transition | CSS `transition` + scroll listener | `background: transparent → var(--color-lunar)` |
| Gallery layout | Motion `layout` prop on grid items | Smooth reflow on filter change |
| Lightbox open/close | Motion `AnimatePresence` + scale+opacity | From clicked image position |
| Page transitions | Motion `AnimatePresence` fade | Wrap layout in AnimatePresence |
| Floor image crossfade | CSS opacity transition | Between floor selector tabs |
| Button hover sweep | CSS `::after` pseudo-element sweep | Gold fill left→right |

**Accessibility:** All animations must respect `prefers-reduced-motion`. Wrap Motion components:
```tsx
const shouldAnimate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

---

## Page Specifications Summary

### Home (`/`)
Sections in order:
1. Hero — Crossfade, Ken Burns, grain overlay, scroll-linked text, "EXPLORE RESIDENCES" CTA (magnetic)
2. Marquee strip — `CASA AVENIDA · DELRAY BEACH · 8 EXCLUSIVE RESIDENCES · COMPLETION Q2 2027 · ✦` (toggleable)
3. Vision/Story — Two-column pull quote + editorial image
4. Credibility strip — RWB-Linares · Kastelo · 4TRO · Douglas Elliman (gold on dark, thin Raleway)
5. By the Numbers — Animated counters: 8 · ~3,000 SQ FT · 4 LEVELS · 1 BLOCK TO ATLANTIC AVE
6. Amenities showcase — Full-bleed dark section: elevator, pool, rooftop, EV station — feature icons
7. Residence Teaser — Horizontal drag/swipe scroll of 8 unit cards
8. Architecture Feature — Full-bleed Lunar bg, Bahama Blue accent
9. Construction Timeline — Milestone strip (see below)
10. Gallery Teaser — 3-up masonry, "VIEW FULL GALLERY" CTA
11. Neighborhood Teaser — Editorial paragraph + static map or embed
12. Inquiry CTA — Full-width Lunar bg, gold text, inline form field
13. Footer

**Home-only:** Floating "INQUIRE ABOUT A RESIDENCE →" pill appears after 30% scroll (bottom-center, fades in).

### Construction Timeline
Visual horizontal milestone strip. Milestones from `settings.json`:
- Site Preparation
- Foundation
- Framing
- Active Construction
- Interior Fit-Out
- Completion: Q2 2027 ← always last, gold-highlighted

Each milestone: icon/dot, label, optional date. Current phase highlighted in gold. This section updates via `settings.json` — no code change needed to update it.

### Residences (`/residences`)
1. Building Key Plan — Interactive SVG, top-down site plan. Each of 8 units is a clickable region. Hover = gold highlight. Click = navigate to unit detail. Availability badge per unit. **DEFERRED: wait for site plan images from team. Build placeholder component with "Coming Soon" state first.**
2. Unit Grid — 8 cards, 4×2 responsive, stagger animate in. Status badge. "INQUIRE FOR PRICING" always.

### Unit Detail (`/residences/unit-[id]`)
Tabs: Overview · Floorplan · Finishes · Inquire

**Floorplan tab (priority feature):**
- Floor selector: `Ground · Second · Third · Fourth` pill tabs
- Unit 5: Ground has a sub-selector: `Alt. 1 · Alt. 2`
- High-res image viewer: `react-zoom-pan-pinch` for pinch/scroll zoom + pan
- Floor crossfade transition (not slide)
- Key plan thumbnail: bottom-right corner, persistent, current unit highlighted gold
- "All floors" stacked view option
- "Download Floorplan PDF" always visible
- Floor tab shows room summary: "Ground — Garage, Foyer, Bedroom"

### Gallery (`/gallery`)
- Masonry grid, lazy loaded, blur-up
- **Visible title caption on every image** — semi-transparent Lunar bar at bottom, white Afacad Flux text. Always visible, not hover-only.
- Filter pills: All · Interiors · Kitchen · Primary Suite · Living · Terrace · Pool · Rooftop · Exterior
- Lightbox: fullscreen, image counter "4 / 23", caption visible, ← → keyboard, swipe mobile, ESC closes
- Mobile: full-screen swipe gallery replaces masonry

### Virtual Tour (`/virtual-tour`)
- Nav auto-hides (scrolling up reveals it)
- Full-viewport iframe (100vw × 80vh min)
- Branded loading state: gold "A" pulsing
- Custom fullscreen button
- ⚠️ iframe URL needed from team — leave placeholder

### Neighborhood (`/neighborhood`)
- Google Maps: custom Lunar/Sapling JSON style, "A" monogram pin for Casa Avenida
- Category toggle buttons → filter visible pins
- Click pin → branded side panel card (NOT Google default info window)
- Static image fallback if Maps API unavailable
- Lifestyle grid: 4 cards — Dining · Beach · Wellness · Culture

### News (`/news` and `/news/[slug]`)
- Haven newsletters (Jun, Oct, Nov, Jan) as web copy with inline images
- Tag filter: Market Updates · Lifestyle · Development Progress
- Article detail: luxury editorial layout, large drop cap, generous whitespace
- MailerLite subscribe at bottom of every article (email field only)
- MDX content files: `/content/articles/[slug].mdx`

### Contact (`/contact`)
Form fields: First Name, Last Name, Email (required), Phone, Unit of Interest (dropdown), Finish Preference, Preferred Contact Method, Message, Honeypot (hidden), reCAPTCHA v3 (invisible)

On submit → redirect to `/thank-you`

Agents section: TJ + Nicole cards. Click-to-call `tel:` links, `mailto:` links. **No WhatsApp.**

### Thank You (`/thank-you`)
Post-form only. Confirmation + agent cards + "Explore the Gallery" CTA. Conversion pixel placeholder.

---

## Security Checklist

| Requirement | Implementation |
|---|---|
| All API keys | Vercel env vars only. Never in code or committed to git. |
| Form spam | Honeypot field + reCAPTCHA v3 + Edge rate limit 20 req/min/IP |
| XSS | Next.js default escaping + DOMPurify on MDX-rendered content |
| CSRF | SameSite=Strict cookies + origin check on API routes |
| Clickjacking | `X-Frame-Options: SAMEORIGIN` — except virtual tour page |
| CSP | Whitelist only: Google Maps, MailerLite, virtual tour host, Vercel Analytics, Google Fonts |
| Error pages | Custom 404/500 — zero stack traces or env info exposed |
| CI | `npm audit` in GitHub Actions on every push |
| Cookies | No analytics cookies without consent. Functional only by default. |
| Google Maps API | Domain-restricted to `casaavenidadelray.com` in Google Cloud Console |

---

## Environment Variables Required

```bash
# .env.local (never commit this file)
GOOGLE_MAPS_API_KEY=
RESEND_API_KEY=
GOOGLE_SHEETS_WEBHOOK_URL=
MAILERLITE_API_KEY=
MAILERLITE_GROUP_ID=
RECAPTCHA_SECRET_KEY=
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
NEXT_PUBLIC_VIRTUAL_TOUR_URL=    # Placeholder until team provides
```

---

## SEO Requirements

- Unique `<title>` and `<meta name="description">` on every page via Next.js `metadata` API
- Server-rendered `<h1>` on every page — never client-only
- `sitemap.xml` auto-generated from all routes
- `robots.txt`: allow all, disallow `/api/`, `/thank-you`
- Schema.org: `RealEstateListing` on unit pages, `LocalBusiness` on home/contact
- All images: `alt` text populated from `images.json` or `gallery.json`
- Canonical URLs on all pages
- OpenGraph: branded image per page (static fallback from `/public/og-default.jpg`)

---

## Legal Requirements

- Douglas Elliman disclaimer appears in **footer on every single page**
- Full disclaimer also at `/legal/disclaimer`
- Privacy policy at `/legal/privacy-policy` (needs attorney review before launch)
- Pre-construction disclaimer on all unit pages and rendering images: *"Renderings are artist's conceptual interpretations and are subject to change."*
- Florida Statute 718.503 language must appear — see brochure for exact text

---

## Active TODO List

These items are deferred — do not block on them, leave appropriate placeholders:

- [ ] Virtual tour iframe URL/embed code (from team)
- [ ] GVC social media handles/URLs (Instagram, Facebook, LinkedIn) — leave `""` in settings.json
- [ ] Quake font WOFF2 file confirmation — if missing, use Cormorant Garamond fallback
- [ ] Building key plan SVG — waiting on site plan images from team, build placeholder component
- [ ] Per-unit copy/descriptions — placeholder lorem in `units.json`
- [ ] Developer, architect, designer bios — placeholder text
- [ ] Agent bios + headshots — placeholder text + ImagePlaceholder component
- [ ] Google Maps API key — domain restriction setup
- [ ] Google Sheets webhook URL — form lead logging
- [ ] Resend API key — email delivery
- [ ] MailerLite list/group ID — news subscribe
- [ ] reCAPTCHA v3 key pair — form protection
- [ ] Privacy policy attorney review — before launch only
- [ ] DNS — point `casaavenidadelray.com` to Vercel when ready
- [ ] Real render images — drop into `/public/images/` before visual components built
- [ ] Custom cursor — team preference pending (no custom cursor for now)
- [ ] Marquee strip — may be removed before launch (built as toggleable component)
- [ ] Construction timeline milestone dates — confirm with team

---

## Code Quality Standards

- TypeScript strict mode — no `any` types
- All components typed with explicit interfaces from `lib/types.ts`
- Server Components by default; use `'use client'` only where required
- No hardcoded strings — all content from JSON files or env vars
- All `<Image>` components must include `alt`, `width`, `height`, `placeholder="blur"`
- No inline styles — Tailwind classes or CSS custom properties only
- Forms: validate server-side in API routes, never trust client-only validation
- Mobile-first responsive design — test at 375px, 768px, 1280px, 1440px

---

## The North Star

When in doubt, ask: *Does this decision make the site feel more like a $3M residence or less?*

Restraint over excess. Precision over decoration. Every pixel earns its place.

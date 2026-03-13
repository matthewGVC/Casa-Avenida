# Casa Avenida — Website

**8 luxury townhome residences. Delray Beach, FL. From the low $3M.**

Marketing and sales website for Casa Avenida at 102 SE 5th Ave, Delray Beach, FL 33483. Expected completion Q2 2027.

---

## Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS + CSS custom properties
- **Animation:** Motion (formerly Framer Motion) + CSS
- **Hosting:** Vercel
- **Content:** JSON flat files in `/content/`
- **Forms:** Resend (email) + Google Sheets webhook (lead log)
- **Maps:** Google Maps JavaScript API
- **Email:** MailerLite

---

## Getting Started

### Prerequisites

- Node.js 18.17+
- npm or yarn

### Installation

```bash
git clone <repo-url>
cd casa-avenida
npm install
```

### Environment Variables

Copy the example file and fill in values:

```bash
cp .env.example .env.local
```

Required variables:

```
GOOGLE_MAPS_API_KEY=
RESEND_API_KEY=
GOOGLE_SHEETS_WEBHOOK_URL=
MAILERLITE_API_KEY=
MAILERLITE_GROUP_ID=
RECAPTCHA_SECRET_KEY=
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
NEXT_PUBLIC_VIRTUAL_TOUR_URL=
```

> ⚠️ Never commit `.env.local`. It is gitignored.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm run start
```

---

## Project Structure

```
casa-avenida/
├── app/                    ← Next.js App Router pages
├── components/             ← All React components
├── content/                ← JSON content files (CMS layer)
├── lib/                    ← Utilities, types, API helpers
├── public/
│   ├── fonts/              ← Quake.woff2 (local font)
│   └── images/             ← All photography and renders
├── styles/
│   └── globals.css         ← CSS custom properties, base styles
├── middleware.ts            ← Rate limiting, CSP headers
├── next.config.js           ← Image domains, security headers
├── CLAUDE.md               ← AI development context (read before coding)
└── README.md               ← This file
```

---

## Content Management

All site content is managed through JSON files in `/content/`. No CMS login or subscription required.

| File | Controls |
|---|---|
| `units.json` | Unit specs, pricing display, availability status, descriptions |
| `gallery.json` | Gallery images, titles, categories |
| `news.json` | Article metadata and slugs |
| `team.json` | Agent and designer profiles |
| `settings.json` | Global: phone, email, address, social links, disclaimer |
| `neighborhood.json` | Map pins: name, category, coordinates, distance |
| `finishes.json` | Brisa and Noir package details |
| `images.json` | Master image path manifest |

### Updating Unit Availability

Open `content/units.json`, find the unit, change `"status"`:

```json
"status": "available"        → Available (green badge)
"status": "under-contract"   → Under Contract (amber badge)
"status": "sold"             → Sold (red badge, 50% opacity overlay)
```

Commit and push. Vercel deploys in ~30 seconds. Done.

### Updating Construction Timeline

Open `content/settings.json`, find `constructionTimeline`, update milestone dates and `currentPhase`. No code change needed.

---

## Image Management

### Adding / Replacing Images

1. Drop the new file into the appropriate folder under `/public/images/`
2. Update the path in the relevant JSON file if the filename changed
3. Commit and push → Vercel deploys → all instances update

### Image Folder Structure

```
/public/images/
  hero/               ← Homepage hero carousel (hero-01.jpg … hero-08.jpg)
  gallery/            ← All gallery renders (descriptive names)
  units/
    unit-1/           ← Unit-specific renders
    unit-2/ … unit-8/
  floorplans/
    unit-1/           ← ground.jpg, second.jpg, third.jpg, fourth.jpg
    unit-2/ … unit-8/ ← unit-5: also ground-alt.jpg
  finishes/
    brisa/
    noir/
  team/               ← tj.jpg, nicole.jpg, etc.
  logos/              ← logo-gold.svg, logo-white.svg, logo-dark.svg
  neighborhood/       ← static-map-fallback.jpg
/public/pdfs/
  floorplans/         ← Unit_1_Floorplan.pdf … Unit_8_Floorplan.pdf
  finishes/           ← Brisa_Finishes.pdf, Noir_Finishes.pdf
```

**Performance requirement:** Hero images must be ≤200KB each, WebP format. Optimize with Squoosh or ImageOptim before adding.

---

## Deployment

Deployment is automatic via Vercel. Every push to `main` triggers a production deploy (~30 seconds).

### First Deploy Setup

1. Connect repo to Vercel
2. Add all environment variables in Vercel dashboard (Settings → Environment Variables)
3. Set Vercel Analytics to enabled
4. Point `casaavenidadelray.com` DNS A record to Vercel when ready

### Google Maps API Key

The Maps API key must be domain-restricted to `casaavenidadelray.com` in Google Cloud Console to prevent unauthorized usage. Never expose this key client-side without the domain restriction in place.

---

## Forms

The contact form at `/contact` posts to `/api/contact`. On submission:

1. Validates server-side (honeypot check, reCAPTCHA v3 score, rate limit)
2. Sends email notification via Resend
3. Logs lead to Google Sheet via webhook
4. Redirects user to `/thank-you`

The newsletter subscribe form (news pages) posts to `/api/subscribe`, which adds the email to the configured MailerLite group.

---

## Security

- All API keys in Vercel environment variables — never in code
- Rate limiting on `/api/contact`: 20 requests/minute/IP via Edge middleware
- reCAPTCHA v3 invisible — no checkbox friction for users
- Honeypot field on contact form — catches basic bots
- `X-Frame-Options: SAMEORIGIN` on all pages except virtual tour
- Custom 404/500 pages — no stack traces exposed
- `npm audit` runs in GitHub Actions on every push

---

## Legal

All pages include the Douglas Elliman disclaimer in the footer. Full legal text lives at `/legal/disclaimer`.

The privacy policy at `/legal/privacy-policy` must be reviewed by an attorney before the site goes live.

Pre-construction disclaimer appears on all unit pages and under rendering images, per Florida Statute 718.503.

---

## Browser Support

- Chrome 90+, Firefox 90+, Safari 14+, Edge 90+
- Mobile: iOS Safari 14+, Chrome Android 90+
- Animations degrade gracefully for `prefers-reduced-motion`

---

## Key Contacts

**Sales**
- TJ Verdiglione, Douglas Elliman
- Nicole Melveney, Douglas Elliman

**Development**
- Kastelo & 4TRO

**Architecture**
- RWB-Linares Architecture

**Interiors**
- Stef Leonel Interior Design
- Ava Gray Interiors

---

## License

Private. All rights reserved. Unauthorized reproduction or distribution prohibited.

© Casa Avenida / Kastelo & 4TRO

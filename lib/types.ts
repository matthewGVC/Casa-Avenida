// ─────────────────────────────────────────────
// Casa Avenida — TypeScript Interfaces
// Single source of truth for all data shapes
// ─────────────────────────────────────────────

// ── Unit ────────────────────────────────────

export type UnitStatus = "available" | "under-contract" | "sold";
export type FinishPackage = "brisa" | "noir";

export interface FloorImages {
  ground: string;
  second: string;
  third: string;
  fourth: string;
  groundAlt?: string; // Unit 5: Alt.2 ground floor variant
}

export interface FloorSummaries {
  ground: string;  // "Garage, Foyer, Bedroom"
  second: string;
  third: string;
  fourth: string;
}

export interface Unit {
  id: string;                      // "unit-1" through "unit-8"
  name: string;                    // "Unit One"
  tagline: string;                 // "Corner residence with pool garden and rooftop terrace"
  gsf: number;                     // Total gross SF
  underAirSF: number;
  exteriorSF: number;
  bedrooms: number;
  bathrooms: number;
  levels: number;                  // Always 4
  status: UnitStatus;
  priceDisplay: "INQUIRE FOR PRICING";
  description: string;             // 2-3 sentence editorial copy
  features: string[];
  floorImages: FloorImages;
  floorSummaries: FloorSummaries;
  allFloorsImage: string;          // Combined info-tab WebP (all floors on one image)
  floorplanPdf: string;            // Path to handout PDF
  allFloorsPdf: string;            // Path to all-floors PDF
  heroImage: string;               // Primary render
  galleryImages: string[];
  finishPackages: FinishPackage[];
  groundFloorAlternates?: number;  // Unit 5: 2
}

// ── Gallery ─────────────────────────────────

export type GalleryCategory =
  | "interiors"
  | "kitchen"
  | "primary-suite"
  | "living"
  | "terrace"
  | "pool"
  | "rooftop"
  | "exterior";

export type FinishContext = "brisa" | "noir" | "both" | null;

export interface GalleryImage {
  id: string;
  filename: string;         // Relative to /images/gallery/
  title: string;            // Always present — shown as caption
  category: GalleryCategory;
  alt: string;
  unit?: string;            // Optional: "unit-1"
  finishContext?: FinishContext; // Which finish package this render represents
}

// ── Agent ────────────────────────────────────

export interface Agent {
  id: string;
  name: string;
  title: string;
  company: string;          // "Douglas Elliman"
  phone: string;
  email: string;
  headshot: string;         // Path to headshot image
  bio: string;
  // No WhatsApp field — by design
}

// ── Construction Timeline ────────────────────

export interface Milestone {
  label: string;            // "Foundation"
  date?: string;            // "Q3 2025" — optional
  completed: boolean;
}

export interface ConstructionTimeline {
  milestones: Milestone[];
  currentPhase: string;    // Label of current active milestone
  completionDate: string;  // "Q2 2027"
}

// ── Settings ────────────────────────────────

export interface SocialLinks {
  instagram: string;        // Leave "" until URLs provided
  facebook: string;
  linkedin: string;
}

export interface SiteSettings {
  siteName: string;
  address: string;
  phone: string;
  email: string;
  completionDate: string;
  priceFrom: string;
  agents: Agent[];
  social: SocialLinks;
  disclaimer: string;       // Full Douglas Elliman disclaimer
  constructionTimeline: ConstructionTimeline;
}

// ── Neighborhood / POI ───────────────────────

export type POICategory =
  | "restaurant"
  | "hotel"
  | "beach"
  | "fitness"
  | "grocery"
  | "entertainment";

export interface POI {
  id: string;
  name: string;
  category: POICategory;
  lat: number;
  lng: number;
  distanceText: string;     // "1 block", "5 min walk"
  description?: string;
}

// ── Finishes ─────────────────────────────────

export interface SwatchItem {
  name: string;
  image: string;
  description?: string;
}

export interface SwatchCategory {
  category: string;         // "Flooring", "Cabinetry", "Countertops", etc.
  items: SwatchItem[];
}

export interface FinishesPackage {
  id: FinishPackage;
  name: string;             // "Brisa" or "Noir"
  tagline: string;
  description: string;
  heroImage: string;
  swatches: SwatchCategory[];
  pdf: string;              // Path to tear sheet PDF
}

// ── Team ────────────────────────────────────

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  company: string;
  role: string;             // "Architecture", "Interior Design", "Development"
  bio: string;
  image: string;
  website?: string;
}

// ── News / Articles ──────────────────────────

export type ArticleTag = "Market Updates" | "Lifestyle" | "Development Progress";

export interface Article {
  slug: string;
  title: string;
  excerpt: string;          // 2-line excerpt for card
  date: string;             // ISO date string
  coverImage: string;
  tags: ArticleTag[];
}

// ── Image Manifest ───────────────────────────

export interface ImageManifest {
  logos: {
    gold: string;
    white: string;
    dark: string;
    monogram: string;       // "A" monogram for pins, favicon
  };
  ogDefault: string;
  teamPhotos: {
    gvcTeam: string;
    headerTeam: string;
    kastelo: string;
  };
}

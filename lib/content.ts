// ─────────────────────────────────────────────
// Casa Avenida — Content Loader Utilities
// Server-side only — reads JSON flat files
// ─────────────────────────────────────────────

import type {
  Unit,
  GalleryImage,
  GalleryCategory,
  SiteSettings,
  POI,
  POICategory,
  FinishesPackage,
  TeamMember,
  Article,
  ArticleTag,
  ImageManifest,
} from "./types";

import unitsData from "@/content/units.json";
import galleryData from "@/content/gallery.json";
import settingsData from "@/content/settings.json";
import neighborhoodData from "@/content/neighborhood.json";
import finishesData from "@/content/finishes.json";
import teamData from "@/content/team.json";
import newsData from "@/content/news.json";
import imagesData from "@/content/images.json";

// ── Units ────────────────────────────────────

export function getUnits(): Unit[] {
  return unitsData as Unit[];
}

export function getUnit(id: string): Unit | null {
  const units = getUnits();
  return units.find((u) => u.id === id) ?? null;
}

export function getAvailableUnits(): Unit[] {
  return getUnits().filter((u) => u.status === "available");
}

// ── Gallery ──────────────────────────────────

export function getGalleryImages(): GalleryImage[] {
  return galleryData as GalleryImage[];
}

export function getGalleryByCategory(category: GalleryCategory): GalleryImage[] {
  return getGalleryImages().filter((img) => img.category === category);
}

export function getGalleryCategories(): GalleryCategory[] {
  const all = getGalleryImages().map((img) => img.category);
  return Array.from(new Set(all));
}

export function getGalleryPreview(count = 6): GalleryImage[] {
  // Return a varied selection: prioritize exteriors first, then mix finishes
  const images = getGalleryImages();
  const exteriors = images.filter((img) => img.category === "exterior");
  const rest = images.filter((img) => img.category !== "exterior");
  return [...exteriors, ...rest].slice(0, count);
}

// ── Settings ─────────────────────────────────

export function getSettings(): SiteSettings {
  return settingsData as SiteSettings;
}

export function getDisclaimer(): string {
  return getSettings().disclaimer;
}

export function getAgents() {
  return getSettings().agents;
}

export function getConstructionTimeline() {
  return getSettings().constructionTimeline;
}

// ── Neighborhood ─────────────────────────────

export function getPOIs(): POI[] {
  return neighborhoodData as POI[];
}

export function getPOIsByCategory(category: POICategory): POI[] {
  return getPOIs().filter((poi) => poi.category === category);
}

export function getPOICategories(): POICategory[] {
  const all = getPOIs().map((poi) => poi.category);
  return Array.from(new Set(all));
}

// ── Finishes ─────────────────────────────────

export function getFinishesPackages(): FinishesPackage[] {
  return finishesData as FinishesPackage[];
}

export function getFinishesPackage(id: "brisa" | "noir"): FinishesPackage | null {
  return getFinishesPackages().find((p) => p.id === id) ?? null;
}

// ── Team ─────────────────────────────────────

export function getTeamMembers(): TeamMember[] {
  return teamData as TeamMember[];
}

export function getSalesAgents(): TeamMember[] {
  return getTeamMembers().filter((m) => m.role === "Sales");
}

export function getDesignTeam(): TeamMember[] {
  return getTeamMembers().filter(
    (m) => m.role === "Architecture" || m.role === "Interior Design"
  );
}

export function getDevelopmentTeam(): TeamMember[] {
  return getTeamMembers().filter((m) => m.role === "Development");
}

// ── News ─────────────────────────────────────

export function getArticles(): Article[] {
  const articles = newsData as Article[];
  // Sort newest first
  return [...articles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getArticle(slug: string): Article | null {
  return getArticles().find((a) => a.slug === slug) ?? null;
}

export function getArticlesByTag(tag: ArticleTag): Article[] {
  return getArticles().filter((a) => a.tags.includes(tag));
}

export function getArticleSlugs(): string[] {
  return getArticles().map((a) => a.slug);
}

// ── Images ───────────────────────────────────

export function getImageManifest(): ImageManifest {
  return {
    logos: imagesData.logos as ImageManifest["logos"],
    ogDefault: imagesData.ogDefault,
    teamPhotos: imagesData.teamPhotos as ImageManifest["teamPhotos"],
  };
}

export function getHeroImages(): string[] {
  return imagesData.hero;
}

export function getFloorplanInfoTab(unitId: string): string {
  const tabs = imagesData.floorplanInfoTabs as Record<string, string>;
  return tabs[unitId] ?? "";
}

/**
 * Resolves the full public src path for a gallery image.
 * Accounts for the subdirectory structure:
 *   Brisa renders → /images/gallery/Brisa Finishes/
 *   Noir renders  → /images/gallery/Noir Finishes/
 *   Exteriors     → /images/gallery/
 */
export function getGalleryImageSrc(img: GalleryImage): string {
  const base = "/images/gallery";
  if (img.finishContext === "brisa") {
    return encodeImagePath(`${base}/Brisa Finishes/${img.filename}`);
  }
  if (img.finishContext === "noir") {
    return encodeImagePath(`${base}/Noir Finishes/${img.filename}`);
  }
  return encodeImagePath(`${base}/${img.filename}`);
}

// ── Helpers ───────────────────────────────────

/**
 * Encodes a local image path for safe use as an HTML/HTTP src attribute.
 * Encodes each path segment individually, preserving the leading slash and
 * all directory separators. This handles file names and folder names that
 * contain spaces, parentheses, or other characters that are invalid in URLs.
 *
 * Example: "/images/gallery/Brisa Finishes/Living Angle 1.jpg"
 *       →  "/images/gallery/Brisa%20Finishes/Living%20Angle%201.jpg"
 */
export function encodeImagePath(path: string): string {
  if (!path) return path;
  // Split on '/', encode each segment, rejoin. Leading '/' produces an empty
  // first element which encodeURIComponent('') returns as '' — so the slash
  // structure is preserved correctly.
  return path
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");
}

/**
 * Format a phone number for display: +15617993000 → (561) 799-3000
 */
export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    const d = digits.slice(1);
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return raw;
}

/**
 * Format SF with comma: 3100 → "3,100"
 */
export function formatSF(sf: number): string {
  return sf.toLocaleString("en-US");
}

/**
 * Derive a blur data URL placeholder for missing images.
 * Returns a 1x1 pixel Lunar (#373A36) in base64.
 */
export const BLUR_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

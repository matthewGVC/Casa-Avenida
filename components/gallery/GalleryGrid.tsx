"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import type { GalleryImage, GalleryCategory } from "@/lib/types";
import { getGalleryImageSrc } from "@/lib/content";
import Lightbox from "@/components/gallery/Lightbox";
import ScrollFade from "@/components/animations/ScrollFade";

interface GalleryGridProps {
  images: GalleryImage[];
}

type Collection = "brisa" | "noir" | "exterior";

const COLLECTION_LABELS: Record<Collection, string> = {
  brisa: "Brisa",
  noir: "Noir",
  exterior: "Exterior",
};

const COLLECTION_DESCRIPTIONS: Record<Collection, string> = {
  brisa:
    "Warm, organic tones — white oak, aged brass, textured limestone. Light meets material in a residence that feels like southern European summer.",
  noir:
    "Dramatic contrasts — smoked oak, matte black fixtures, veined charcoal stone. A darker, more cinematic palette for the discerning collector.",
  exterior:
    "Architecture and context — the development's presence along SE 5th Ave, one block from Atlantic Avenue.",
};

const CATEGORY_LABELS: Record<GalleryCategory | "all", string> = {
  all: "All",
  interiors: "Interiors",
  kitchen: "Kitchen",
  "primary-suite": "Primary Suite",
  living: "Living",
  terrace: "Terrace",
  pool: "Pool",
  rooftop: "Rooftop",
  exterior: "Exterior",
};

/**
 * Gallery grid with primary Brisa / Noir / Exterior collection toggle.
 * Only one collection is shown at a time.
 * Within each collection, subcategory filter pills are available.
 * Click any image → fullscreen lightbox with keyboard + swipe navigation.
 */
export default function GalleryGrid({ images }: GalleryGridProps) {
  const [activeCollection, setActiveCollection] = useState<Collection>("brisa");
  const [activeCategory, setActiveCategory] = useState<GalleryCategory | "all">("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Images for the active collection
  const collectionImages = useMemo(() => {
    if (activeCollection === "exterior") {
      return images.filter(
        (img) => img.category === "exterior" || !img.finishContext
      );
    }
    return images.filter((img) => img.finishContext === activeCollection);
  }, [images, activeCollection]);

  // Unique subcategories within the active collection (excluding "exterior" for interior collections)
  const subcategories = useMemo<(GalleryCategory | "all")[]>(() => {
    if (activeCollection === "exterior") return [];
    const cats = Array.from(
      new Set(
        collectionImages
          .map((img) => img.category)
          .filter((c) => c !== "exterior")
      )
    ) as GalleryCategory[];
    return cats.length > 1 ? ["all", ...cats] : [];
  }, [collectionImages, activeCollection]);

  // Filtered images (by subcategory, within collection)
  const filtered = useMemo(() => {
    if (activeCollection === "exterior" || activeCategory === "all") {
      return collectionImages;
    }
    return collectionImages.filter((img) => img.category === activeCategory);
  }, [collectionImages, activeCollection, activeCategory]);

  // Switch collection → reset subcategory filter
  const handleCollectionChange = (col: Collection) => {
    setActiveCollection(col);
    setActiveCategory("all");
    setLightboxIndex(null);
  };

  return (
    <>
      {/* ── Collection toggle ─────────────────────────────────────── */}
      <div className="mb-10">
        {/* Pill selector */}
        <div className="flex items-center gap-1 mb-6 border border-white/10 rounded-full p-1 w-fit">
          {(["brisa", "noir", "exterior"] as Collection[]).map((col) => (
            <button
              key={col}
              onClick={() => handleCollectionChange(col)}
              aria-pressed={activeCollection === col}
              className={[
                "px-6 py-2 rounded-full font-heading text-xs tracking-[0.12em] transition-all duration-300",
                activeCollection === col
                  ? "bg-sapling text-lunar"
                  : "text-white/50 hover:text-white",
              ].join(" ")}
            >
              {COLLECTION_LABELS[col].toUpperCase()}
            </button>
          ))}
        </div>

        {/* Collection descriptor */}
        <ScrollFade key={activeCollection}>
          <p className="font-body text-white/50 text-sm max-w-2xl leading-relaxed">
            {COLLECTION_DESCRIPTIONS[activeCollection]}
          </p>
        </ScrollFade>
      </div>

      {/* ── Subcategory filter (interior collections only) ─────────── */}
      {subcategories.length > 0 && (
        <ScrollFade className="mb-8">
          <div className="flex flex-wrap gap-2">
            {subcategories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setLightboxIndex(null);
                }}
                aria-pressed={activeCategory === cat}
                className={[
                  "px-4 py-1.5 border font-heading text-[10px] tracking-[0.1em] transition-all duration-200",
                  activeCategory === cat
                    ? "border-sapling text-sapling bg-sapling/10"
                    : "border-white/20 text-white/40 hover:border-white/40 hover:text-white/70",
                ].join(" ")}
              >
                {CATEGORY_LABELS[cat].toUpperCase()}
              </button>
            ))}
          </div>
        </ScrollFade>
      )}

      {/* ── Image count ───────────────────────────────────────────── */}
      <p className="font-heading text-white/25 text-[10px] tracking-[0.12em] mb-6">
        {filtered.length} {filtered.length === 1 ? "IMAGE" : "IMAGES"}
      </p>

      {/* ── Masonry grid ──────────────────────────────────────────── */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-3 space-y-3">
        {filtered.map((img, i) => (
          <div key={img.id} className="break-inside-avoid">
            <ScrollFade delay={Math.min(i * 40, 400)}>
              <button
                className="relative block w-full overflow-hidden group text-left"
                onClick={() => setLightboxIndex(i)}
                aria-label={`Open ${img.title} in lightbox`}
              >
                <div className="relative w-full aspect-[4/3] bg-[#373A36]">
                  <Image
                    src={getGalleryImageSrc(img)}
                    alt={img.alt}
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    placeholder="empty"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    loading="lazy"
                  />
                </div>

                {/* Permanent caption — always visible */}
                <div className="absolute bottom-0 left-0 right-0 bg-lunar/75 backdrop-blur-sm px-3 py-2">
                  <p className="font-body text-white text-xs leading-snug truncate">
                    {img.title}
                  </p>
                </div>
              </button>
            </ScrollFade>
          </div>
        ))}
      </div>

      {/* ── Empty state ───────────────────────────────────────────── */}
      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="font-body text-white/30 text-sm">
            No images in this category.
          </p>
        </div>
      )}

      {/* ── Lightbox ──────────────────────────────────────────────── */}
      {lightboxIndex !== null && (
        <Lightbox
          images={filtered}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  );
}

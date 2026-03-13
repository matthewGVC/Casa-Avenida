"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import type { GalleryImage, GalleryCategory } from "@/lib/types";
import { getGalleryImageSrc, BLUR_DATA_URL } from "@/lib/content";
import CategoryFilter from "@/components/gallery/CategoryFilter";
import Lightbox from "@/components/gallery/Lightbox";
import ScrollFade from "@/components/animations/ScrollFade";

interface GalleryGridProps {
  images: GalleryImage[];
}

/**
 * Filterable masonry gallery grid with lightbox.
 * Category filter pills at top.
 * Permanent caption bars on every image (not hover-only).
 * Click image → full-screen lightbox with ← → navigation.
 */
export default function GalleryGrid({ images }: GalleryGridProps) {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory | "all">("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Derive unique categories from data
  const categories = useMemo<(GalleryCategory | "all")[]>(() => {
    const cats = Array.from(new Set(images.map((img) => img.category)));
    return ["all", ...cats] as (GalleryCategory | "all")[];
  }, [images]);

  // Filtered images
  const filtered = useMemo(
    () =>
      activeCategory === "all"
        ? images
        : images.filter((img) => img.category === activeCategory),
    [images, activeCategory]
  );

  // When lightbox is open, use filtered array for navigation
  const openLightbox = (filteredIndex: number) => setLightboxIndex(filteredIndex);

  return (
    <>
      {/* Filter */}
      <ScrollFade className="mb-8">
        <CategoryFilter
          categories={categories}
          active={activeCategory}
          onChange={(cat) => {
            setActiveCategory(cat);
            setLightboxIndex(null);
          }}
        />
      </ScrollFade>

      {/* Count */}
      <p className="font-heading text-white/30 text-[10px] tracking-heading mb-6">
        {filtered.length} {filtered.length === 1 ? "IMAGE" : "IMAGES"}
      </p>

      {/* Masonry grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-3 space-y-3">
        {filtered.map((img, i) => (
          <div key={img.id} className="break-inside-avoid">
            <ScrollFade delay={Math.min(i * 40, 400)}>
              <button
                className="relative block w-full overflow-hidden group text-left"
                onClick={() => openLightbox(i)}
                aria-label={`Open ${img.title} in lightbox`}
              >
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src={getGalleryImageSrc(img)}
                    alt={img.alt}
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
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

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="font-body text-white/30 text-sm">No images in this category.</p>
        </div>
      )}

      {/* Lightbox */}
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

"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/lib/types";
import { getGalleryImageSrc, BLUR_DATA_URL } from "@/lib/content";

interface LightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

/**
 * Full-screen lightbox.
 * ESC closes, ← → navigate, swipe on mobile.
 * Image counter, caption always visible.
 */
export default function Lightbox({ images, currentIndex, onClose, onNavigate }: LightboxProps) {
  const total = images.length;
  const current = images[currentIndex];

  const prev = useCallback(() => {
    onNavigate((currentIndex - 1 + total) % total);
  }, [currentIndex, total, onNavigate]);

  const next = useCallback(() => {
    onNavigate((currentIndex + 1) % total);
  }, [currentIndex, total, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose, prev, next]);

  // Scroll lock
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Touch swipe
  let touchStartX = 0;
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) { if (delta > 0) next(); else prev(); }
  };

  if (!current) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Image lightbox — ${current.title}`}
      className="fixed inset-0 z-50 bg-black/95 flex flex-col"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 shrink-0">
        <span className="font-heading text-white/40 text-[10px] tracking-heading">
          {currentIndex + 1} / {total}
        </span>
        <button
          onClick={onClose}
          aria-label="Close lightbox"
          className="text-white/40 hover:text-sapling transition-colors duration-200 p-2"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Image area */}
      <div className="relative flex-1 flex items-center justify-center px-16">
        {/* Prev */}
        <button
          onClick={prev}
          aria-label="Previous image"
          className="absolute left-4 lg:left-6 text-white/40 hover:text-sapling transition-colors duration-200 p-3"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Image */}
        <div className="relative w-full h-full max-w-5xl">
          <Image
            key={current.id}
            src={getGalleryImageSrc(current)}
            alt={current.alt}
            fill
            className="object-contain"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            sizes="100vw"
            priority
          />
        </div>

        {/* Next */}
        <button
          onClick={next}
          aria-label="Next image"
          className="absolute right-4 lg:right-6 text-white/40 hover:text-sapling transition-colors duration-200 p-3"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Caption */}
      <div className="px-6 py-4 shrink-0 text-center">
        <p className="font-body text-white/70 text-sm">{current.title}</p>
        {current.unit && (
          <p className="font-heading text-white/30 text-[10px] tracking-heading mt-1">
            {current.unit.replace("unit-", "UNIT ").toUpperCase()}
          </p>
        )}
      </div>
    </div>
  );
}

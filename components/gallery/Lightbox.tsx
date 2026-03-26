"use client";

import { useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import type { GalleryImage } from "@/lib/types";
import { getGalleryImageSrc } from "@/lib/content";

interface LightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

/**
 * Full-screen lightbox.
 * ESC closes, left/right navigate, swipe on mobile.
 * Image counter and caption always visible.
 * Backdrop fades in; image scales from 0.97 on open/change.
 */
export default function Lightbox({ images, currentIndex, onClose, onNavigate }: LightboxProps) {
  const total = images.length;
  const current = images[currentIndex];
  const touchStartX = useRef(0);

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

  // iOS-safe scroll lock
  useEffect(() => {
    const scrollY = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) {
      if (delta > 0) next();
      else prev();
    }
  };

  if (!current) return null;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Image lightbox - ${current.title}`}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ backgroundColor: "rgba(0,0,0,0.96)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
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
            <path
              d="M4 4L16 16M16 4L4 16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Image area */}
      <div className="relative flex-1 min-h-0 flex items-center justify-center px-16">
        {/* Prev */}
        <button
          onClick={prev}
          aria-label="Previous image"
          className="absolute left-4 lg:left-6 z-10 text-white/40 hover:text-sapling transition-colors duration-200 p-3"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M15 19L8 12L15 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Image - no background box; floats cleanly on the dark overlay */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            className="relative w-full h-full"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.18 }}
          >
            <Image
              src={getGalleryImageSrc(current)}
              alt={current.alt}
              fill
              className="object-contain"
              placeholder="empty"
              sizes="100vw"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Next */}
        <button
          onClick={next}
          aria-label="Next image"
          className="absolute right-4 lg:right-6 z-10 text-white/40 hover:text-sapling transition-colors duration-200 p-3"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M9 5L16 12L9 19"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
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
    </motion.div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import type { GalleryImage } from "@/lib/types";
import { getGalleryImageSrc } from "@/lib/content";

interface LightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function Lightbox({ images, currentIndex, onClose, onNavigate }: LightboxProps) {
  const total = images.length;
  const current = images[currentIndex];
  const touchStartX = useRef(0);
  const [mounted, setMounted] = useState(false);

  // Mount portal after hydration
  useEffect(() => { setMounted(true); }, []);

  const prev = () => onNavigate((currentIndex - 1 + total) % total);
  const next = () => onNavigate((currentIndex + 1) % total);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Scroll lock
  useEffect(() => {
    const y = window.scrollY;
    document.body.style.cssText = `overflow:hidden;position:fixed;top:-${y}px;width:100%;`;
    return () => {
      document.body.style.cssText = "";
      window.scrollTo(0, y);
    };
  }, []);

  // Touch swipe
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const d = touchStartX.current - e.changedTouches[0].clientX;
    if (d > 50) next();
    else if (d < -50) prev();
  };

  if (!mounted || !current) return null;

  const content = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={current.title}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "rgba(0,0,0,0.95)",
        display: "flex",
        flexDirection: "column",
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Top bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", flexShrink: 0 }}>
        <span style={{ fontFamily: "var(--font-raleway)", fontSize: 10, letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)" }}>
          {currentIndex + 1} / {total}
        </span>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 8, color: "rgba(255,255,255,0.5)", lineHeight: 0 }}
          onMouseEnter={e => (e.currentTarget.style.color = "#DFD1A7")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Image area — flex center, image constrained by viewport */}
      <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 0, padding: "0 64px" }}>

        {/* Prev */}
        <button
          onClick={prev}
          aria-label="Previous"
          style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 12, color: "rgba(255,255,255,0.4)", lineHeight: 0, zIndex: 1 }}
          onMouseEnter={e => (e.currentTarget.style.color = "#DFD1A7")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Image — plain img, max-constrained, always centered */}
        <AnimatePresence mode="wait">
          <motion.img
            key={current.id}
            src={getGalleryImageSrc(current)}
            alt={current.alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              display: "block",
              maxWidth: "100%",
              maxHeight: "calc(100vh - 140px)",
              width: "auto",
              height: "auto",
              objectFit: "contain",
            }}
          />
        </AnimatePresence>

        {/* Next */}
        <button
          onClick={next}
          aria-label="Next"
          style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 12, color: "rgba(255,255,255,0.4)", lineHeight: 0, zIndex: 1 }}
          onMouseEnter={e => (e.currentTarget.style.color = "#DFD1A7")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Caption */}
      <div style={{ padding: "12px 24px 20px", flexShrink: 0, textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-afacad)", fontSize: 14, color: "rgba(255,255,255,0.65)", margin: 0 }}>
          {current.title}
        </p>
        {current.unit && (
          <p style={{ fontFamily: "var(--font-raleway)", fontSize: 10, letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", marginTop: 4 }}>
            {current.unit.replace("unit-", "UNIT ").toUpperCase()}
          </p>
        )}
      </div>
    </div>
  );

  return createPortal(content, document.body);
}

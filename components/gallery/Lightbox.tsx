"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { GalleryImage } from "@/lib/types";
import { getGalleryImageSrc } from "@/lib/content";

interface LightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function Lightbox({ images, currentIndex, onClose, onNavigate }: LightboxProps) {
  const [mounted, setMounted] = useState(false);
  const touchStartX = useRef(0);
  const total = images.length;
  const current = images[currentIndex];

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNavigate((currentIndex - 1 + total) % total);
      if (e.key === "ArrowRight") onNavigate((currentIndex + 1) % total);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  if (!mounted || !current) return null;

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.92)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
      onTouchEnd={e => {
        const d = touchStartX.current - e.changedTouches[0].clientX;
        if (d > 50) onNavigate((currentIndex + 1) % total);
        else if (d < -50) onNavigate((currentIndex - 1 + total) % total);
      }}
    >
      {/* Image + caption bar */}
      <div
        onClick={e => e.stopPropagation()}
        style={{ position: "relative", lineHeight: 0, maxWidth: "90vw", maxHeight: "90vh" }}
      >
        <img
          src={getGalleryImageSrc(current)}
          alt={current.alt}
          style={{
            display: "block",
            maxWidth: "90vw",
            maxHeight: "90vh",
            width: "auto",
            height: "auto",
            objectFit: "contain",
            userSelect: "none",
          }}
        />
        <div style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          background: "rgba(55,58,54,0.82)",
          backdropFilter: "blur(6px)",
          padding: "8px 12px",
        }}>
          <p style={{
            fontFamily: "var(--font-afacad)",
            fontSize: 13,
            lineHeight: "normal",
            color: "rgba(255,255,255,0.9)",
            margin: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
            {current.title}
          </p>
        </div>
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Close"
        style={{
          position: "fixed", top: 20, right: 20,
          background: "none", border: "none", cursor: "pointer",
          color: "rgba(255,255,255,0.6)", padding: 8, lineHeight: 0,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M4 4L18 18M18 4L4 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Prev */}
      <button
        onClick={e => { e.stopPropagation(); onNavigate((currentIndex - 1 + total) % total); }}
        aria-label="Previous"
        style={{
          position: "fixed", left: 20, top: "50%", transform: "translateY(-50%)",
          background: "none", border: "none", cursor: "pointer",
          color: "rgba(255,255,255,0.6)", padding: 12, lineHeight: 0,
        }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M18 22L10 14L18 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Next */}
      <button
        onClick={e => { e.stopPropagation(); onNavigate((currentIndex + 1) % total); }}
        aria-label="Next"
        style={{
          position: "fixed", right: 20, top: "50%", transform: "translateY(-50%)",
          background: "none", border: "none", cursor: "pointer",
          color: "rgba(255,255,255,0.6)", padding: 12, lineHeight: 0,
        }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M10 6L18 14L10 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Counter */}
      <div style={{
        position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
        fontFamily: "var(--font-raleway)", fontSize: 10, letterSpacing: "0.1em",
        color: "rgba(255,255,255,0.35)",
      }}>
        {currentIndex + 1} / {total}
      </div>
    </div>,
    document.body
  );
}

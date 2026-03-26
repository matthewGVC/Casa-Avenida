"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { encodeImagePath } from "@/lib/content";

interface HeroCarouselProps {
  images: string[];
}

const INTERVAL = 8000;   // ms between slides
const FADE_MS  = 1500;   // crossfade duration

/**
 * Full-viewport image crossfade with per-slide Ken Burns zoom.
 * When no images are provided, shows a branded dark placeholder.
 */
export default function HeroCarousel({ images }: HeroCarouselProps) {
  const [current, setCurrent]   = useState(0);
  const [fading, setFading]     = useState(false);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % images.length);
        setFading(false);
      }, FADE_MS);
    }, INTERVAL);

    return () => clearInterval(timer);
  }, [images.length]);

  if (images.length === 0) {
    return <ImagePlaceholder className="absolute inset-0" />;
  }

  return (
    <>
      {images.map((src, i) => {
        const isActive  = i === current;
        const isVisible = isActive;

        return (
          <div
            key={src}
            aria-hidden={!isActive}
            className="absolute inset-0 transition-opacity"
            style={{
              opacity: isVisible ? (fading ? 0 : 1) : 0,
              transitionDuration: `${FADE_MS}ms`,
              zIndex: isActive ? 1 : 0,
            }}
          >
            <Image
              src={encodeImagePath(src)}
              alt=""
              fill
              priority={i === 0}
              className={`object-cover ${isActive ? "ken-burns" : ""}`}
              placeholder="empty"
              sizes="100vw"
            />
          </div>
        );
      })}
    </>
  );
}

"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "motion/react";
import Link from "next/link";
import HeroCarousel from "./HeroCarousel";
import MagneticButton from "@/components/animations/MagneticButton";

interface HeroSectionProps {
  images: string[];
}

/**
 * Full-viewport hero:
 * - Image crossfade carousel with Ken Burns zoom
 * - CSS grain overlay (applied globally in layout)
 * - Scroll-linked headline: scales up + fades out on scroll
 * - "EXPLORE RESIDENCES" magnetic CTA pill
 */
export default function HeroSection({ images }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity   = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale     = useTransform(scrollYProgress, [0, 0.5], [1, 1.08]);
  const translateY = useTransform(scrollYProgress, [0, 0.5], [0, -40]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen min-h-[600px] overflow-hidden bg-lunar"
      aria-label="Hero"
    >
      {/* Image carousel */}
      <HeroCarousel images={images} />

      {/* Dark gradient overlay — bottom fade for legibility */}
      <div
        className="absolute inset-0 z-10 bg-gradient-to-b from-black/30 via-transparent to-black/60"
        aria-hidden="true"
      />

      {/* Scroll-linked content */}
      <motion.div
        style={{ opacity, scale, y: translateY }}
        className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center"
      >
        {/* Tagline above logo */}
        <p className="font-heading text-white/50 text-xs tracking-[0.3em] mb-6 select-none">
          DELRAY BEACH · 2027
        </p>

        {/* Main headline */}
        <h1 className="font-display text-sapling text-[clamp(3rem,10vw,9rem)] leading-none mb-8 select-none">
          CASA AVENIDA
        </h1>

        {/* CTA */}
        <MagneticButton strength={4} radius={40}>
          <Link
            href="/residences"
            className="btn-sweep font-heading text-xs tracking-nav px-8 py-4 border border-sapling text-sapling hover:text-lunar transition-colors duration-300"
          >
            EXPLORE RESIDENCES
          </Link>
        </MagneticButton>
      </motion.div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="font-heading text-white/30 text-[9px] tracking-widest">SCROLL</span>
        <div className="w-px h-8 bg-gradient-to-b from-sapling/60 to-transparent" />
      </div>
    </section>
  );
}

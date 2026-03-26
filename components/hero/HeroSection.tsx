"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
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

      {/* Dual gradient overlay — strong top for nav legibility, bottom for content */}
      <div
        className="absolute inset-0 z-10 bg-gradient-to-b from-black/55 via-transparent to-black/65"
        aria-hidden="true"
      />

      {/* Radial vignette — softens center of image behind content, no hard edges */}
      <div
        className="hero-radial-vignette absolute inset-0 z-[15] pointer-events-none"
        aria-hidden="true"
      />

      {/* Scroll-linked content */}
      <motion.div
        style={{ opacity, scale, y: translateY }}
        className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center"
      >
        {/* Tagline above logo */}
        <p className="font-heading text-white/50 text-xs tracking-[0.3em] mb-8 select-none">
          DELRAY BEACH · 2027
        </p>

        {/* Logo — white SVG */}
        <h1 className="mb-10 select-none">
          <Image
            src="/images/logos/casa%20avenida%20logos/Casa%20Avenida%20-%20White.svg"
            alt="Casa Avenida"
            width={480}
            height={120}
            priority
            className="w-[min(480px,80vw)] h-auto"
          />
        </h1>

        {/* CTA */}
        <MagneticButton strength={4} radius={40}>
          <Link
            href="/residences"
            className="btn-sweep inline-flex items-center font-heading text-xs tracking-nav px-8 py-4 border border-sapling text-sapling hover:text-lunar transition-colors duration-300"
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

"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Unit } from "@/lib/types";
import Badge from "@/components/ui/Badge";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { encodeImagePath } from "@/lib/content";

interface ResidenceTeaserProps {
  units: Unit[];
}

/**
 * Horizontal drag/swipe scroll of 8 unit cards.
 * Mouse: drag to scroll. Touch: native scroll.
 */
export default function ResidenceTeaser({ units }: ResidenceTeaserProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    const track = trackRef.current;
    if (!track) return;
    isDragging.current = true;
    startX.current = e.pageX - track.offsetLeft;
    scrollLeft.current = track.scrollLeft;
    track.style.cursor = "grabbing";
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    trackRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const onMouseUp = () => {
    isDragging.current = false;
    if (trackRef.current) trackRef.current.style.cursor = "grab";
  };

  return (
    <section className="bg-lunar py-24 lg:py-32 overflow-hidden" aria-labelledby="residences-teaser-heading">
      <div className="px-6 lg:px-12 mb-10">
        <div className="max-w-[1440px] mx-auto flex items-end justify-between gap-4">
          <div>
            <p className="font-heading text-sapling/60 text-xs tracking-heading mb-3">
              THE COLLECTION
            </p>
            <h2
              id="residences-teaser-heading"
              className="font-display text-white text-[clamp(2rem,4vw,3rem)] leading-tight"
            >
              8 RESIDENCES
            </h2>
          </div>
          <Link
            href="/residences"
            className="font-heading text-xs tracking-nav text-sapling border-b border-sapling/40 hover:border-sapling pb-0.5 transition-colors duration-200 shrink-0"
          >
            VIEW ALL
          </Link>
        </div>
      </div>

      {/* Scrollable track */}
      <div
        ref={trackRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        className="flex gap-4 overflow-x-auto scrollbar-none px-6 lg:px-12 cursor-grab select-none"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
      >
        {units.map((unit) => (
          <UnitCard key={unit.id} unit={unit} />
        ))}
        {/* Trailing spacer */}
        <div className="shrink-0 w-6 lg:w-12" aria-hidden="true" />
      </div>

      {/* Scroll hint */}
      <div className="flex items-center justify-center gap-3 mt-8 px-6" aria-hidden="true">
        <div className="w-8 h-px bg-sapling/30" />
        <span className="font-heading text-white/30 text-[9px] tracking-widest">DRAG TO EXPLORE</span>
        <div className="w-8 h-px bg-sapling/30" />
      </div>
    </section>
  );
}

function UnitCard({ unit }: { unit: Unit }) {
  return (
    <Link
      href={`/residences/${unit.id}`}
      className="group relative shrink-0 w-[300px] lg:w-[360px] aspect-[3/4] overflow-hidden bg-lunar block"
      tabIndex={0}
      aria-label={`${unit.name} — ${unit.status}`}
    >
      {/* Background image or placeholder */}
      {unit.heroImage ? (
        <Image
          src={encodeImagePath(unit.heroImage)}
          alt={unit.name}
          fill
          className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
          placeholder="empty"
          sizes="360px"
          draggable={false}
        />
      ) : (
        <ImagePlaceholder className="absolute inset-0" />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-lunar/90 via-lunar/20 to-transparent" />

      {/* Unit number — top left */}
      <div className="absolute top-4 left-5 z-10">
        <span className="font-display text-sapling text-3xl leading-none">
          {unit.id.replace("unit-", "")}
        </span>
      </div>

      {/* Info — bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
        <div className="flex items-end justify-between gap-2 mb-1">
          <p className="font-heading text-white text-sm tracking-heading">
            {unit.name.toUpperCase()}
          </p>
          <Badge variant={unit.status} />
        </div>
        <p className="font-ui text-white/50 text-xs mt-1">
          {unit.gsf.toLocaleString()} SF · {unit.bedrooms} BR
        </p>
        <p className="font-heading text-sapling/70 text-[10px] tracking-heading mt-2 group-hover:text-sapling transition-colors duration-200">
          {unit.priceDisplay}
        </p>
      </div>
    </Link>
  );
}

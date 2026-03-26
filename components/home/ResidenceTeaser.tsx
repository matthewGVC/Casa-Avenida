"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Unit } from "@/lib/types";
import Badge from "@/components/ui/Badge";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { encodeImagePath } from "@/lib/content";
import UnitCardInquireButton from "@/components/units/UnitCardInquireButton";

interface ResidenceTeaserProps {
  units: Unit[];
  allUnits: Unit[];
}

const CARD_W = 340;
const CARD_GAP = 16;
const SCROLL_SPEED = 0.4;

export default function ResidenceTeaser({ units, allUnits }: ResidenceTeaserProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const paused = useRef(false);
  const offset = useRef(0);

  const doubled = [...units, ...units];
  const halfWidth = units.length * (CARD_W + CARD_GAP);

  useEffect(() => {
    const tick = () => {
      if (!paused.current && trackRef.current) {
        offset.current += SCROLL_SPEED;
        if (offset.current >= halfWidth) {
          offset.current = 0;
        }
        trackRef.current.style.transform = "translateX(-" + offset.current + "px)";
      }
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [halfWidth]);

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

      {/* Carousel track — overflow clip on parent, no scroll */}
      <div
        className="relative"
        style={{ overflow: "hidden" }}
        onMouseEnter={() => { paused.current = true; }}
        onMouseLeave={() => { paused.current = false; }}
      >
        <div
          ref={trackRef}
          style={{
            display: "flex",
            gap: CARD_GAP,
            paddingLeft: 48,
            willChange: "transform",
            width: "max-content",
          }}
        >
          {doubled.map((unit, idx) => (
            <UnitCard key={unit.id + "-" + idx} unit={unit} allUnits={allUnits} />
          ))}
        </div>
      </div>
    </section>
  );
}

function UnitCard({ unit, allUnits }: { unit: Unit; allUnits: Unit[] }) {
  return (
    <Link
      href={"/floorplans?unit=" + unit.id}
      className="group relative shrink-0 overflow-hidden bg-lunar block"
      style={{ width: CARD_W, aspectRatio: "3/4" }}
      tabIndex={0}
      aria-label={unit.name + " — " + unit.status}
    >
      {unit.heroImage ? (
        <Image
          src={encodeImagePath(unit.heroImage)}
          alt={unit.name}
          fill
          className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
          placeholder="empty"
          sizes="340px"
          draggable={false}
        />
      ) : (
        <ImagePlaceholder className="absolute inset-0" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-lunar/90 via-lunar/20 to-transparent" />

      <div className="absolute top-4 left-5 z-10">
        <span className="font-display text-sapling text-3xl leading-none">
          {unit.id.replace("unit-", "")}
        </span>
      </div>

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
        <div className="mt-3">
          <UnitCardInquireButton unit={unit} allUnits={allUnits} />
        </div>
      </div>
    </Link>
  );
}

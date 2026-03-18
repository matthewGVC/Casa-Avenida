"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import type { Unit, UnitStatus } from "@/lib/types";
import Badge from "@/components/ui/Badge";
import { encodeImagePath, formatSF } from "@/lib/content";

// ── Types ───────────────────────────────────────────────────────────────────

interface FloorplansViewerProps {
  units: Unit[];
}

// ── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_DOT: Record<UnitStatus, string> = {
  available: "bg-sapling",
  "under-contract": "bg-bahama",
  sold: "bg-white/30",
};

function unitNumber(id: string): string {
  // "unit-1" → "01", "unit-8" → "08"
  const n = id.replace("unit-", "");
  return n.padStart(2, "0");
}

// ── Spec grid items ──────────────────────────────────────────────────────────

interface SpecItem {
  label: string;
  value: string;
}

function buildSpecs(unit: Unit): SpecItem[] {
  return [
    { label: "Total SF", value: formatSF(unit.gsf) },
    { label: "Under Air SF", value: formatSF(unit.underAirSF) },
    { label: "Exterior SF", value: formatSF(unit.exteriorSF) },
    { label: "Bedrooms", value: String(unit.bedrooms) },
    { label: "Bathrooms", value: String(unit.bathrooms) },
    { label: "Levels", value: String(unit.levels) },
  ];
}

const FLOOR_LABELS: Record<string, string> = {
  ground: "Ground",
  second: "Second",
  third: "Third",
  fourth: "Fourth",
};

// ── Component ────────────────────────────────────────────────────────────────

export default function FloorplansViewer({ units }: FloorplansViewerProps) {
  const prefersReducedMotion = useReducedMotion();
  const searchParams = useSearchParams();
  const paramUnit = searchParams.get("unit");
  const initialId =
    paramUnit && units.some((u) => u.id === paramUnit)
      ? paramUnit
      : (units[0]?.id ?? "unit-1");
  const [activeId, setActiveId] = useState<string>(initialId);

  if (!units.length) return null;

  const transition = { duration: prefersReducedMotion ? 0 : 0.3, ease: "easeOut" as const };

  const unit = units.find((u) => u.id === activeId) ?? units[0];

  const hasImage = Boolean(unit.allFloorsImage);
  const encodedSrc = hasImage ? encodeImagePath(unit.allFloorsImage) : "";

  const specs = buildSpecs(unit);
  const floorEntries = (["ground", "second", "third", "fourth"] as const).filter(
    (floor) => unit.floorSummaries?.[floor]
  );

  return (
    <div className="space-y-6">
      {/* ── Unit Selector ─────────────────────────────────────────────── */}
      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Select residence"
      >
        {units.map((u) => {
          const isActive = u.id === activeId;
          return (
            <button
              key={u.id}
              role="tab"
              id={`tab-${u.id}`}
              aria-controls={`floorplan-panel-${u.id}`}
              aria-selected={isActive}
              onClick={() => setActiveId(u.id)}
              className={[
                "inline-flex items-center gap-2 font-heading text-[10px] tracking-heading px-4 py-2 border transition-colors duration-200",
                isActive
                  ? "bg-sapling text-lunar border-sapling"
                  : "border-white/20 text-white/60 hover:border-white/50 hover:text-white",
              ].join(" ")}
            >
              {/* Status dot */}
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_DOT[u.status]}`}
                aria-hidden="true"
              />
              {unitNumber(u.id)}
            </button>
          );
        })}
      </div>

      {/* ── Two-column layout ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6 lg:gap-8">
        {/* ── LEFT: Floorplan Image ──────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
            role="tabpanel"
            id={`floorplan-panel-${unit.id}`}
            aria-labelledby={`tab-${unit.id}`}
            className="relative w-full bg-[#373A36] border border-white/10 overflow-hidden"
          >
            {hasImage ? (
              <div className="relative w-full bg-[#373A36]">
                {/* Overlay controls — positioned over the TransformComponent */}
                <p className="absolute top-3 left-3 z-10 font-heading text-[9px] tracking-[0.25em] text-sapling/35 pointer-events-none select-none">
                  PINCH OR SCROLL TO ZOOM · DRAG TO PAN
                </p>

                <TransformWrapper
                  initialScale={1}
                  minScale={0.5}
                  maxScale={4}
                  centerOnInit
                  wheel={{ step: 0.1 }}
                  pinch={{ step: 5 }}
                >
                  {({ resetTransform }) => (
                    <>
                      <TransformComponent
                        wrapperStyle={{ width: "100%", display: "block" }}
                        contentStyle={{ width: "100%" }}
                      >
                        <Image
                          src={encodedSrc}
                          alt={`${unit.name} — All Floors Floorplan`}
                          width={1200}
                          height={900}
                          className="w-full h-auto max-h-[65vh] object-contain p-4"
                          placeholder="empty"
                          priority
                        />
                      </TransformComponent>

                      {/* Reset zoom button */}
                      <button
                        onClick={() => resetTransform()}
                        aria-label="Reset zoom"
                        className="absolute bottom-3 right-3 z-10 font-heading text-[9px] tracking-[0.25em] text-sapling/50 hover:text-sapling border border-sapling/20 hover:border-sapling/40 px-3 py-1.5 transition-colors duration-200 bg-lunar/80 backdrop-blur-sm"
                      >
                        RESET VIEW
                      </button>
                    </>
                  )}
                </TransformWrapper>
              </div>
            ) : (
              <div className="aspect-[4/3] flex items-center justify-center">
                <span className="font-heading text-[10px] tracking-heading text-white/20">
                  FLOORPLAN COMING SOON
                </span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── RIGHT: Unit Info ───────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${unit.id}-info`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={transition}
            className="flex flex-col gap-6"
          >
            {/* Unit name + badge */}
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-display text-sapling text-2xl uppercase tracking-wide">
                {unit.name}
              </h2>
              <Badge variant={unit.status} />
            </div>

            {/* Download buttons — top of panel so they're never below fold */}
            <div className="flex flex-col gap-2.5">
              {unit.floorplanPdf && (
                <a
                  href={unit.floorplanPdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 font-heading text-[10px] tracking-heading bg-sapling text-lunar px-5 py-3 hover:bg-sapling/90 transition-colors duration-200"
                >
                  <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true">
                    <path d="M1 1H8L11 4V13H1V1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                    <path d="M8 1V4H11" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                    <path d="M3.5 7.5H8.5M6 5.5V9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  DOWNLOAD FLOORPLAN PDF
                </a>
              )}
              {unit.allFloorsPdf && (
                <a
                  href={unit.allFloorsPdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center font-heading text-[10px] tracking-heading text-white/60 border border-white/20 px-5 py-3 hover:border-white/40 hover:text-white/80 transition-colors duration-200"
                >
                  ALL FLOORS PDF
                </a>
              )}
            </div>

            {/* Specs grid — 3×2, bg-white/10 with gap-px pattern */}
            <div className="grid grid-cols-3 gap-px bg-white/10">
              {specs.map(({ label, value }) => (
                <div
                  key={label}
                  className="flex flex-col items-center justify-center text-center bg-lunar px-2 py-3"
                >
                  <span className="font-body text-white/40 text-[9px] uppercase tracking-widest mb-1">
                    {label}
                  </span>
                  <span className="font-body text-white text-base font-medium leading-none">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Floor summaries */}
            <div className="space-y-0 divide-y divide-white/10">
              {floorEntries.map((floor) => (
                <div key={floor} className="flex gap-3 py-2.5">
                  <span className="font-heading text-[9px] tracking-heading text-sapling/70 w-14 shrink-0 pt-0.5">
                    {FLOOR_LABELS[floor].toUpperCase()}
                  </span>
                  <span className="font-body text-white/60 text-sm leading-snug">
                    {unit.floorSummaries[floor]}
                  </span>
                </div>
              ))}
            </div>

            {/* Finish packages */}
            {unit.finishPackages && unit.finishPackages.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="font-heading text-[9px] tracking-heading text-white/30 mr-1">
                  FINISHES
                </span>
                {unit.finishPackages.map((pkg) => (
                  <span
                    key={pkg}
                    className="font-heading text-[10px] text-sapling border border-sapling/40 px-3 py-1 uppercase"
                  >
                    {pkg}
                  </span>
                ))}
              </div>
            )}

            {/* Gallery link */}
            <Link
              href="/gallery"
              className="font-heading text-[10px] tracking-heading text-sapling/60 hover:text-sapling transition-colors duration-200 self-start"
            >
              EXPLORE THE GALLERY →
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

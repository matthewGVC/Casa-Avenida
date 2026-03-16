"use client";

import { useState } from "react";
import Image from "next/image";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import type { Unit } from "@/lib/types";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { encodeImagePath } from "@/lib/content";

type FloorKey = "ground" | "second" | "third" | "fourth";

const FLOOR_LABELS: Record<FloorKey, string> = {
  ground: "Ground",
  second: "Second",
  third: "Third",
  fourth: "Fourth",
};

const FLOORS: FloorKey[] = ["ground", "second", "third", "fourth"];

interface FloorplanViewerProps {
  unit: Unit;
}

/**
 * Floorplan tab content.
 * Shows the combined all-floors info tab image.
 * Floor selector drives the summary text shown below.
 * "All Floors" toggle shows every floor summary simultaneously.
 */
export default function FloorplanViewer({ unit }: FloorplanViewerProps) {
  const [activeFloor, setActiveFloor] = useState<FloorKey>("ground");
  const [showAllFloors, setShowAllFloors] = useState(false);
  // Unit 5: ground floor alternates
  const [groundAlt, setGroundAlt] = useState<1 | 2>(1);

  const hasImage = Boolean(unit.allFloorsImage);
  const activeSummary = unit.floorSummaries?.[activeFloor] ?? "";

  return (
    <div className="space-y-6">
      {/* PDF download links — above the viewer */}
      <div className="flex flex-wrap gap-3">
        {unit.floorplanPdf && (
          <a
            href={unit.floorplanPdf}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-heading text-[10px] tracking-heading text-sapling border border-sapling/40 hover:border-sapling px-5 py-2.5 transition-colors duration-200"
          >
            <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true">
              <path
                d="M1 1H8L11 4V13H1V1Z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <path d="M8 1V4H11" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
              <path d="M3.5 7.5H8.5M6 5.5V9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            DOWNLOAD FLOORPLAN
          </a>
        )}
        {unit.allFloorsPdf && (
          <a
            href={unit.allFloorsPdf}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-heading text-[10px] tracking-heading text-white/50 border border-white/20 hover:border-white/40 hover:text-white/70 px-5 py-2.5 transition-colors duration-200"
          >
            ALL FLOORS PDF
          </a>
        )}
      </div>

      {/* Floor selector + All Floors toggle */}
      <div className="flex flex-wrap items-center gap-2">
        {FLOORS.map((floor) => (
          <button
            key={floor}
            onClick={() => { setActiveFloor(floor); setShowAllFloors(false); }}
            aria-pressed={!showAllFloors && activeFloor === floor}
            className={`
              font-heading text-[10px] tracking-heading px-4 py-2 border transition-colors duration-200
              ${!showAllFloors && activeFloor === floor
                ? "border-sapling text-sapling bg-sapling/10"
                : "border-white/20 text-white/50 hover:border-white/40 hover:text-white/70"}
            `}
          >
            {FLOOR_LABELS[floor].toUpperCase()}
          </button>
        ))}

        {/* Divider */}
        <div className="w-px h-4 bg-white/15 mx-1" aria-hidden="true" />

        {/* All Floors toggle */}
        <button
          onClick={() => setShowAllFloors((v) => !v)}
          aria-pressed={showAllFloors}
          className={`
            font-heading text-[10px] tracking-heading px-4 py-2 border transition-colors duration-200
            ${showAllFloors
              ? "border-sapling text-sapling bg-sapling/10"
              : "border-white/20 text-white/50 hover:border-white/40 hover:text-white/70"}
          `}
        >
          ALL FLOORS
        </button>
      </div>

      {/* Unit 5 ground alt sub-selector */}
      {unit.groundFloorAlternates && activeFloor === "ground" && !showAllFloors && (
        <div className="flex gap-2">
          {([1, 2] as const).map((alt) => (
            <button
              key={alt}
              onClick={() => setGroundAlt(alt)}
              aria-pressed={groundAlt === alt}
              className={`
                font-heading text-[10px] tracking-heading px-3 py-1.5 border transition-colors duration-200
                ${groundAlt === alt
                  ? "border-sapling/60 text-sapling/80"
                  : "border-white/15 text-white/40 hover:border-white/30"}
              `}
            >
              ALT. {alt}
            </button>
          ))}
        </div>
      )}

      {/* Floor summary — single floor mode */}
      {!showAllFloors && activeSummary && (
        <p className="font-body text-white/60 text-sm leading-snug">
          <span className="text-sapling/70 font-medium mr-2">
            {FLOOR_LABELS[activeFloor]} Level —
          </span>
          {activeSummary}
        </p>
      )}

      {/* All Floors summary — stacked list */}
      {showAllFloors && unit.floorSummaries && (
        <div className="space-y-2 border-l border-sapling/20 pl-4">
          {FLOORS.map((floor) => {
            const summary = unit.floorSummaries?.[floor];
            if (!summary) return null;
            return (
              <p key={floor} className="font-body text-white/60 text-sm leading-snug">
                <span className="text-sapling/70 font-medium mr-2">
                  {FLOOR_LABELS[floor]} —
                </span>
                {summary}
              </p>
            );
          })}
        </div>
      )}

      {/* Floorplan image (combined all-floors view) */}
      <div className="relative w-full bg-white/5 border border-white/10 overflow-hidden">
        {hasImage ? (
          <TransformWrapper
            initialScale={1}
            minScale={0.8}
            maxScale={4}
            centerOnInit
            wheel={{ step: 0.1 }}
            pinch={{ step: 5 }}
          >
            {({ resetTransform }) => (
              <div className="relative w-full overflow-hidden" style={{ paddingBottom: "75%" }}>
                {/* Zoom hint */}
                <span className="absolute top-3 left-3 z-10 font-body text-[10px] text-white/30 pointer-events-none select-none">
                  Scroll or pinch to zoom
                </span>

                <TransformComponent
                  wrapperStyle={{ width: "100%", display: "block", position: "absolute", inset: 0 }}
                  contentStyle={{ width: "100%", height: "100%" }}
                >
                  <div className="relative w-full h-full bg-[#373A36]">
                    <Image
                      src={encodeImagePath(unit.allFloorsImage)}
                      alt={`${unit.name} — All Floors Floorplan`}
                      fill
                      className="object-contain p-4"
                      placeholder="empty"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw"
                      priority
                    />
                  </div>
                </TransformComponent>

                {/* Reset zoom button */}
                <button
                  onClick={() => resetTransform()}
                  aria-label="Reset zoom"
                  className="absolute bottom-3 right-3 z-10 font-heading text-[9px] tracking-heading text-white/40 border border-white/15 hover:border-white/30 hover:text-white/60 px-3 py-1.5 transition-colors duration-200 bg-lunar/80 backdrop-blur-sm"
                >
                  RESET
                </button>
              </div>
            )}
          </TransformWrapper>
        ) : (
          <div className="aspect-[4/3]">
            <ImagePlaceholder label="Floorplan Coming Soon" className="h-full" />
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import type { POI, POICategory } from "@/lib/types";

const CATEGORY_LABELS: Record<POICategory | "all", string> = {
  all: "All",
  restaurant: "Dining",
  hotel: "Hotels",
  beach: "Beach",
  fitness: "Fitness",
  grocery: "Grocery",
  entertainment: "Entertainment",
};

const CATEGORY_COLORS: Record<POICategory, string> = {
  restaurant: "bg-amber-500",
  hotel: "bg-bahama",
  beach: "bg-sky-400",
  fitness: "bg-emerald-500",
  grocery: "bg-lime-500",
  entertainment: "bg-sapling",
};

interface NeighborhoodMapProps {
  pois: POI[];
}

/**
 * Neighborhood POI section.
 * Uses a styled static visual map placeholder.
 * Google Maps integration ready — wire up NEXT_PUBLIC_GOOGLE_MAPS_API_KEY when available.
 * Category filter toggles which pins / list items are shown.
 * Click a POI card → branded detail panel.
 */
export default function NeighborhoodMap({ pois }: NeighborhoodMapProps) {
  const [activeCategory, setActiveCategory] = useState<POICategory | "all">("all");
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);

  const categories: (POICategory | "all")[] = [
    "all",
    ...Array.from(new Set(pois.map((p) => p.category))),
  ];

  const filtered =
    activeCategory === "all" ? pois : pois.filter((p) => p.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Category filter */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setSelectedPoi(null);
            }}
            aria-pressed={activeCategory === cat}
            className={`
              font-heading text-[10px] tracking-heading px-4 py-2 border transition-colors duration-200
              ${
                activeCategory === cat
                  ? "border-sapling text-sapling bg-sapling/10"
                  : "border-white/20 text-white/50 hover:border-white/40 hover:text-white/70"
              }
            `}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Map + list layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Static map placeholder */}
        <div className="lg:col-span-3 relative min-h-[360px] lg:min-h-[480px] bg-white/5 border border-white/10 overflow-hidden">
          {/* Decorative grid overlay — evokes a map aesthetic */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "linear-gradient(var(--color-sapling) 1px, transparent 1px), linear-gradient(90deg, var(--color-sapling) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Casa Avenida pin — center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-sapling flex items-center justify-center shadow-[0_0_0_8px_rgba(223,209,167,0.15)]">
                <span className="font-display text-lunar text-sm">A</span>
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-sapling" />
            </div>
          </div>

          {/* POI pins — positioned relative to center */}
          {filtered.map((poi, i) => {
            // Simple spread positions around the center marker
            const angle = (i / filtered.length) * 2 * Math.PI - Math.PI / 4;
            const r = 28 + (i % 3) * 10; // 28-48% from center
            const left = 50 + r * Math.cos(angle);
            const top = 50 + r * Math.sin(angle);

            return (
              <button
                key={poi.id}
                onClick={() => setSelectedPoi(poi === selectedPoi ? null : poi)}
                aria-label={`View ${poi.name}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: `${Math.max(8, Math.min(92, left))}%`, top: `${Math.max(8, Math.min(92, top))}%` }}
              >
                <div
                  className={`
                    w-3 h-3 rounded-full border-2 border-lunar transition-transform duration-200 group-hover:scale-125
                    ${CATEGORY_COLORS[poi.category]}
                    ${selectedPoi?.id === poi.id ? "scale-150 ring-2 ring-sapling ring-offset-1 ring-offset-lunar" : ""}
                  `}
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-heading text-[9px] tracking-heading text-white/70 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-lunar/80 px-1.5 py-0.5">
                  {poi.name}
                </span>
              </button>
            );
          })}

          {/* Address label */}
          <div className="absolute bottom-4 left-4">
            <p className="font-heading text-sapling/60 text-[9px] tracking-heading">
              102 SE 5TH AVE · DELRAY BEACH
            </p>
          </div>

          {/* Maps API notice */}
          <div className="absolute top-3 right-3">
            <p className="font-heading text-white/20 text-[8px] tracking-heading">
              INTERACTIVE MAP COMING SOON
            </p>
          </div>
        </div>

        {/* POI list / detail panel */}
        <div className="lg:col-span-2 space-y-2 max-h-[480px] overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
          {selectedPoi ? (
            /* Detail panel */
            <div className="border border-sapling/30 p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-heading text-sapling text-xs tracking-heading">
                    {CATEGORY_LABELS[selectedPoi.category].toUpperCase()}
                  </p>
                  <h3 className="font-body text-white text-base font-medium mt-1">
                    {selectedPoi.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedPoi(null)}
                  aria-label="Close detail"
                  className="text-white/30 hover:text-sapling transition-colors mt-1"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${CATEGORY_COLORS[selectedPoi.category]}`} />
                <span className="font-heading text-white/40 text-[10px] tracking-heading">
                  {selectedPoi.distanceText.toUpperCase()}
                </span>
              </div>
              {selectedPoi.description && (
                <p className="font-body text-white/60 text-sm leading-relaxed">
                  {selectedPoi.description}
                </p>
              )}
            </div>
          ) : (
            /* List */
            filtered.map((poi) => (
              <button
                key={poi.id}
                onClick={() => setSelectedPoi(poi)}
                className="w-full flex items-start gap-3 p-3 border border-white/10 hover:border-sapling/30 transition-colors duration-200 text-left group"
              >
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${CATEGORY_COLORS[poi.category]}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-body text-white/80 text-sm group-hover:text-white transition-colors leading-snug truncate">
                    {poi.name}
                  </p>
                  <p className="font-heading text-white/30 text-[9px] tracking-heading mt-0.5">
                    {poi.distanceText.toUpperCase()} · {CATEGORY_LABELS[poi.category].toUpperCase()}
                  </p>
                </div>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="shrink-0 text-white/20 group-hover:text-sapling/60 mt-1 transition-colors">
                  <path d="M2 6H10M7 3L10 6L7 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

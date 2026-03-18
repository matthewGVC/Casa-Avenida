"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { POI, POICategory } from "@/lib/types";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full min-h-[360px] lg:min-h-[480px] bg-lunar border border-white/10 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border border-sapling/30 flex items-center justify-center">
          <span className="font-display text-sapling text-sm">A</span>
        </div>
        <p className="font-heading text-white/20 text-[9px] tracking-widest">LOADING MAP…</p>
      </div>
    </div>
  ),
});

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
        {/* Interactive Leaflet map */}
        <div aria-hidden="true" className="lg:col-span-3 relative min-h-[360px] lg:min-h-[480px] border border-white/10 overflow-hidden">
          <LeafletMap
            filtered={filtered}
            selectedPoi={selectedPoi}
            onSelectPoi={setSelectedPoi}
          />
          {/* Branded attribution */}
          <div className="absolute bottom-3 left-3 z-[400] pointer-events-none">
            <p className="font-heading text-sapling/40 text-[8px] tracking-heading">
              102 SE 5TH AVE · DELRAY BEACH
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

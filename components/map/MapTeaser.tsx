"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { POI } from "@/lib/types";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-lunar flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border border-sapling/30 flex items-center justify-center">
          <span className="font-display text-sapling text-sm">A</span>
        </div>
        <p className="font-heading text-white/20 text-[9px] tracking-widest">LOADING MAP...</p>
      </div>
    </div>
  ),
});

interface MapTeaserProps {
  pois: POI[];
}

export default function MapTeaser({ pois }: MapTeaserProps) {
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);

  return (
    <div className="w-full h-full relative overflow-hidden">
      <LeafletMap
        filtered={pois}
        selectedPoi={selectedPoi}
        onSelectPoi={setSelectedPoi}
      />

      {selectedPoi && (
        <div
          className="absolute bottom-4 left-4 right-4 z-[500] border border-sapling/40 p-4"
          style={{ background: "rgba(20,17,10,0.92)", backdropFilter: "blur(8px)" }}
        >
          <div className="flex justify-between items-start gap-3">
            <div>
              <p className="font-heading text-sapling/60 text-[9px] tracking-heading uppercase">
                {selectedPoi.category}
              </p>
              <p className="font-body text-white text-sm font-medium mt-0.5">
                {selectedPoi.name}
              </p>
              <p className="font-heading text-white/40 text-[9px] tracking-heading mt-0.5">
                {selectedPoi.distanceText.toUpperCase()}
              </p>
            </div>
            <button
              onClick={() => setSelectedPoi(null)}
              aria-label="Close"
              className="text-white/30 hover:text-sapling transition-colors mt-0.5 shrink-0"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M2 2L12 12M12 2L2 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
          {selectedPoi.description && (
            <p className="font-body text-white/50 text-xs leading-relaxed mt-2 line-clamp-2">
              {selectedPoi.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

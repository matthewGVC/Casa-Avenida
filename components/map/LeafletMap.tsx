"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import type { POI } from "@/lib/types";

// ── Types ────────────────────────────────────────────────────────────────────

interface LeafletMapProps {
  filtered: POI[];
  selectedPoi: POI | null;
  onSelectPoi: (poi: POI | null) => void;
}

// ── Casa Avenida coordinates ─────────────────────────────────────────────────

const CASA_AVENIDA: [number, number] = [26.4616, -80.0731];

// ── Custom icons ─────────────────────────────────────────────────────────────

function createHomeIcon(): L.DivIcon {
  return L.divIcon({
    html: `<div class="ca-pin-home">
      <div class="ca-pin-home__dot">A</div>
      <div class="ca-pin-home__tail"></div>
    </div>`,
    className: "",
    iconSize: [40, 48],
    iconAnchor: [20, 48],
    popupAnchor: [0, -48],
  });
}

function createPoiIcon(category: string, isSelected: boolean): L.DivIcon {
  const selected = isSelected ? " ca-pin-poi--selected" : "";
  const cls = `ca-pin-poi ca-pin-poi--${category}${selected}`;
  const size = isSelected ? 18 : 12;
  return L.divIcon({
    html: `<div class="${cls}"></div>`,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

// Fix 1a: Stable module-level home icon — created once, never recreated on render
const HOME_ICON = createHomeIcon();

// ── Pan-to effect ────────────────────────────────────────────────────────────

function MapPanner({ selectedPoi }: { selectedPoi: POI | null }) {
  const map = useMap();
  const prevId = useRef<string | null>(null);

  useEffect(() => {
    // Fix 4: Guard against calling panTo before Leaflet map is fully initialised
    if (!selectedPoi || selectedPoi.id === prevId.current) return;
    if (!map.getContainer()) return;
    prevId.current = selectedPoi.id;
    map.panTo([selectedPoi.lat, selectedPoi.lng], { animate: true, duration: 0.5 });
  }, [selectedPoi, map]);

  return null;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function LeafletMap({ filtered, selectedPoi, onSelectPoi }: LeafletMapProps) {
  // Fix 1b: Stable POI icons — only recalculated when filtered list or selection changes
  const poiIcons = useMemo(
    () =>
      new Map(
        filtered.map((poi) => [
          poi.id,
          createPoiIcon(poi.category, selectedPoi?.id === poi.id),
        ])
      ),
    [filtered, selectedPoi]
  );

  return (
    // Fix 2a: Remove attributionControl={false} — attribution is legally required for CARTO/OSM
    <MapContainer
      center={CASA_AVENIDA}
      zoom={15}
      scrollWheelZoom={false}
      zoomControl={false}
      className="w-full h-full min-h-[360px] lg:min-h-[480px]"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        maxZoom={20}
        subdomains="abcd"
      />

      {/* Casa Avenida home pin — Fix 1a: uses module-level HOME_ICON constant */}
      <Marker position={CASA_AVENIDA} icon={HOME_ICON} />

      {/* POI pins — Fix 1b: icons sourced from stable useMemo map */}
      {filtered.map((poi) => (
        <Marker
          key={poi.id}
          position={[poi.lat, poi.lng]}
          icon={poiIcons.get(poi.id) ?? createPoiIcon(poi.category, false)}
          eventHandlers={{
            click: () => onSelectPoi(selectedPoi?.id === poi.id ? null : poi),
          }}
        />
      ))}

      <MapPanner selectedPoi={selectedPoi} />
    </MapContainer>
  );
}

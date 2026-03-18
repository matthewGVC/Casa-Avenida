"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useMemo, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
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
    if (!selectedPoi || selectedPoi.id === prevId.current) return;
    if (!map.getContainer()) return;
    prevId.current = selectedPoi.id;
    map.panTo([selectedPoi.lat, selectedPoi.lng], { animate: true, duration: 0.5 });
  }, [selectedPoi, map]);

  return null;
}

// ── Branded zoom + reset controls ────────────────────────────────────────────

function MapControls() {
  const map = useMap();

  const handleZoomIn = useCallback(() => map.zoomIn(), [map]);
  const handleZoomOut = useCallback(() => map.zoomOut(), [map]);
  const handleReset = useCallback(
    () => map.setView(CASA_AVENIDA, 15, { animate: true }),
    [map]
  );

  return (
    <div className="ca-map-controls">
      <button
        onClick={handleZoomIn}
        className="ca-map-btn"
        aria-label="Zoom in"
        title="Zoom in"
      >
        +
      </button>
      <button
        onClick={handleZoomOut}
        className="ca-map-btn"
        aria-label="Zoom out"
        title="Zoom out"
      >
        −
      </button>
      {/* Divider */}
      <div className="ca-map-btn-divider" />
      {/* Reset to home */}
      <button
        onClick={handleReset}
        className="ca-map-btn ca-map-btn--home"
        aria-label="Reset map to Casa Avenida"
        title="Reset view"
      >
        A
      </button>
    </div>
  );
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

      {/* Casa Avenida home pin with permanent branded label */}
      <Marker position={CASA_AVENIDA} icon={HOME_ICON}>
        <Tooltip
          permanent
          direction="top"
          offset={[0, -52]}
          className="ca-home-label"
        >
          CASA AVENIDA
        </Tooltip>
      </Marker>

      {/* POI pins */}
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
      <MapControls />
    </MapContainer>
  );
}

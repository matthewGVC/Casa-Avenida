"use client";

import type { GalleryCategory } from "@/lib/types";

const CATEGORY_LABELS: Record<GalleryCategory | "all", string> = {
  all: "All",
  interiors: "Interiors",
  kitchen: "Kitchen",
  "primary-suite": "Primary Suite",
  living: "Living",
  terrace: "Terrace",
  pool: "Pool",
  rooftop: "Rooftop",
  exterior: "Exterior",
};

interface CategoryFilterProps {
  categories: (GalleryCategory | "all")[];
  active: GalleryCategory | "all";
  onChange: (cat: GalleryCategory | "all") => void;
}

export default function CategoryFilter({ categories, active, onChange }: CategoryFilterProps) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="Filter gallery by category"
    >
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          aria-pressed={active === cat}
          className={`
            font-heading text-[10px] tracking-heading px-4 py-2 border transition-colors duration-200
            ${
              active === cat
                ? "border-sapling text-sapling bg-sapling/10"
                : "border-white/20 text-white/50 hover:border-white/40 hover:text-white/70"
            }
          `}
        >
          {CATEGORY_LABELS[cat] ?? cat}
        </button>
      ))}
    </div>
  );
}

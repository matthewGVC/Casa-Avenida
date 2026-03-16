import Link from "next/link";
import Image from "next/image";
import type { Unit } from "@/lib/types";
import Badge from "@/components/ui/Badge";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { formatSF, encodeImagePath } from "@/lib/content";

interface UnitCardProps {
  unit: Unit;
  /** Stagger delay in ms */
  delay?: number;
}

export default function UnitCard({ unit }: UnitCardProps) {
  const hasHero = Boolean(unit.heroImage);

  return (
    <Link
      href={`/residences/${unit.id}`}
      className="group block bg-lunar border border-white/10 hover:border-sapling/40 transition-colors duration-300"
      aria-label={`View ${unit.name} — ${unit.tagline}`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#373A36]">
        {hasHero ? (
          <Image
            src={encodeImagePath(unit.heroImage)}
            alt={`${unit.name} — ${unit.tagline}`}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
            placeholder="empty"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <ImagePlaceholder label={unit.name} className="absolute inset-0" />
        )}

        {/* Status badge — bottom left */}
        <div className="absolute bottom-3 left-3">
          <Badge variant={unit.status} />
        </div>
      </div>

      {/* Info */}
      <div className="p-5 lg:p-6">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h2 className="font-heading text-white text-xs tracking-heading uppercase">
            {unit.name}
          </h2>
          <span className="font-heading text-sapling text-xs tracking-nav shrink-0">
            {unit.priceDisplay}
          </span>
        </div>

        <p className="font-body text-white/60 text-sm leading-snug mb-4 line-clamp-2">
          {unit.tagline}
        </p>

        {/* Specs row */}
        <div className="flex items-center gap-4 border-t border-white/10 pt-4">
          <Spec label="BED" value={unit.bedrooms} />
          <div className="w-px h-4 bg-white/10" />
          <Spec label="BATH" value={unit.bathrooms} />
          <div className="w-px h-4 bg-white/10" />
          <Spec label="SF" value={formatSF(unit.underAirSF)} />
          <div className="w-px h-4 bg-white/10" />
          <Spec label="LEVELS" value={unit.levels} />
        </div>
      </div>
    </Link>
  );
}

function Spec({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-heading text-white/40 text-[10px] tracking-heading">{label}</span>
      <span className="font-body text-white text-sm font-medium">{value}</span>
    </div>
  );
}
